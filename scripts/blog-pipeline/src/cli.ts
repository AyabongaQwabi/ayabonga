#!/usr/bin/env node
import { Command } from 'commander';
import {
  runFullPipeline,
  runScreenshotsOnly,
  runDiagramsOnly,
  runOptimizeOnly,
  runSocialOnly,
} from './pipeline/orchestrator.js';
import { publishArticleToSite } from './publish/to-site.js';
import { scaffoldArticle, listArticleSlugs } from './pipeline/scaffold.js';
import { slugify } from './utils/slug.js';
import { DEFAULT_SCREENSHOT_TARGETS } from './capture/targets.js';

const program = new Command();

program
  .name('blog-pipeline')
  .description('AI-assisted technical blog generation pipeline')
  .version('1.0.0');

program
  .command('generate-article')
  .description('Generate a full article package (content, images, diagrams, SEO)')
  .requiredOption('-t, --topic <topic>', 'Article topic or working title')
  .option('-s, --slug <slug>', 'URL slug (auto-derived from topic if omitted)')
  .option('--skip-screenshots', 'Skip Playwright captures')
  .option('--skip-images', 'Skip OpenAI image generation')
  .option('--skip-diagrams', 'Skip Mermaid diagram export')
  .option('--social', 'Also generate tweet/LinkedIn/newsletter copy')
  .action(async (opts) => {
    const dir = await runFullPipeline({
      topic: opts.topic,
      slug: opts.slug ? slugify(opts.slug) : undefined,
      skipScreenshots: opts.skipScreenshots,
      skipImages: opts.skipImages,
      skipDiagrams: opts.skipDiagrams,
      social: opts.social,
    });
    console.log(`Done: ${dir}`);
  });

program
  .command('scaffold')
  .description('Create empty article folder structure')
  .requiredOption('-s, --slug <slug>', 'Article slug')
  .option('--title <title>', 'Article title')
  .action(async (opts) => {
    await scaffoldArticle(slugify(opts.slug), { title: opts.title });
    console.log(`Scaffolded: content/blog/${slugify(opts.slug)}/`);
  });

program
  .command('capture-screenshots')
  .description('Capture website screenshots with Playwright')
  .requiredOption('-s, --slug <slug>', 'Article slug')
  .option(
    '--targets <ids>',
    'Comma-separated target ids (default: all)',
    (v: string) => v.split(',').map((s) => s.trim()),
  )
  .action(async (opts) => {
    await runScreenshotsOnly(slugify(opts.slug), opts.targets);
    console.log('Screenshots captured.');
  });

program
  .command('list-screenshot-targets')
  .description('List built-in Playwright screenshot targets')
  .action(() => {
    for (const t of DEFAULT_SCREENSHOT_TARGETS) {
      console.log(`${t.id}\t${t.name}\t${t.url}`);
    }
  });

program
  .command('generate-diagrams')
  .description('Render Mermaid sources from metadata image plans')
  .requiredOption('-s, --slug <slug>', 'Article slug')
  .action(async (opts) => {
    await runDiagramsOnly(slugify(opts.slug));
    console.log('Diagrams generated.');
  });

program
  .command('optimize-images')
  .description('Run Sharp optimization on article assets')
  .requiredOption('-s, --slug <slug>', 'Article slug')
  .action(async (opts) => {
    await runOptimizeOnly(slugify(opts.slug));
    console.log('Images optimized.');
  });

program
  .command('generate-social')
  .description('Generate tweet thread, LinkedIn post, newsletter summary')
  .requiredOption('-s, --slug <slug>', 'Article slug')
  .action(async (opts) => {
    await runSocialOnly(slugify(opts.slug));
    console.log('Social pack written to social.json');
  });

program
  .command('publish')
  .description('Export article package to src/content/blog and public/images')
  .requiredOption('-s, --slug <slug>', 'Article slug')
  .action(async (opts) => {
    await publishArticleToSite(slugify(opts.slug));
    console.log('Published to site markdown.');
  });

program
  .command('list')
  .description('List article slugs in content/blog')
  .action(async () => {
    const slugs = await listArticleSlugs();
    slugs.forEach((s) => console.log(s));
  });

program.parse();
