import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { ensureDir, writeText } from '../utils/fs.js';
import type { SectionImagePlan } from '../types.js';

const execFileAsync = promisify(execFile);

export async function writeMermaidSources(
  plans: SectionImagePlan[],
  diagramsDir: string,
): Promise<string[]> {
  await ensureDir(diagramsDir);
  const written: string[] = [];

  for (const plan of plans) {
    if (!plan.mermaidSource) continue;
    const mmdPath = path.join(diagramsDir, `${plan.sectionId}.mmd`);
    await writeText(mmdPath, plan.mermaidSource.trim());
    written.push(mmdPath);
  }

  return written;
}

export async function renderMermaidDiagrams(diagramsDir: string): Promise<void> {
  const { readdir } = await import('node:fs/promises');
  let entries: string[] = [];
  try {
    entries = await readdir(diagramsDir);
  } catch {
    return;
  }

  for (const file of entries.filter((f) => f.endsWith('.mmd'))) {
    const input = path.join(diagramsDir, file);
    const svgOut = path.join(diagramsDir, file.replace(/\.mmd$/, '.svg'));
    const pngOut = path.join(diagramsDir, file.replace(/\.mmd$/, '.png'));

    try {
      await execFileAsync('mmdc', ['-i', input, '-o', svgOut, '-b', 'transparent'], {
        timeout: 120_000,
      });
      // Also export PNG via sharp if mmdc only gave svg
      const { default: sharp } = await import('sharp');
      await sharp(svgOut).png().toFile(pngOut);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[diagrams] mmdc unavailable or failed for ${file}. Install @mermaid-js/mermaid-cli or embed mermaid in MDX.`,
          err,
        );
      }
    }
  }
}

export function mermaidBlockForMdx(source: string): string {
  return `\n\`\`\`mermaid\n${source.trim()}\n\`\`\`\n`;
}

export async function writeExcalidrawStub(
  sectionId: string,
  label: string,
  diagramsDir: string,
): Promise<string> {
  const payload = {
    type: 'excalidraw',
    version: 2,
    source: 'blog-pipeline',
    elements: [],
    appState: { viewBackgroundColor: '#0a0a0a', theme: 'dark' },
    files: {},
    metadata: { sectionId, label },
  };
  const out = path.join(diagramsDir, `${sectionId}.excalidraw.json`);
  await writeText(out, JSON.stringify(payload, null, 2));
  return out;
}
