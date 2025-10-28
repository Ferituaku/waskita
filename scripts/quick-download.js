// 1. Domain production
// scripts/quick-download.js
// Quick script untuk download images - paste URLs langsung dari MySQL

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PRODUCTION_DOMAIN = 'https://waskita-elearning.com';

const IMAGE_URLS = [
    '/uploads/images/1760740353783-aids.jpg',
    '/uploads/images/1760759335382-hiv.jpg',
    '/uploads/images/1760759454589-hidup-sehat.jpg',
    '/uploads/images/1760759670050-ibu2.jpg',
];

// 3. Output folder (default: public/images/articles)
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'articles');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✅ Created: ${OUTPUT_DIR}`);
}

// Download function
function download(url, dest) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(dest);

        protocol.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle redirect
                download(response.headers.location, dest).then(resolve).catch(reject);
            } else {
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

// Main function
async function main() {
    console.log('🚀 Downloading images...\n');

    let success = 0;
    let failed = 0;

    for (const url of IMAGE_URLS) {
        const fullUrl = url.startsWith('http') ? url : `${PRODUCTION_DOMAIN}${url}`;
        const filename = path.basename(url);
        const dest = path.join(OUTPUT_DIR, filename);

        try {
            process.stdout.write(`📥 ${filename} ... `);
            await download(fullUrl, dest);
            console.log('✅');
            success++;
        } catch (error) {
            console.log(`❌ ${error.message}`);
            failed++;
        }
    }

    console.log('\n' + '='.repeat(40));
    console.log(`✅ Success: ${success}`);
    console.log(`❌ Failed: ${failed}`);
    console.log('='.repeat(40));
    console.log(`\n📁 Files saved to: ${OUTPUT_DIR}`);

    // List files
    const files = fs.readdirSync(OUTPUT_DIR);
    console.log(`\n📋 Downloaded files (${files.length}):`);
    files.forEach(f => console.log(`   - ${f}`));
}

main().catch(console.error);
