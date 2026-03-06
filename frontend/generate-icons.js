import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function svgToPng(svgPath, size, outputPath) {
    const svgData = fs.readFileSync(svgPath);
    const resvg = new Resvg(svgData, {
        fitTo: { mode: 'width', value: size },
        background: 'white',
    });
    const pngBuffer = resvg.render().asPng();

    // Use sharp just for final resize + white background to ensure exact dimensions
    await sharp(pngBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .toFormat('png')
        .toFile(outputPath);

    console.log(`Generated: ${outputPath} (${size}x${size})`);
}

async function generateAllIcons() {
    const svgPath = path.join(__dirname, 'public', 'Logo Trường Đại học Greenwich Việt Nam.svg');

    await svgToPng(svgPath, 60, path.join(__dirname, 'public', 'apple-touch-icon.png'));
    await svgToPng(svgPath, 180, path.join(__dirname, 'public', 'pwa-180x180.png'));
    await svgToPng(svgPath, 192, path.join(__dirname, 'public', 'pwa-192x192.png'));
    await svgToPng(svgPath, 512, path.join(__dirname, 'public', 'pwa-512x512.png'));

    console.log('\n✅ Successfully generated all PWA and Apple Touch icons from SVG!');
}

generateAllIcons().catch(console.error);
