/**
 * Print the full 10-week posting schedule.
 * Usage: node scripts/social/list-schedule.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calendar = JSON.parse(readFileSync(join(__dirname, 'calendar.json'), 'utf8'));

const DAY_OFFSET = { monday: 0, wednesday: 2, friday: 4 };
const TIMES = { monday: '09:00 SAST', wednesday: '12:00 SAST', friday: '17:00 SAST' };

function postDate(startDate, week, day) {
  const [y, m, d] = startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const offset = (week - 1) * 7 + DAY_OFFSET[day];
  const d = new Date(start);
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

console.log(`\n10-week schedule (starts ${calendar.startDate})\n`);
console.log('| Date | Week | Day | Facebook (preview) | Instagram query |');
console.log('|------|------|-----|----------------------|-----------------|');

for (const post of calendar.posts) {
  const date = postDate(calendar.startDate, post.week, post.day);
  const fbPreview = post.facebook.replace(/\n/g, ' ').slice(0, 60) + '…';
  const igQuery = post.instagram?.query ?? '(text only)';
  console.log(
    `| ${date} | ${post.week} | ${post.day} | ${fbPreview} | ${igQuery} |`
  );
}

console.log(`\nTotal posts: ${calendar.posts.length}\n`);
