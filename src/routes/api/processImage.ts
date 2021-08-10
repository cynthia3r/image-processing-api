import express from 'express';
import { promises as fsPromises } from 'fs';
import Path from 'path';
import sharp from 'sharp';
import logger from '../../utilities/logger';

const images = express.Router();

const inputFolder = 'images';
const outputFolder = 'thumbnails';

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

images.get('/', logger, async (req: express.Request, res: express.Response) => {
  const filename = req.query.filename as string;
  const width = req.query.width as string;
  const height = req.query.height as string;

  try {
    // check if query string parameters are valid
    if (!filename || !width || !height) {
      throw new Error(
        'Image cannot be processed: invalid/missing query parameters'
      );
    }

    // check if image file exists in inputFolder
    if (!(await checkImageFileExists(filename))) {
      throw new Error('Image cannot be processed: image file does not exist');
    }
  } catch (err) {
    console.log(err.message);
    // send bad request status code to client
    return res.status(400).end(err.message);
  }

  // logic to resize an image and save it to disk on first access,
  // then pull from disk on subsequent access attempts.
  try {
    const imageFile = Path.resolve(`${inputFolder}/${filename}.jpg`);
    const thumbnailImageFile = Path.resolve(`${outputFolder}/${filename}.jpg`);

    // check if thumbnails folder and image file already exists
    if (
      (await checkPathExists(outputFolder)) &&
      (await checkPathExists(thumbnailImageFile))
    ) {
      console.log('sending previously processed thumbnail image');
    }

    // create thumbnails folder if it does not exist
    if (!(await checkPathExists(outputFolder))) {
      try {
        fsPromises.mkdir(outputFolder);
        console.log('creating thumbnails folder');
      } catch (err) {
        console.log(err.message);
      }
    }

    //perform image processing and generate new thumbnail image
    if (!(await checkPathExists(thumbnailImageFile))) {
      try {
        await sharp(imageFile)
          .resize(parseInt(width), parseInt(height))
          .toFile(`${outputFolder}/${filename}.jpg`);

        console.log('sending newly processed thumbnail image');
      } catch (err) {
        // send internal server error status code to client
        return res
          .status(500)
          .end('image has failed to process due to server side error');
      }
    }

    // send processed image in response
    res.sendFile(Path.resolve(`${outputFolder}/${filename}.jpg`));
  } catch (err) {
    console.log(err.message);
  }
});

export default images;
