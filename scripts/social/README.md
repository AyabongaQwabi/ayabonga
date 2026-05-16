# Social Media Scheduler

Automated posting to Facebook Page and Instagram Business Account via Vercel Cron (`/api/cron/social-post`).

## Schedule

**30 posts** over **10 weeks**, starting **Monday 18 May 2026**.

| Day | Time (SAST) | UTC (Vercel cron) | Platforms |
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

### Meta (Facebook + Instagram)

| Secret | Description |
|--------|-------------|
| `FACEBOOK_PAGE_ID` | Facebook Page ID (Page → About → Page transparency) |
| `FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN` | Page access token |
| `FACEBOOK_DEVELOPER_APP_ID` | Facebook App ID |
| `FACEBOOK_DEVELOPER_APP_SECRET` | Facebook App Secret |
| `FACEBOOK_DEVELOPER_APP_TOKEN` | App-level token |
| `INSTAGRAM_ACCOUNT_ID` | Instagram Business account ID |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram Graph API token |
| `INSTAGRAM_APP_ID` | Instagram App ID |
| `INSTAGRAM_APP_SECRET` | Instagram App Secret |

### Stock assets (Instagram images)

| Secret | Used for |
|--------|----------|
| `PEXELS_API_KEY` | `media: "photo"` posts — stock photography ([pexels.com/api](https://www.pexels.com/api/)) |
| `VECTEEZY_ACCOUNT_ID` | `media: "vector"` posts — vectors / illustrations |
| `VECTEEZY_SECRET_KEY` | Vecteezy API key (`Authorization` header value, not `Bearer`) |

Request Vecteezy API access at [vecteezy.com/developers](https://www.vecteezy.com/developers).

### Facebook tokens and Page ID

| Env var | Role |
|---------|------|
| `GRAPH_API_VERSION` | e.g. `25.0` (default) |
| `FACEBOOK_PAGE_ID` | Your Page id, e.g. `1166787009841265` |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Long-lived **page** token for `POST /{page-id}/feed` |
| `APP_SCOPED_USER_ID` | App-scoped user id (for `/accounts` lookup) |
| `FACEBOOK_USER_TOKEN` | Long-lived **user** token |
| `FACEBOOK_USER_TOKEN_EXPIRES_IN_DAYS` | Optional reminder only (logged, not used by API) |

**Posting** follows [Pages API — Posts](https://developers.facebook.com/docs/pages-api/posts):

| Content | Endpoint | Our scheduler |
|---------|----------|---------------|
| Text only | `POST /{page-id}/feed` | `--facebook-only` or slots without Instagram |
| Photo + caption | `POST /{page-id}/photos` with `url` + `message` | Default when posting **both** FB + IG (same stock image URL) |
| Video | Video API | Not implemented |

Required permissions include `pages_manage_posts`. Page tasks: `CREATE_CONTENT`, `MANAGE`, `MODERATE`.

```http
POST https://graph.facebook.com/v25.0/{FACEBOOK_PAGE_ID}/feed
message=...&access_token={FACEBOOK_PAGE_ACCESS_TOKEN}

POST https://graph.facebook.com/v25.0/{FACEBOOK_PAGE_ID}/photos
url={public_image_url}&message=...&access_token={FACEBOOK_PAGE_ACCESS_TOKEN}
```

Photo response includes `post_id` for permalink `https://www.facebook.com/{post_id}`.

**Option A (simplest):** Put the long-lived page token in `FACEBOOK_PAGE_ACCESS_TOKEN`.

**Option B (derive page token from user token):**

1. Short-lived user token → long-lived user token ([Meta docs](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)):

```bash
npm run social:exchange-user-token
```

2. Long-lived user token → page token via `GET /{APP_SCOPED_USER_ID}/accounts`:

```bash
npm run social:fetch-page-token
```

Copy the printed token into `FACEBOOK_PAGE_ACCESS_TOKEN` in `.env.local`.

Legacy name `FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN` still works as an alias.

### Token note (Instagram)

`INSTAGRAM_ACCESS_TOKEN` is often the **same** as `FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN` when Instagram is linked to the Page. Permissions needed: `pages_manage_posts`, `instagram_content_publish`.

### Image providers (Instagram)

Each calendar slot picks **one** provider by `instagram.media`:

| `media` | Provider | Content |
|---------|----------|---------|
| `photo` (default) | **Pexels** | Stock photos |
| `vector` | **Vecteezy** | Vectors and flat illustrations |

There is no fallback chain. Photo posts fail without `PEXELS_API_KEY`. Vector posts fail without Vecteezy credentials.

The calendar uses **20 photo** and **10 vector** slots across the 10 weeks.

### Token expiry

Facebook Page tokens expire about every **60 days**. Refresh in Meta for Developers → Access Token Debugger, then update the matching Vercel environment variables.

## Manual trigger (production)

Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` automatically. To test manually:

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  "https://www.qwabi.co.za/api/cron/social-post?dry_run=true&platform=facebook-only&date=2026-05-18"
```

Query params: `platform` (`facebook-only` | `instagram-only` | omit for both), `dry_run=true`, `date=YYYY-MM-DD` (Mon/Wed/Fri in the campaign).

Do not duplicate the same posts in Meta Business Suite unless you want double posts.

## Local environment

Copy the template and add your keys at the **repo root** (the agent shell does not see keys that only exist in your IDE):

```bash
cp scripts/social/env.example .env.local
# edit .env.local — at minimum:
#   FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN
#   PEXELS_API_KEY  (photo posts)
#   VECTEEZY_*      (vector posts only)
```

`FACEBOOK_PAGE_ID` and `INSTAGRAM_ACCOUNT_ID` are optional if the page token can resolve them via Graph API `/me` and `instagram_business_account`.

Logs print **image URL** and **permalink** links after each run. Dry run fetches the image URL without posting.

## Local testing

```bash
# Preview today's slot (includes image URL when PEXELS_API_KEY is set)
npm run social:dry-run

# Preview week 1 Monday (Pexels photo)
node scripts/social/post.js --dry-run --date 2026-05-18

# Preview week 1 Wednesday (Vecteezy vector)
node scripts/social/post.js --dry-run --date 2026-05-20

# Live post (both platforms) when ready
export FACEBOOK_PAGE_ID=...
export FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN=...
export INSTAGRAM_ACCOUNT_ID=...
export INSTAGRAM_ACCESS_TOKEN=...
export PEXELS_API_KEY=...
export VECTEEZY_ACCOUNT_ID=...
export VECTEEZY_SECRET_KEY=...

node scripts/social/post.js --date 2026-05-18
```

## File structure

```
scripts/social/
  post.js          # Entry point
  facebook.js      # Facebook Graph API
  instagram.js     # Instagram Graph API
  image.js         # Pexels (photos) + Vecteezy (vectors)
  calendar.json    # 10-week calendar
  list-schedule.js # Print dated schedule

vercel.json
  crons → /api/cron/social-post   # Mon 7 UTC, Wed 10 UTC, Fri 15 UTC (SAST slots)
api/cron/social-post.ts          # Invokes scripts/social/post.js (CRON_SECRET)
```

## Editing the calendar

```json
{
  "week": 1,
  "day": "monday",
  "facebook": "Full text for Facebook...",
  "instagram": {
    "caption": "Caption with #hashtags",
    "query": "developer laptop startup workspace",
    "media": "photo"
  }
}
```

Vector example:

```json
"instagram": {
  "caption": "Documentation first. Code second.",
  "query": "project planning workflow flat illustration",
  "media": "vector"
}
```

Fixed brand image (skips stock APIs):

```json
"instagram": {
  "caption": "...",
  "imageSource": "brand"
}
```

Direct public URL:

```json
"instagram": {
  "caption": "...",
  "imageUrl": "https://www.qwabi.co.za/..."
}
```

Omit `media` to default to `photo` (Pexels).
