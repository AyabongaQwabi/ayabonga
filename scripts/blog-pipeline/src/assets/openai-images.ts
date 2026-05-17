import path from 'node:path';
import OpenAI from 'openai';
import { LLM_CONFIG } from '../config.js';
import { ensureDir } from '../utils/fs.js';
import { optimizeImageFile } from './optimize.js';

const DEFAULT_STYLE =
  'Modern SaaS editorial illustration, dark UI inspired, minimal premium aesthetic, typography-forward, Awwwards-inspired tech editorial, no text in image, cinematic lighting, 16:9';

export async function generateAiImage(
  prompt: string,
  outputPath: string,
  options?: { size?: '1536x1024' | '1024x1024' | '1792x1024' },
): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OPENAI_API_KEY required for AI image generation');
  }

  const client = new OpenAI({ apiKey: key });
  await ensureDir(path.dirname(outputPath));

  const fullPrompt = `${DEFAULT_STYLE}. ${prompt}`;

  const response = await client.images.generate({
    model: LLM_CONFIG.imageModel,
    prompt: fullPrompt,
    size: options?.size ?? '1536x1024',
    n: 1,
  });

  const b64 = response.data[0]?.b64_json;
  const url = response.data[0]?.url;
  const pngPath = outputPath.endsWith('.png') ? outputPath : `${outputPath}.png`;

  if (b64) {
    const { writeFile } = await import('node:fs/promises');
    await writeFile(pngPath, Buffer.from(b64, 'base64'));
  } else if (url) {
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    const { writeFile } = await import('node:fs/promises');
    await writeFile(pngPath, buf);
  } else {
    throw new Error('OpenAI image API returned no image data');
  }

  const optimized = await optimizeImageFile(pngPath, {
    maxWidth: 1600,
    formats: ['webp'],
    generateBlur: true,
  });

  return optimized.webpPath ?? pngPath;
}

export async function generateHeroImage(
  title: string,
  excerpt: string,
  outputDir: string,
): Promise<{ heroPath: string; ogPath: string }> {
  const prompt = `Hero banner for a technical blog article titled "${title}". Theme: ${excerpt}. Futuristic developer workspace, abstract AI elements, premium editorial tech magazine cover feel.`;
  const heroPng = path.join(outputDir, 'hero.png');
  const heroWebp = await generateAiImage(prompt, heroPng);

  const ogPng = path.join(outputDir, 'og.png');
  const ogPrompt = `Open Graph social preview, bold composition, "${title}" mood without readable text, dark gradient, developer SaaS brand.`;
  const ogWebp = await generateAiImage(ogPrompt, ogPng, { size: '1792x1024' });

  return {
    heroPath: heroWebp,
    ogPath: ogWebp,
  };
}

export async function generateSectionImages(
  plans: Array<{ filename: string; prompt?: string; alt: string }>,
  imagesDir: string,
): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  for (const plan of plans) {
    if (!plan.prompt) continue;
    const base = plan.filename.replace(/\.[^.]+$/, '');
    const out = path.join(imagesDir, `${base}.png`);
    try {
      map[plan.filename] = await generateAiImage(plan.prompt, out);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[openai-images] Section image failed', plan.filename, err);
      }
    }
  }
  return map;
}
