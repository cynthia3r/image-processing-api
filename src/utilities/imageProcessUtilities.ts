import { promises as fsPromises } from 'fs';
import sharp from 'sharp';

export const inputFolder = 'images';
export const outputFolder = 'thumbnails';

export async function checkPathExists(path: string): Promise<boolean> {
  try {
    await fsPromises.access(path);
    return true;
  } catch (err) {
    // console.log(err.message);
    return false;
  }
}

export async function checkImageFileExists(
  imageFilename: string
): Promise<boolean> {
  try {
    const dirFiles = await fsPromises.readdir(inputFolder);
    const fileNamesWithoutExtension = dirFiles.map(
      (dirFile) => dirFile.split('.')[0]
    );

    const fileExists = fileNamesWithoutExtension.find(
      (filename) => filename === imageFilename
    );

    if (fileExists) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    // console.log(err.message);
    return false;
  }
}

export async function createThumbnailDir(): Promise<void> {
  // create thumbnails folder if it does not exist
  if (!(await checkPathExists(outputFolder))) {
    try {
      fsPromises.mkdir(outputFolder);
      console.log('creating thumbnails folder');
    } catch (err) {
      console.log(err.message);
    }
  }
}

export async function processImage(
  imageFile: string,
  thumbnailImageFile: string,
  width: number,
  height: number
): Promise<void> {
  try {
    await sharp(imageFile).resize(width, height).toFile(thumbnailImageFile);
  } catch (err) {
    console.log(err.message);
  }
}
