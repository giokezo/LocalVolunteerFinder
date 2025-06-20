import request from 'supertest';
import app from '../server';
import { opportunities } from '../data/opportunities';

describe('GET /api/opportunities?keyword=...', () => {
  it('should return one result for a specific keyword', async () => {
    const keyword = 'tutor'; 
    const res = await request(app).get(`/api/opportunities?keyword=${keyword}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1); 
    expect(res.body[0].title.toLowerCase()).toContain(keyword);
  });

  it('should return multiple results for a general keyword', async () => {
    const keyword = 'help'; 
    const res = await request(app).get(`/api/opportunities?keyword=${keyword}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(1);
  });

  it('should be case-insensitive', async () => {
    const keyword = 'BeAcH';
    const res = await request(app).get(`/api/opportunities?keyword=${keyword}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(
      res.body.some((opp: any) =>
        opp.title.toLowerCase().includes('beach') || opp.description.toLowerCase().includes('beach')
      )
    ).toBe(true);
  });

  it('should return empty array for non-matching keyword', async () => {
    const keyword = 'unicorns';
    const res = await request(app).get(`/api/opportunities?keyword=${keyword}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});

describe('GET /api/opportunities with type and keyword filters', () => {
  it('should return all education-type opportunities', async () => {
    const res = await request(app).get('/api/opportunities?type=education');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    for (const opp of res.body) {
      expect(opp.type.toLowerCase()).toBe('education');
    }
  });

  it('should return at least one result for type=environment and keyword=cleanup', async () => {
    const res = await request(app).get('/api/opportunities?type=environment&keyword=cleanup');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); 
    for (const opp of res.body) {
      expect(opp.type.toLowerCase()).toBe('environment');
      expect(
        opp.title.toLowerCase().includes('cleanup') ||
        opp.description.toLowerCase().includes('cleanup')
      ).toBe(true);
    }
  });

  it('should return empty array if type matches but keyword does not', async () => {
    const res = await request(app).get('/api/opportunities?type=education&keyword=cleanup');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should return empty array if keyword matches but type does not', async () => {
    const res = await request(app).get('/api/opportunities?type=animal%20care&keyword=math');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
