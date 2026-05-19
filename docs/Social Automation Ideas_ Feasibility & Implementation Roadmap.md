# Social Automation Ideas: Feasibility & Implementation Roadmap

This document analyses each proposed idea against the Meta Graph API, the existing codebase (`scripts/social/`), and Vercel's infrastructure. Each idea is rated on feasibility, bot/rate-limit risk, and where to start.

---

## Summary Table

| # | Idea | Feasible? | Risk Level | Effort |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Cloudflare Worker image generation with stock fallback | ✅ Yes | Low | Medium |
| 2 | Facebook posts: sometimes text-only or AI video | ✅ Yes (text/video), ⚠️ Partial (video) | Low–Medium | Medium |
| 3 | Save post IDs to Vercel Blob | ✅ Yes | None | Low |
| 4 | Bot to read comments and reply + invite to follow | ✅ Yes (via Pages API) | Medium | Medium |
| 5 | `@highlight` and `@topfans` comment bots | ❌ Not via API | High | N/A |
| 6 | Facebook Group with daily posts + ad posts | ❌ Groups API deprecated April 2024 | Very High | N/A |
| 7 | Bot to respond to group comments | ❌ Groups API deprecated | Very High | N/A |

---

## Idea 1: Cloudflare Worker Image Generation with Stock Fallback

**Verdict: ✅ Fully feasible. Start here.**

The Cloudflare Worker image generation utilizes a deployed worker (e.g., stabilityai/stable-diffusion-xl-base-1.0) to generate custom images. The existing `image.js` module already has a clean provider pattern (Pexels for photos, Vecteezy for vectors), making it straightforward to add the Cloudflare generation provider at the top of the chain.

**How it works in the existing architecture:**

The `fetchImageUrl` function in `image.js` is called by `post.js` before posting. The change is to add a `generateWithCloudflare(query)` function that calls the Cloudflare Worker with the Instagram `caption` and `query` as a prompt, saves the resulting image to a temporary public URL (Vercel Blob is already installed as `@vercel/blob`), and returns that URL. If the Cloudflare call fails or returns nothing, the code falls through to the existing Pexels/Vecteezy logic.

**Rate limit risk:** The Cloudflare AI binding limits depend on the tier, but are highly generous. At 5 posts per day, this is negligible. There is no bot-check risk as this is a direct API call with an Authorization header.

**Where to start:**
1. Add `CLOUDFLARE_IMAGE_WORKER_KEY` to Vercel environment variables.
2. Defer image generation to the Cloudflare Worker.
3. In `image.js`, call `generateWithCloudflare` first; if it returns a URL, use it. Otherwise fall through to the existing `fetchImageUrl` logic.
4. The generated image needs to be a publicly accessible URL for the Facebook/Instagram APIs. Use `@vercel/blob` (already a dependency) to upload the generated image buffer and get a public URL.

---

## Idea 2: Facebook Posts — Sometimes Text-Only or AI-Generated Video

**Verdict: ✅ Text-only is already supported. ⚠️ AI video is feasible but requires a separate generation pipeline.**

**Text-only posts:** The existing `postToFacebook` function in `facebook.js` already handles text-only posts via `/{page-id}/feed`. The current `post.js` hardcodes `useFacebookPhoto = true` (there is even a `TODO` comment on that line). The fix is to add a `postType` field to the calendar entry (`"postType": "text"`, `"photo"`, or `"video"`) and use it to branch the logic. This is a low-effort change.

**AI-generated video:** The Facebook Video API (`POST /{page-id}/videos`) supports publishing videos to a Page from a public URL. The challenge is generating the video. Tools like RunwayML, Kling, or Google's Veo API can generate short videos from a text prompt, but they are paid services and video generation takes 30–120 seconds, which is within Vercel's 60-second function timeout only for the shortest clips. A more practical approach is to pre-generate videos and store them in Vercel Blob, then reference them in the calendar. True on-the-fly video generation would require a background job architecture (e.g., Vercel Workflows or a separate queue).

**Rate limit risk:** None for text posts. For video, the Graph API allows up to 300 calls per second per Page, so posting one video per slot is far below any limit.

**Where to start:**
1. Add an optional `"postType": "text" | "photo" | "video"` field to calendar entries (default: `"photo"`).
2. In `post.js`, read `post.postType` and branch accordingly — text goes to `postToFacebook`, photo to `postPhotoToFacebook`, video to a new `postVideoToFacebook` function.
3. For AI video, start with pre-generated video URLs stored in Vercel Blob and referenced in the calendar. Defer real-time generation to a later phase.

---

## Idea 3: Save Post IDs to Vercel Blob

**Verdict: ✅ Fully feasible. Lowest effort of all ideas.**

`@vercel/blob` is already installed as a dependency in the project. The pattern is to maintain a JSON log file in Blob storage (e.g., `social/post-log.json`) that is read, appended to, and re-written after each successful post.

**Where to start:**
1. Create `scripts/social/post-log.js` with two functions: `readPostLog()` (fetches and parses the JSON from Blob) and `appendPostLog(entry)` (reads, appends, and re-puts the file).
2. In `post.js`, after a successful Facebook or Instagram post, call `appendPostLog({ date, slot, platform, postId, permalink, imageUrl, timestamp })`.
3. Add `BLOB_READ_WRITE_TOKEN` to Vercel environment variables (required by `@vercel/blob`).

This log also becomes the foundation for Idea 4 (the comment-reply bot needs to know which posts to check).

---

## Idea 4: Bot to Check Comments on Recent Posts and Reply

**Verdict: ✅ Feasible via the Meta Pages API. Medium effort, medium risk if done carefully.**

The Meta Graph API supports reading comments on Page posts (`GET /{post-id}/comments`) and replying to them (`POST /{comment-id}/comments`). The required permission is `pages_manage_engagement`, which requires App Review submission to Meta. This is the most significant gate for this idea.

**Bot-check and rate-limit risk:** This is where care is needed. Meta's spam detection watches for automated, identical, or rapid-fire comment replies. The safest approach is to use an LLM (the project already has `@anthropic-ai/sdk` as a dev dependency) to generate contextually relevant replies rather than templated responses, add a random delay between replies (2–10 seconds), and process only comments from the last 24–48 hours to limit the API call volume. The invitation to follow the page can be done by appending a soft CTA to the reply text, as the `pages_manage_engagement` permission does not expose a "invite to follow" API endpoint directly — that is only available for post reactions, not comments.

**Where to start:**
1. Submit `pages_manage_engagement` for App Review in Meta for Developers.
2. Create `scripts/social/comment-bot.js` with: `getRecentPosts()` (reads from the Blob log), `getComments(postId)`, `generateReply(commentText)` (calls OpenAI/Gemini), and `replyToComment(commentId, reply)`.
3. Add a new Vercel Cron entry in `vercel.json` to run `api/cron/comment-reply.ts` once per day (e.g., `"0 10 * * *"`).
4. Implement exponential backoff on rate-limit errors (HTTP 32 or 613).

---

## Idea 5: `@highlight` and `@topfans` Comment Bots

**Verdict: ❌ Not possible via the official API.**

The `@highlight` and `@topfans` tags are Facebook-internal features available only through the native Facebook interface. They are not exposed as parameters in the Graph API's comment endpoint. Attempting to post a comment containing these strings via the API will result in them being treated as plain text, not as functional tags. There is no documented or unofficial API path to trigger these features programmatically.

**Recommendation:** This idea should be parked. If the goal is to surface a good post for discussion, the comment-reply bot from Idea 4 can be extended to post a featured comment on a selected post (e.g., the one with the most engagement from the Blob log), but it will not have the native `@highlight` or `@topfans` functionality.

---

## Idea 6: Facebook Group with Daily Posts and Ad Posts

**Verdict: ❌ Not feasible via the official API. Very high account risk if attempted via browser automation.**

Meta deprecated the Facebook Groups API in April 2024. All programmatic posting to Facebook Groups via the Graph API is now impossible. The only remaining approach is browser-based automation (Chrome extensions or Playwright/Puppeteer), which simulates a human clicking through the Facebook web interface. This approach carries significant risk: Meta's bot detection is aggressive for group posting, and automated group posting that includes promotional content is explicitly against Facebook's Terms of Service. An account caught doing this at scale risks permanent suspension.

**Recommendation:** Do not build this as an automated system. Instead, consider creating the group manually and using the existing Vercel Cron posts as inspiration to manually post 2–3 times per week. The content from `calendar.json` can be repurposed for the group without any automation risk.

---

## Idea 7: Bot to Respond to Group Comments

**Verdict: ❌ Not feasible via the official API.**

This is blocked by the same Groups API deprecation as Idea 6. Reading comments from a Facebook Group programmatically is no longer possible through the official Graph API. Any implementation would require the same risky browser-automation approach described above.

---

## Recommended Implementation Order

Given the above analysis, the recommended order prioritises high-feasibility, low-risk items first, building a foundation (the Blob post log) that enables the more complex ideas.

| Phase | What to Build | Dependency |
| :--- | :--- | :--- |
| **Phase 1** | Vercel Blob post log (Idea 3) | None — enables everything else |
| **Phase 2** | Cloudflare Worker image generation with fallback (Idea 1) | `CLOUDFLARE_IMAGE_WORKER_KEY` |
| **Phase 3** | `postType` field for text-only and video posts (Idea 2) | Phase 1 log for tracking |
| **Phase 4** | Comment-reply bot (Idea 4) | Phase 1 log + Meta App Review |

Ideas 5, 6, and 7 are not recommended for implementation due to API limitations and account risk.
