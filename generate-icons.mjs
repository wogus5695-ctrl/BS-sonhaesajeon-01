import { Jimp } from 'jimp';
import fs from 'fs';

async function generate() {
  console.log("Generating logo and icons using Jimp...");

  // Create a 512x512 canvas
  const image = new Jimp({ width: 512, height: 512 });

  const bgCol = 0x0A231CFF; // #0A231C (Dark Forest Green)
  const charCol = 0xC5A880FF; // #C5A880 (Sand Gold)
  const transCol = 0x00000000; // Transparent

  const R = 120;
  const W = 512;
  const H = 512;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let insideBg = false;

      // Distance checking for rounded corners
      if (x < R && y < R) {
        // Top-left
        insideBg = (x - R) ** 2 + (y - R) ** 2 <= R ** 2;
      } else if (x > W - R && y < R) {
        // Top-right
        insideBg = (x - (W - R)) ** 2 + (y - R) ** 2 <= R ** 2;
      } else if (x < R && y > H - R) {
        // Bottom-left
        insideBg = (x - R) ** 2 + (y - (H - R)) ** 2 <= R ** 2;
      } else if (x > W - R && y > H - R) {
        // Bottom-right
        insideBg = (x - (W - R)) ** 2 + (y - (H - R)) ** 2 <= R ** 2;
      } else {
        // Center/edge bounding boxes
        insideBg = x >= 0 && x < W && y >= 0 && y < H;
      }

      if (insideBg) {
        // Character "S" rectangles
        const insideS =
          (x >= 86 && x <= 235 && y >= 126 && y <= 155) || // Top bar
          (x >= 86 && x <= 115 && y >= 126 && y <= 255) || // Left top bar
          (x >= 86 && x <= 235 && y >= 241 && y <= 270) || // Middle bar
          (x >= 206 && x <= 235 && y >= 256 && y <= 385) || // Right bottom bar
          (x >= 86 && x <= 235 && y >= 356 && y <= 385);   // Bottom bar

        // Character "H" rectangles
        const insideH =
          (x >= 276 && x <= 305 && y >= 126 && y <= 385) || // Left vertical bar
          (x >= 396 && x <= 425 && y >= 126 && y <= 385) || // Right vertical bar
          (x >= 306 && x <= 395 && y >= 241 && y <= 270);   // Middle horizontal bar

        if (insideS || insideH) {
          image.setPixelColor(charCol, x, y);
        } else {
          image.setPixelColor(bgCol, x, y);
        }
      } else {
        image.setPixelColor(transCol, x, y);
      }
    }
  }

  // Clone and resize for different targets
  console.log("Writing public/icon.png (192x192)...");
  const iconPng = image.clone();
  iconPng.resize({ w: 192, h: 192 });
  await iconPng.write('public/icon.png');

  console.log("Writing public/apple-icon.png (180x180)...");
  const appleIcon = image.clone();
  appleIcon.resize({ w: 180, h: 180 });
  await appleIcon.write('public/apple-icon.png');

  console.log("Writing public/favicon.ico (32x32 genuine ICO)...");
  const favicon = image.clone();
  favicon.resize({ w: 32, h: 32 });
  
  // Get 32x32 PNG buffer
  const pngBuffer = await favicon.getBuffer('image/png');
  
  // Prepend standard ICO headers (Total 22 bytes header + directory entry)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);    // Reserved
  header.writeUInt16LE(1, 2);    // Resource type (1 for Icon)
  header.writeUInt16LE(1, 4);    // Number of images in file (1)

  const directory = Buffer.alloc(16);
  directory.writeUInt8(32, 0);            // Width (32)
  directory.writeUInt8(32, 1);            // Height (32)
  directory.writeUInt8(0, 2);             // Color count (0 if >=8bpp)
  directory.writeUInt8(0, 3);             // Reserved
  directory.writeUInt16LE(1, 4);          // Color planes (1)
  directory.writeUInt16LE(32, 6);         // Bits per pixel (32)
  directory.writeUInt32LE(pngBuffer.length, 8); // Size of image data in bytes
  directory.writeUInt32LE(22, 12);        // Offset of image data from beginning of file (6 + 16 = 22)

  const icoBuffer = Buffer.concat([header, directory, pngBuffer]);
  await fs.promises.writeFile('public/favicon.ico', icoBuffer);

  console.log("All icons successfully generated!");
}

generate().catch(err => {
  console.error("Error generating icons:", err);
  process.exit(1);
});
