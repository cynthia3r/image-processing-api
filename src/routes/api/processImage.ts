import express from 'express';
import Path from 'path';
import logger from '../../utilities/logger';
import {
  checkImageFileExists,
  checkPathExists,
  createThumbnailDir,
  processImage,
  inputFolder,
  outputFolder
} from '../../utilities/imageProcessUtilities';

const images = express.Router();

images.get('/', logger, async (req: express.Request, res: express.Response) => {
  const filename = req.query.filename as string;
  const width = Number(req.query.width) as number;
  const height = Number(req.query.height) as number;

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

  // implement logic to resize an image and save it to disk on first access,
  // then pull from disk on subsequent access attempts.
  try {
    const imageFile = Path.resolve(`${inputFolder}/${filename}.jpg`);
    const thumbnailImageFile = Path.resolve(
      `${outputFolder}/${filename}-${width}X${height}.jpg`
    );

    // check if thumbnails folder and image file already exists
    if (
      (await checkPathExists(outputFolder)) &&
      (await checkPathExists(thumbnailImageFile))
    ) {
      console.log('sending previously processed thumbnail image');
    }

    // create thumbnails folder if it does not exist
    createThumbnailDir();

    //perform image processing and generate new thumbnail image
    if (!(await checkPathExists(thumbnailImageFile))) {
      try {
        await processImage(imageFile, thumbnailImageFile, width, height);

        console.log('sending newly processed thumbnail image');
      } catch (err) {
        // send internal server error status code to client
        return res
          .status(500)
          .end('image has failed to process due to server side error');
      }
    }
    console.log(`${outputFolder}/${filename}-${width}X${height}.jpg`);
    // send processed image in response
    res.sendFile(
      Path.resolve(`${outputFolder}/${filename}-${width}X${height}.jpg`)
    );
  } catch (err) {
    console.log(err.message);
  }
});

export default images;
