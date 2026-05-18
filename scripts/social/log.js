/**
 * Structured logging for social post pipeline (no secrets in output).
 */

const SECRET_KEYS = /token|secret|password|api_key|apikey|authorization/i;

function redactValue(key, value) {
  if (SECRET_KEYS.test(key)) return value ? '[set]' : '[missing]';
  return value;
}

export function log(step, message, fields = {}) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [${step}] ${message}`);
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    console.log(`\n\n ${key}: ${redactValue(key, value)}`);
  }
}

export function logError(step, message, err) {
  log(step, message, { error: err?.message ?? String(err) });
  if (err?.stack && process.env.SOCIAL_DEBUG === '1') {
    console.error(err.stack);
  }
}

export function logBanner(title, lines) {
  const bar = '═'.repeat(56);
  console.log(`\n${bar}`);
  console.log(title);
  console.log(bar);
  for (const line of lines) {
    if (line) console.log(line);
  }
  console.log(`${bar}\n`);
}
