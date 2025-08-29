import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const iconsDir = path.join(projectRoot, 'public', 'icons');
const faviconIco = path.join(iconsDir, 'favicon.ico');

const PLACEHOLDER_PNG_256 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAAAAA3NCSVQICAjb4U/gAAABRklEQVR4nO3QMQEAAAwCoNm/9HIYQwE25mYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACArwJ8AAHFkCwQAAAAAElFTkSuQmCC',
  'base64'
);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeIfMissing(filePath, data) {
  try {
    await fs.access(filePath);
    return false;
  } catch {
    await fs.writeFile(filePath, data);
    return true;
  }
}

async function generateFromIco(buffer) {
  try {
    const { ICO } = await import('icojs');
    const images = await ICO.parse(buffer, 'image/png');
    const bySize = new Map();
    for (const img of images) {
      if (img.buffer && img.width && img.height && img.width === img.height) {
        bySize.set(img.width, Buffer.from(img.buffer));
      }
    }
    const sizes = [256, 512];
    for (const size of sizes) {
      const outPath = path.join(iconsDir, `${size}x${size}.png`);
      const match = bySize.get(size) || bySize.get(256) || bySize.values().next().value;
      if (match) await writeIfMissing(outPath, match);
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await ensureDir(iconsDir);

  let icoBuffer;
  try {
    icoBuffer = await fs.readFile(faviconIco);
  } catch {
    // No favicon.ico, fall back to placeholder
    await writeIfMissing(path.join(iconsDir, '256x256.png'), PLACEHOLDER_PNG_256);
    return;
  }

  const ok = await generateFromIco(icoBuffer);
  if (!ok) {
    // Fallback if ico parsing not possible
    await writeIfMissing(path.join(iconsDir, '256x256.png'), PLACEHOLDER_PNG_256);
  }
}

main().catch((err) => {
  console.error('[icons] generation failed', err);
  // Do not fail build
  process.exit(0);
});


