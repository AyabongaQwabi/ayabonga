import path from 'node:path';
import sharp from 'sharp';
import { ensureDir } from '../utils/fs.js';

export interface OptimizeOptions {
  maxWidth?: number;
  formats?: Array<'webp' | 'jpeg' | 'png'>;
  quality?: number;
  generateThumb?: boolean;
  generateBlur?: boolean;
}

const DEFAULT_OPTS: Required<Pick<OptimizeOptions, 'maxWidth' | 'quality'>> = {
  maxWidth: 1400,
  quality: 82,
};

export interface OptimizeResult {
  sourcePath: string;
  webpPath?: string;
  jpegPath?: string;
  thumbPath?: string;
  blurDataUrl?: string;
  widths: number[];
}

export async function optimizeImageFile(
  inputPath: string,
  options: OptimizeOptions = {},
): Promise<OptimizeResult> {
  const maxWidth = options.maxWidth ?? DEFAULT_OPTS.maxWidth;
  const quality = options.quality ?? DEFAULT_OPTS.quality;
  const formats = options.formats ?? ['webp'];
  const base = inputPath.replace(/\.[^.]+$/, '');
  const dir = path.dirname(inputPath);

  const pipeline = sharp(inputPath).rotate();
  const meta = await pipeline.metadata();
  const resizeWidth = Math.min(meta.width ?? maxWidth, maxWidth);

  const result: OptimizeResult = {
    sourcePath: inputPath,
    widths: [resizeWidth],
  };

  if (formats.includes('webp')) {
    const webpPath = `${base}.webp`;
    await sharp(inputPath)
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .webp({ quality })
      .toFile(webpPath);
    result.webpPath = webpPath;
  }

  if (formats.includes('jpeg')) {
    const jpegPath = `${base}.jpg`;
    await sharp(inputPath)
      .resize({ width: resizeWidth, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(jpegPath);
    result.jpegPath = jpegPath;
  }

  if (options.generateThumb) {
    const thumbPath = `${base}-thumb.webp`;
    await sharp(inputPath)
      .resize({ width: 480, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(thumbPath);
    result.thumbPath = thumbPath;
  }

  if (options.generateBlur) {
    const buffer = await sharp(inputPath)
      .resize({ width: 24 })
      .webp({ quality: 40 })
      .toBuffer();
    result.blurDataUrl = `data:image/webp;base64,${buffer.toString('base64')}`;
  }

  // Responsive variants
  const responsiveDir = path.join(dir, 'responsive');
  await ensureDir(responsiveDir);
  const stem = path.basename(base);
  for (const w of [640, 960, 1280].filter((w) => w < resizeWidth)) {
    const variant = path.join(responsiveDir, `${stem}-${w}.webp`);
    await sharp(inputPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality })
      .toFile(variant);
    result.widths.push(w);
  }

  return result;
}

export async function optimizeDirectory(dir: string): Promise<void> {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'responsive') {
      await optimizeDirectory(full);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      await optimizeImageFile(full, {
        formats: ['webp'],
        generateThumb: true,
        generateBlur: true,
      });
    }
  }
}
