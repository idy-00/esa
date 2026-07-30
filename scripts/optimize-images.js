import sharp from 'sharp';
import { readdir, mkdir, rm } from 'fs/promises';
import { join, parse } from 'path';

const INPUT_DIR = './src/assets/images';
const OUTPUT_DIR = './src/assets/images/optimized';

async function optimizeImages() {
  // Clear old optimized
  await rm(OUTPUT_DIR, { recursive: true, force: true });
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(INPUT_DIR);
  const images = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  for (const file of images) {
    const { name } = parse(file);
    const inputPath = join(INPUT_DIR, file);

    // Hero - large + mobile
    if (name.includes('hero')) {
      await sharp(inputPath)
        .resize(1600, 900, { fit: 'cover', position: 'center' })
        .webp({ quality: 82 })
        .toFile(join(OUTPUT_DIR, `${name}.webp`));

      await sharp(inputPath)
        .resize(800, 600, { fit: 'cover', position: 'center' })
        .webp({ quality: 78 })
        .toFile(join(OUTPUT_DIR, `${name}-mobile.webp`));
    }
    // Flyers/practice - need readable
    else if (name.includes('maintenance') || name.includes('security') || name.includes('management')) {
      await sharp(inputPath)
        .resize(900, 600, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(join(OUTPUT_DIR, `${name}.webp`));
    }
    // Portrait - smaller
    else if (name.includes('portrait')) {
      await sharp(inputPath)
        .resize(500, 650, { fit: 'cover', position: 'top' })
        .webp({ quality: 78 })
        .toFile(join(OUTPUT_DIR, `${name}.webp`));
    }
    // Groups/events - medium
    else {
      await sharp(inputPath)
        .resize(800, 530, { fit: 'cover', position: 'center' })
        .webp({ quality: 76 })
        .toFile(join(OUTPUT_DIR, `${name}.webp`));
    }

    console.log(`✓ ${file}`);
  }

  console.log('\n✓ All images optimized');
}

optimizeImages().catch(console.error);
