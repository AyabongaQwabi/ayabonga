/**
 * Print the full posting schedule.
 * Usage: node scripts/social/list-schedule.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const calendar = JSON.parse(readFileSync(join(__dirname, 'calendar.json'), 'utf8'));

const DAY_OFFSET = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6
};

const SLOT_TIMES = {
  1: '06:00 SAST',
  2: '09:00 SAST',
  3: '12:00 SAST',
  4: '15:00 SAST',
  5: '18:00 SAST'
};

function postDate(startDate, week, day) {
  const [y, m, d] = startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const offset = (week - 1) * 7 + (DAY_OFFSET[day] ?? 0);
  const result = new Date(start);
  result.setDate(result.getDate() + offset);
  return result.toISOString().split('T')[0];
}

console.log(`\nDaily 5x schedule (starts ${calendar.startDate})\n`);
console.log('| Date | Week | Day | Slot | Time | IG media | Instagram query |');
console.log('|------|------|-----|------|------|----------|-----------------|');

// Sort posts chronologically: week, day offset, slot
const sortedPosts = [...calendar.posts].sort((a, b) => {
  if (a.week !== b.week) return a.week - b.week;
  const aDay = DAY_OFFSET[a.day] ?? 0;
  const bDay = DAY_OFFSET[b.day] ?? 0;
  if (aDay !== bDay) return aDay - bDay;
  const aSlot = a.slot ?? 1;
  const bSlot = b.slot ?? 1;
  return aSlot - bSlot;
});

for (const post of sortedPosts) {
  const date = postDate(calendar.startDate, post.week, post.day);
  const slot = post.slot ?? 1;
  const time = SLOT_TIMES[slot] ?? '06:00 SAST';
  const igMedia = post.instagram?.media ?? '—';
  const igQuery = post.instagram?.query ?? '(no Instagram)';
  console.log(`| ${date} | ${post.week} | ${post.day} | ${slot} | ${time} | ${igMedia} | ${igQuery} |`);
}

console.log(`\nTotal posts: ${calendar.posts.length}\n`);

