/**
 * Social Media Post Scheduler
 * 
 * Determines which post to publish based on:
 * - The calendar start date (set in calendar.json)
 * - The current date (provided by GitHub Actions environment)
 * - The day of the week (mon/wed/fri)
 * 
 * Usage:
 *   node scripts/social/post.js [--facebook-only] [--instagram-only] [--dry-run]
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { postToFacebook } from './facebook.js';
import { postToInstagram } from './instagram.js';
import { fetchImageUrl } from './image.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calendar = JSON.parse(readFileSync(join(__dirname, 'calendar.json'), 'utf8'));

const DAYS = { 1: 'monday', 3: 'wednesday', 5: 'friday' };

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getCurrentPost(overrideDate) {
  const now = overrideDate ? parseLocalDate(overrideDate) : new Date();
  const dayName = DAYS[now.getDay()];

  if (!dayName) {
    console.log(`ℹ️  Today (${now.toDateString()}) is not a posting day. Exiting.`);
    return null;
  }

  const start = parseLocalDate(calendar.startDate);
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  if (daysDiff < 0) {
    console.log(`ℹ️  Campaign has not started yet (starts ${calendar.startDate}). Exiting.`);
    return null;
  }

  // Which week are we in (0-indexed)
  const weekIndex = Math.floor(daysDiff / 7);

  // Find the post for this week + day
  const post = calendar.posts.find(
    (p) => p.week === weekIndex + 1 && p.day === dayName
  );

  if (!post) {
    console.log(`ℹ️  No post found for week ${weekIndex + 1}, ${dayName}. Campaign may be complete.`);
    return null;
  }

  return { post, weekIndex, dayName };
}

function getArgValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1 || idx + 1 >= process.argv.length) return null;
  return process.argv[idx + 1];
}

async function run() {
  const args = process.argv.slice(2);
  const facebookOnly = args.includes('--facebook-only');
  const instagramOnly = args.includes('--instagram-only');
  const dryRun = args.includes('--dry-run');
  const overrideDate =
    getArgValue('--date') || process.env.SOCIAL_POST_DATE || null;

  const result = getCurrentPost(overrideDate);
  if (!result) process.exit(0);

  const { post, weekIndex, dayName } = result;
  console.log(`\n📅 Posting week ${weekIndex + 1}, ${dayName}\n`);

  if (dryRun) {
    console.log('--- DRY RUN ---');
    console.log('FACEBOOK:', post.facebook);
    if (post.instagram) {
      console.log('INSTAGRAM caption:', post.instagram.caption);
      console.log('INSTAGRAM image query:', post.instagram.query);
    }
    console.log('--- END DRY RUN ---');
    process.exit(0);
  }

  const errors = [];

  // Post to Facebook
  if (!instagramOnly && post.facebook) {
    try {
      await postToFacebook(post.facebook);
    } catch (err) {
      console.error('❌ Facebook failed:', err.message);
      errors.push(err);
    }
  }

  // Post to Instagram (requires image)
  if (!facebookOnly && post.instagram) {
    try {
      const imageUrl = await fetchImageUrl(post.instagram.query, {
        source: post.instagram.imageSource,
        url: post.instagram.imageUrl,
      });
      console.log(`🖼  Image fetched: ${imageUrl}`);
      await postToInstagram(imageUrl, post.instagram.caption);
    } catch (err) {
      console.error('❌ Instagram failed:', err.message);
      errors.push(err);
    }
  }

  if (errors.length > 0) {
    console.error(`\n⚠️  Completed with ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log('\n✅ All platforms posted successfully.');
}

run();
