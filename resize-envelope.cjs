const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const galleryPath = path.join(__dirname, 'public', 'gallery');

const photosToResize = [
  'IMG_5265.JPG',
  'IMG_5274.JPG',
  'IMG_5282.JPG',
  'IMG_5293.JPG',
  'IMG_5306.JPG',
  'IMG_5318.JPG'
];

async function resizePhotos() {
  for (const photo of photosToResize) {
    const inputPath = path.join(galleryPath, photo);
    const outputPath = path.join(galleryPath, photo.replace('.JPG', '_sm.jpg'));
    
    console.log(`Resizing ${photo}...`);
    try {
      await sharp(inputPath)
        .resize({ width: 800 }) // 800px width is plenty for a 130px polaroid!
        .jpeg({ quality: 80 })
        .toFile(outputPath);
      console.log(`Saved ${outputPath}`);
    } catch (error) {
      console.error(`Error resizing ${photo}:`, error);
    }
  }
}

resizePhotos();
