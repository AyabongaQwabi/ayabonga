/**
 * Social Media Post Scheduler
 *
 * Usage:
 *   node scripts/social/post.js [--facebook-only] [--instagram-only] [--dry-run] [--date YYYY-MM-DD]
 *   node scripts/social/post.js --dry-run --date 2026-05-18   # previews + fetches image URL
 *   SOCIAL_DEBUG=1 node scripts/social/post.js ...            # verbose errors
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { postToFacebook, postPhotoToFacebook } from './facebook.js';
import { postToInstagram } from './instagram.js';
import { fetchImageUrl } from './image.js';
import { loadEnvFiles, envStatus } from './load-env.js';
import { pageAccessToken } from './graph-config.js';
import { resolveMetaIds } from './resolve-meta.js';
import { isInstagramEnabled, instagramPauseReason } from './flags.js';
import { log, logBanner, logError } from './log.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calendar = JSON.parse(readFileSync(join(__dirname, 'calendar.json'), 'utf8'));

const DAYS = { 1: 'monday', 3: 'wednesday', 5: 'friday' };

const loadedEnv = loadEnvFiles();
if (loadedEnv.length) {
  log('init', 'Loaded environment files', { files: loadedEnv.join(', ') });
}

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getCurrentPost(overrideDate) {
  const now = overrideDate ? parseLocalDate(overrideDate) : new Date();
  const dayName = DAYS[now.getDay()];

  if (!dayName) {
    log('calendar', 'Not a posting day', { date: now.toDateString() });
    return null;
  }

  const start = parseLocalDate(calendar.startDate);
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  if (daysDiff < 0) {
    log('calendar', 'Campaign not started yet', { starts: calendar.startDate });
    return null;
  }

  const weekIndex = Math.floor(daysDiff / 7);
  const post = calendar.posts.find((p) => p.week === weekIndex + 1 && p.day === dayName);

  if (!post) {
    log('calendar', 'No slot for this date', { week: weekIndex + 1, day: dayName });
    return null;
  }

  return { post, weekIndex, dayName, date: formatLocalDate(now) };
}

function formatLocalDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return null;
  return process.argv[idx + 1];
}

function checkEnvForImage(instagram) {
  const media = instagram.media ?? 'photo';
  const missing = [];
  if (media === 'photo' && !process.env.PEXELS_API_KEY) missing.push('PEXELS_API_KEY');
  if (media === 'vector') {
    if (!process.env.VECTEEZY_ACCOUNT_ID) missing.push('VECTEEZY_ACCOUNT_ID');
    if (!process.env.VECTEEZY_SECRET_KEY) missing.push('VECTEEZY_SECRET_KEY');
  }
  if (missing.length) {
    throw new Error(`Missing required env for image: ${missing.join(', ')}`);
  }
}

async function checkEnvForPost({ facebookOnly, instagramOnly, post, instagramEnabled }) {
  log('init', 'Environment check (before resolve)', envStatus());

  if (instagramOnly && !instagramEnabled) {
    throw new Error(`${instagramPauseReason()}. Remove --instagram-only or enable Instagram.`);
  }

  const hasPageToken = !!pageAccessToken();
  const hasUserAccountsFlow =
    !!process.env.FACEBOOK_USER_TOKEN &&
    !!process.env.APP_SCOPED_USER_ID &&
    !!process.env.FACEBOOK_PAGE_ID;

  if (!hasPageToken && !hasUserAccountsFlow) {
    throw new Error(
      'Set FACEBOOK_PAGE_ACCESS_TOKEN (page token), or FACEBOOK_USER_TOKEN + APP_SCOPED_USER_ID + FACEBOOK_PAGE_ID'
    );
  }

  const needsFacebook = !instagramOnly && post.facebook;
  const needsInstagram = instagramEnabled && !facebookOnly && post.instagram;

  if (needsFacebook || needsInstagram) {
    await resolveMetaIds();
  }

  if (needsInstagram) {
    checkEnvForImage(post.instagram);
  }

  log('init', 'Environment check (after resolve)', envStatus());

  const missing = [];
  if (needsFacebook && !process.env.FACEBOOK_PAGE_ID) missing.push('FACEBOOK_PAGE_ID');
  if (needsInstagram) {
    if (!process.env.INSTAGRAM_ACCOUNT_ID) missing.push('INSTAGRAM_ACCOUNT_ID');
    if (!process.env.INSTAGRAM_ACCESS_TOKEN) missing.push('INSTAGRAM_ACCESS_TOKEN');
  }

  if (missing.length) {
    throw new Error(`Missing required env: ${[...new Set(missing)].join(', ')}`);
  }
}

async function resolveInstagramImage(instagram) {
  return fetchImageUrl(instagram.query, {
    media: instagram.media,
    source: instagram.imageSource,
    url: instagram.imageUrl,
  });
}

async function run() {
  const args = process.argv.slice(2);
  const facebookOnly = args.includes('--facebook-only');
  const instagramOnly = args.includes('--instagram-only');
  const dryRun = args.includes('--dry-run');
  const skipImageFetch = args.includes('--skip-image-fetch');
  const overrideDate = getArgValue('--date') || process.env.SOCIAL_POST_DATE || null;
  const instagramEnabled = isInstagramEnabled();

  log('init', 'Starting social poster', {
    dryRun,
    facebookOnly,
    instagramOnly,
    instagramEnabled,
    date: overrideDate ?? 'today',
  });

  if (!instagramEnabled) {
    log('init', instagramPauseReason());
  }

  const result = getCurrentPost(overrideDate);
  if (!result) process.exit(0);

  const { post, weekIndex, dayName, date } = result;
  log('calendar', 'Selected slot', { week: weekIndex + 1, day: dayName, date });

  const summary = {
    imageUrl: null,
    facebookUrl: null,
    instagramUrl: null,
    instagramMediaUrl: null,
  };

  if (dryRun) {
    log('dry-run', 'Preview mode (no posts will be published)');

    const willUseFacebookPhoto =
      post.facebook && post.instagram && !facebookOnly && (!instagramOnly || !instagramEnabled);

    if (post.facebook && !instagramOnly) {
      log('dry-run', 'Facebook message', { preview: post.facebook.slice(0, 120) + '…' });
      log('dry-run', 'Facebook endpoint', {
        type: willUseFacebookPhoto ? 'POST /{page-id}/photos (with image)' : 'POST /{page-id}/feed (text only)',
      });
    }

    const fetchImageForFacebook =
      post.instagram && !facebookOnly && (!instagramOnly || !instagramEnabled);

    if (fetchImageForFacebook) {
      if (instagramEnabled && !instagramOnly) {
        const media = post.instagram.media ?? 'photo';
        log('dry-run', 'Instagram caption (paused, not posted)', { caption: post.instagram.caption });
        log('dry-run', 'Instagram media', { media, provider: media === 'vector' ? 'Vecteezy' : 'Pexels' });
      }

      if (!skipImageFetch) {
        try {
          checkEnvForImage(post.instagram);
          summary.imageUrl = await resolveInstagramImage(post.instagram);
        } catch (err) {
          logError('dry-run', 'Image fetch failed (add PEXELS_API_KEY to .env.local or use --skip-image-fetch)', err);
        }
      } else {
        log('dry-run', 'Image fetch skipped (--skip-image-fetch)');
      }
    }

    logBanner('DRY RUN SUMMARY', [
      summary.imageUrl ? `Image URL (open in browser):\n  ${summary.imageUrl}` : 'Image URL: (not fetched)',
      willUseFacebookPhoto && summary.imageUrl
        ? `Facebook: would POST /photos with this image`
        : 'Facebook: would POST /feed (text only)',
      instagramEnabled ? 'Instagram: (not posted in dry run)' : 'Instagram: paused',
    ]);
    process.exit(0);
  }

  try {
    await checkEnvForPost({ facebookOnly, instagramOnly, post, instagramEnabled });
  } catch (err) {
    logError('init', 'Environment incomplete', err);
    process.exit(1);
  }

  const errors = [];
  const testPrefix = '[TEST POST — safe to delete]\n\n';
  const useFacebookPhoto = Boolean(post.facebook && post.instagram && !instagramOnly);

  if (!facebookOnly && post.instagram) {
    try {
      summary.imageUrl = await resolveInstagramImage(post.instagram);
      logBanner('STOCK IMAGE URL', [
        instagramEnabled
          ? 'Used for Instagram image_url and Facebook /photos url:'
          : 'Used for Facebook /photos url (Instagram paused):',
        summary.imageUrl,
      ]);
    } catch (err) {
      logError('image', 'Could not fetch image (Instagram and photo-Facebook need this)', err);
      errors.push(err);
    }
  }

  if (!instagramOnly && post.facebook && summary.imageUrl && useFacebookPhoto) {
    try {
      const fb = await postPhotoToFacebook(summary.imageUrl, `${testPrefix}${post.facebook}`);
      summary.facebookUrl = fb.permalink;
      log('facebook', 'Photo post published', { imageUrl: summary.imageUrl });
    } catch (err) {
      logError('facebook', 'Photo post failed', err);
      errors.push(err);
    }
  } else if (!instagramOnly && post.facebook) {
    try {
      const fb = await postToFacebook(`${testPrefix}${post.facebook}`);
      summary.facebookUrl = fb.permalink;
    } catch (err) {
      logError('facebook', 'Feed post failed', err);
      errors.push(err);
    }
  }

  if (instagramEnabled && !facebookOnly && post.instagram && summary.imageUrl) {
    try {
      const ig = await postToInstagram(
        summary.imageUrl,
        `${testPrefix}${post.instagram.caption}`
      );
      summary.instagramUrl = ig.permalink;
      summary.instagramMediaUrl = ig.mediaUrl;
    } catch (err) {
      logError('instagram', 'Post failed', err);
      errors.push(err);
    }
  } else if (!facebookOnly && post.instagram && !instagramEnabled) {
    log('instagram', instagramPauseReason());
  }

  logBanner('POST RESULTS', [
    summary.imageUrl && `Image URL:\n  ${summary.imageUrl}`,
    summary.facebookUrl && `Facebook post:\n  ${summary.facebookUrl}`,
    instagramEnabled && summary.instagramUrl && `Instagram post:\n  ${summary.instagramUrl}`,
    instagramEnabled &&
      summary.instagramMediaUrl &&
      `Instagram CDN media:\n  ${summary.instagramMediaUrl}`,
    !instagramEnabled && 'Instagram: paused (Facebook-only run)',
    errors.length ? `Errors: ${errors.length} (see logs above)` : 'Status: success',
  ]);

  if (errors.length) process.exit(1);
}

run().catch((err) => {
  logError('fatal', 'Unhandled error', err);
  process.exit(1);
});
