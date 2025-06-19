import request from 'supertest';
import app from '../server'; // adjust if your app is exported from a different file
import { opportunities } from '../data/opportunities';

describe('GET /api/opportunities', () => {
  it('should return status 200 and the full list of opportunities', async () => {
    const response = await request(app).get('/api/opportunities');

    // Assert HTTP status
    expect(response.status).toBe(200);

    // Assert response is an array
    expect(Array.isArray(response.body)).toBe(true);

    // Assert the length matches the mock data
    expect(response.body.length).toBe(opportunities.length);
  });
});
