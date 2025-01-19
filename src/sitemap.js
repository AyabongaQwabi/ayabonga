import { simpleSitemapAndIndex } from 'sitemap';

const hostname = 'https://www.ayabonga.com';

const urls = [
  { url: '/', changefreq: 'daily', priority: 1 },
  // Add additional pages here
];
simpleSitemapAndIndex({
  hostname,
  destinationDir: '../public',
  sourceData: urls,
}).then(() => {
  // Do follow up actions
});
