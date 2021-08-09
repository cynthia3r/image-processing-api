import express from 'express';
import sharp from 'sharp';
import { promises as fsPromises } from 'fs';
import logger from '../../utilities/logger';

const images = express.Router();

const inputFolder = 'images';
const outputFolder = 'thumbnails';

images.get('/', logger, (req, res) => {
  res.send('image processed');
});

export default images;
