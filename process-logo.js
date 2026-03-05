const sharp = require('sharp');
const fs = require('fs');
const { execSync } = require('child_process');

async function processLogo() {
    console.log('Starting processing...');
    const size = 1024;
    const r = 502; // Slightly smaller than 512 to ensure no checkerboard bleeds on the very edge
    const svgMask = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="512" cy="512" r="${r}" /></svg>`);

    console.log('Creating master mask...');
    await sharp('public/yeni-logo.jpg')
        .resize(size, size, { fit: 'cover' })
        .composite([{ input: svgMask, blend: 'dest-in' }])
        .png()
        .toFile('public/logo-master.png');

    console.log('Generating apple-touch-icon...');
    await sharp('public/logo-master.png').resize(180, 180).toFile('public/apple-touch-icon.png');
    console.log('Generating favicon-32...');
    await sharp('public/logo-master.png').resize(32, 32).toFile('public/favicon-32x32.png');
    console.log('Generating favicon-16...');
    await sharp('public/logo-master.png').resize(16, 16).toFile('public/favicon-16x16.png');

    console.log('Converting to ICO...');
    execSync('npx -y png-to-ico public/favicon-32x32.png > public/favicon.ico');

    console.log('Cleaning up master png...');
    fs.unlinkSync('public/logo-master.png');

    console.log('All favicons generated successfully!');
}

processLogo().catch(console.error);
