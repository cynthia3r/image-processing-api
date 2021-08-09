import express from 'express';
import images from './api/processImage';
import logger from '../utilities/logger';

const routes = express.Router();

routes.get('/', logger, (req, res) => {
    res.send('main api route');
});

routes.use('/images', images);

export default routes;