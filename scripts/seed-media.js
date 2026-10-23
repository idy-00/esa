// Copie les photos historiques d'Actualités / Vie étudiante vers public/media
// pour qu'elles aient une URL stable, gérable depuis le dashboard admin.
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, parse } from 'path';

const SRC = './src/assets/images';
const OUT = './public/media';
const FOLDERS = ['72h-activites', 'cocktail', 'immersion', 'reunion-bts', 'soutenance-3eme', 'optimized'];

for (const folder of FOLDERS) {
  await mkdir(join(OUT, folder), { recursive: true });
  const files = (await readdir(join(SRC, folder))).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  for (const file of files) {
    const { name } = parse(file);
    await sharp(join(SRC, folder, file))
      .rotate()
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(OUT, folder, `${name}.webp`));
    console.log(`✓ ${folder}/${name}.webp`);
  }
}
