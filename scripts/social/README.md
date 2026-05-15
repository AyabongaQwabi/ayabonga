# Social Media Scheduler

Automated posting to Facebook Page and Instagram Business Account via GitHub Actions.

## Schedule

**30 posts** over **10 weeks**, starting **Monday 18 May 2026**.

| Day | Time (SAST) | UTC (GitHub cron) | Platforms |
|-----|-------------|-------------------|-----------|
| Monday | 9:00 AM | 07:00 | Facebook text + Instagram image |
| Wednesday | 12:00 PM | 10:00 | Facebook text + Instagram image |
| Friday | 5:00 PM | 15:00 | Facebook text + Instagram image |

Print the full dated calendar:

```bash
npm run social:schedule
```

### Content themes by week

| Week | Focus |
|------|--------|
| 1 | TaaS intro, documentation-first, what you get |
| 2 | Junior dev lottery, AI velocity, who should reach out |
| 3 | SA stack, clinic rebuild case study, founder needs |
| 4 | MVP data models, laundry marketplace, product clarity question |
| 5 | CTO vs TaaS, Clojure, client fit signals |
| 6 | AI + senior engineering, pushback value, agency vs TaaS |
| 7 | Building for Africa, deposits, one slot open |
| 8 | Post-launch iteration, TypeScript, project selection |
| 9 | WhatsApp limits, remote work habits, fixed pricing |
| 10 | Series recap, intro post, open for projects CTA |

## Required GitHub Secrets

Go to **Settings > Secrets and variables > Actions** in your repo and add:

### You already have these — add them exactly as named:
| Secret | Description |
|--------|-------------|
| `FACEBOOK_PAGE_ID` | **NEW — add this.** Your Facebook Page ID (not business ID). Find it at facebook.com/your-page > About > Page transparency |
| `FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN` | Page Access Token from your Facebook app |
| `FACEBOOK_DEVELOPER_APP_ID` | Facebook App ID |
| `FACEBOOK_DEVELOPER_APP_SECRET` | Facebook App Secret |
| `FACEBOOK_DEVELOPER_APP_TOKEN` | App-level token |
| `INSTAGRAM_ACCOUNT_ID` | Instagram Business Account ID |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram Graph API token |
| `INSTAGRAM_APP_ID` | Instagram App ID |
| `INSTAGRAM_APP_SECRET` | Instagram App Secret |
| `UNSPLASH_ACCESS_KEY` | **NEW — add this.** Free at unsplash.com/developers |
| `PEXELS_API_KEY` | Optional fallback. Free at pexels.com/api |

### Getting FACEBOOK_PAGE_ID

Your Business Manager asset URL may show `asset_id=1166787009841265`. Verify that number is your **Page ID** (not only a business asset ID):

1. Go to your Facebook Page
2. Click **About** in the left sidebar
3. Scroll to **Page transparency** for the Page ID
4. Or run: `curl "https://graph.facebook.com/v20.0/me?fields=id,name&access_token=YOUR_PAGE_TOKEN"`

### Token note (Instagram)

`INSTAGRAM_ACCESS_TOKEN` is often the **same** as `FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN` when your Instagram Business account is linked to the Page. Both need `instagram_content_publish` and `pages_manage_posts` permissions.

### Getting an Unsplash Key

1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Create a free app
3. Copy the **Access Key** (not Secret Key)
4. Free tier: 50 requests/hour — more than enough for 3 posts/week

### Token Expiry Warning

Facebook Page Access Tokens expire every 60 days. You need to refresh them manually in Meta for Developers > your app > Access Token Debugger, then update the GitHub secret.

To get a long-lived token:
```
GET https://graph.facebook.com/v20.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id=YOUR_APP_ID
  &client_secret=YOUR_APP_SECRET
  &fb_exchange_token=YOUR_SHORT_TOKEN
```

## Manual Trigger

You can trigger a post manually from GitHub:

1. Go to **Actions** tab in your repo
2. Click **Social Media Scheduler**
3. Click **Run workflow**
4. Choose platform (both / facebook-only / instagram-only)
5. Optionally enable **dry run** to test without posting
6. Optionally set **post_date** to `2026-05-18` (or any Mon/Wed/Fri in the campaign) to test a specific slot

### GitHub vs Meta Business Suite scheduling

This repo uses **GitHub Actions + Graph API** (pull calendar, post at cron time). You do **not** need to duplicate entries in Meta Business Suite unless you want a backup. Meta's native scheduler cannot read `calendar.json`; pick one system to avoid double posts.

## Local Testing

```bash
# Dry run — shows what would be posted today
npm run social:dry-run

# Dry run a specific campaign day (must be Mon, Wed, or Fri)
node scripts/social/post.js --dry-run --date 2026-05-18

# Facebook only
FACEBOOK_PAGE_ID=xxx FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN=xxx \
  node scripts/social/post.js --facebook-only

# Instagram only
INSTAGRAM_ACCOUNT_ID=xxx INSTAGRAM_ACCESS_TOKEN=xxx UNSPLASH_ACCESS_KEY=xxx \
  node scripts/social/post.js --instagram-only
```

## File Structure

```
scripts/social/
  post.js          # Entry point — determines which post to send today
  facebook.js      # Facebook Graph API posting
  instagram.js     # Instagram Graph API posting (2-step: container + publish)
  image.js         # Unsplash/Pexels image fetcher
  calendar.json    # 10-week content calendar (30 posts)

.github/workflows/
  social-scheduler.yml   # Cron-based GitHub Actions workflow
```

## Editing the Calendar

Open `scripts/social/calendar.json`. Each post has:

```json
{
  "week": 1,
  "day": "monday",
  "facebook": "Full text post for Facebook...",
  "instagram": {
    "caption": "Shorter caption with hashtags #Tag",
    "query": "unsplash search query for image"
  }
}
```

To skip Instagram for a specific post, remove the `instagram` field entirely.

Use a fixed brand image instead of Unsplash:

```json
"instagram": {
  "caption": "...",
  "imageSource": "brand"
}
```

Or a public URL:

```json
"instagram": {
  "caption": "...",
  "imageUrl": "https://www.qwabi.co.za/..."
}
```
