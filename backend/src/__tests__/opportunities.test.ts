import { findOpportunities, findOpportunityById } from '../services/opportunityService';
import { opportunities } from '../data/opportunities';

describe('opportunityService - findOpportunities', () => {
  it('returns all opportunities if no filters are provided', () => {
    const result = findOpportunities({});
    expect(result.length).toBe(opportunities.length);
  });

  it('filters by keyword only', () => {
    const result = findOpportunities({ keyword: 'tutor' });
    expect(result.every(opp =>
      opp.title.toLowerCase().includes('tutor') ||
      opp.description.toLowerCase().includes('tutor')
    )).toBe(true);
  });

  it('filters by type only', () => {
    const result = findOpportunities({ type: 'education' });
    expect(result.every(opp => opp.type.toLowerCase() === 'education')).toBe(true);
  });

  it('filters by keyword and type together', () => {
    const result = findOpportunities({ keyword: 'math', type: 'education' });
    expect(result.every(opp =>
      opp.type.toLowerCase() === 'education' &&
      (opp.title.toLowerCase().includes('math') ||
       opp.description.toLowerCase().includes('math'))
    )).toBe(true);
  });

  it('returns empty array if no match is found', () => {
    const result = findOpportunities({ keyword: 'unicorn', type: 'animal care' });
    expect(result).toEqual([]);
  });
});

describe('opportunityService - findOpportunityById', () => {
  it('returns the correct opportunity by ID', () => {
    const target = opportunities[0];
    const result = findOpportunityById(target.id);
    expect(result).toEqual(target);
  });

  it('returns undefined if ID does not exist', () => {
    const result = findOpportunityById('non-existent-id');
    expect(result).toBeUndefined();
  });
});
