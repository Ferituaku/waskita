// scripts/generate-dummy-images.js
// Script untuk generate dummy placeholder images untuk testing

const fs = require('fs');
const path = require('path');
const https = require('https');

// Konfigurasi
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'uploads', 'images');
const PLACEHOLDER_SERVICE = 'https://placehold.co'; // atau 'https://via.placeholder.com'
const IMAGE_SIZES = [
  { width: 1200, height: 630, name: 'default-article.jpg' },
  { width: 1200, height: 630, name: '1760759670050-ibu2.jpg' },
];

// Warna untuk placeholder
const COLORS = [
  { bg: 'e74c3c', text: 'ffffff' }, // Red
  { bg: '3498db', text: 'ffffff' }, // Blue
  { bg: '2ecc71', text: 'ffffff' }, // Green
  { bg: '9b59b6', text: 'ffffff' }, // Purple
];

// Create directory if not exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

// Download image from URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

// Generate dummy image
async function generateDummyImage(width, height, filename, colorIndex = 0) {
  const color = COLORS[colorIndex % COLORS.length];
  
  // URL format: https://placehold.co/WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR/png?text=TEXT
  const text = encodeURIComponent('Article Image');
  const url = `${PLACEHOLDER_SERVICE}/${width}x${height}/${color.bg}/${color.text}/png?text=${text}`;
  
  const filepath = path.join(OUTPUT_DIR, filename);

  try {
    console.log(`📥 Downloading: ${filename}...`);
    await downloadImage(url, filepath);
    console.log(`✅ Generated: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`❌ Failed to generate ${filename}:`, error.message);
    throw error;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting dummy image generation...\n');

  // Ensure output directory exists
  ensureDir(OUTPUT_DIR);
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  // Generate images
  for (let i = 0; i < IMAGE_SIZES.length; i++) {
    const { width, height, name } = IMAGE_SIZES[i];
    try {
      await generateDummyImage(width, height, name, i);
    } catch (error) {
      console.error(`Failed to generate ${name}`);
    }
  }

  // Generate additional dummy images for testing
  console.log('\n📸 Generating additional test images...');
  for (let i = 1; i <= 5; i++) {
    const timestamp = Date.now() + i;
    const filename = `${timestamp}-test-${i}.jpg`;
    try {
      await generateDummyImage(1200, 630, filename, i);
    } catch (error) {
      console.error(`Failed to generate ${filename}`);
    }
  }

  console.log('\n✅ All done! Images generated in:', OUTPUT_DIR);
  console.log('\n🔗 You can now access them at:');
  console.log('   http://localhost:3000/uploads/images/[filename]');
}

// Run
main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});