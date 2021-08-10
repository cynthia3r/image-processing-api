import supertest from 'supertest';
import app from '../../index';

const request = supertest(app);

// test suite for api endpoint test
describe('Test endpoint responses', () => {
  it('gets the api endpoint', async () => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
  });
  it('gets the api/images endpoint', async () => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(400);
  });
});
