"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const opportunityService_1 = require("../services/opportunityService");
const opportunities_1 = require("../data/opportunities");
describe('opportunityService - findOpportunities', () => {
    it('returns all opportunities if no filters are provided', () => {
        const result = (0, opportunityService_1.findOpportunities)({});
        expect(result.length).toBe(opportunities_1.opportunities.length);
    });
    it('filters by keyword only', () => {
        const result = (0, opportunityService_1.findOpportunities)({ keyword: 'tutor' });
        expect(result.every(opp => opp.title.toLowerCase().includes('tutor') ||
            opp.description.toLowerCase().includes('tutor'))).toBe(true);
    });
    it('filters by type only', () => {
        const result = (0, opportunityService_1.findOpportunities)({ type: 'education' });
        expect(result.every(opp => opp.type.toLowerCase() === 'education')).toBe(true);
    });
    it('filters by keyword and type together', () => {
        const result = (0, opportunityService_1.findOpportunities)({ keyword: 'math', type: 'education' });
        expect(result.every(opp => opp.type.toLowerCase() === 'education' &&
            (opp.title.toLowerCase().includes('math') ||
                opp.description.toLowerCase().includes('math')))).toBe(true);
    });
    it('returns empty array if no match is found', () => {
        const result = (0, opportunityService_1.findOpportunities)({ keyword: 'unicorn', type: 'animal care' });
        expect(result).toEqual([]);
    });
});
describe('opportunityService - findOpportunityById', () => {
    it('returns the correct opportunity by ID', () => {
        const target = opportunities_1.opportunities[0];
        const result = (0, opportunityService_1.findOpportunityById)(target.id);
        expect(result).toEqual(target);
    });
    it('returns undefined if ID does not exist', () => {
        const result = (0, opportunityService_1.findOpportunityById)('non-existent-id');
        expect(result).toBeUndefined();
    });
});
