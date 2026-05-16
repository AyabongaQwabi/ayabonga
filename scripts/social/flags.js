/**
 * Feature flags for social posting.
 * Instagram is paused by default until SOCIAL_INSTAGRAM_ENABLED=true.
 */

export function isInstagramEnabled() {
  return process.env.SOCIAL_INSTAGRAM_ENABLED === 'true';
}

export function instagramPauseReason() {
  return 'Instagram paused (set SOCIAL_INSTAGRAM_ENABLED=true in .env.local to resume)';
}
