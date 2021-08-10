import supertest from 'supertest';
import app from '../../../index';

import {
  checkPathExists,
  checkImageFileExists
} from '../../../routes/api/processImage';

const request = supertest(app);

// test suite for api/images endpoint responses with query string parameters
describe('Tests for api/images endpoint responses', () => {
  it('gets the api/images endpoint response with correct URL parameters', async () => {
    const response = await request.get(
      '/api/images?filename=palmtunnel&width=500&height=200'
    );
    expect(response.status).toBe(200);
  });
  it('should return 400 bad request error if invalid filename', async () => {
    const response = await request.get(
      '/api/images?filename=xyz&width=500&height=200'
    );
    expect(response.status).toBe(400);
  });
  it('should return 400 bad request error if missing width', async () => {
    const response = await request.get(
      '/api/images?filename=palmtunnel&height=200'
    );
    expect(response.status).toBe(400);
  });
  it('should return 400 bad request error if missing height', async () => {
    const response = await request.get(
      '/api/images?filename=palmtunnel&width=500'
    );
    expect(response.status).toBe(400);
  });
  it('should return 400 bad request error if missing filename', async () => {
    const response = await request.get('/api/images?width=500&height=200');
    expect(response.status).toBe(400);
  });
});

// test suite for checking image processing
describe('Tests for image processing', () => {
  it('should find thumbnails folder on server', async () => {
    expect(await checkPathExists('thumbnails')).toBe(true);
  });
  it('should find palmtunnel.jpg file on server', async () => {
    expect(await checkImageFileExists('palmtunnel')).toBe(true);
  });
  it('should not find xyz.jpg file on server', async () => {
    expect(await checkImageFileExists('xyz')).toBe(false);
  });
});
