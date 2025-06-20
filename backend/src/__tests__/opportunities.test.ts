import request from 'supertest';
import app from '../server';
import { opportunities } from '../data/opportunities';

describe('GET /api/opportunities', () => {
  it('should return status 200 and the full list of opportunities', async () => {
    const response = await request(app).get('/api/opportunities');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(opportunities.length);
  });
});

describe('GET /api/opportunities/:id', () => {
  it('should return status 200 and correct opportunity for a valid ID', async () => {
    const validId = '1';
    const expectedOpportunity = opportunities.find(opp => opp.id === validId)!;

    const response = await request(app).get(`/api/opportunities/${validId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', validId);
    expect(response.body).toHaveProperty('title', expectedOpportunity.title);
  });

  it('should return 404 and error message for an invalid ID', async () => {
    const response = await request(app).get('/api/opportunities/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Opportunity not found');
  });
});
