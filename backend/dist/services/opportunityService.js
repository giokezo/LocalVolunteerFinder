"use strict";
// backend/src/services/opportunityService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOpportunities = findOpportunities;
exports.findOpportunityById = findOpportunityById;
const opportunities_1 = require("../data/opportunities");
// THIS IS THE CORRECT, FINAL VERSION OF THIS FUNCTION
function findOpportunities(filters) {
    const { keyword, type, page = 1, limit = 10 } = filters;
    // 1. Start with the full, unfiltered list.
    let filteredResults = [...opportunities_1.opportunities];
    // 2. Apply keyword filter if it exists.
    if (keyword) {
        const keywordLower = keyword.toLowerCase();
        filteredResults = filteredResults.filter(opp => opp.title.toLowerCase().includes(keywordLower) ||
            opp.description.toLowerCase().includes(keywordLower));
    }
    // 3. Apply type filter if it exists.
    if (type) {
        const typeLower = type.toLowerCase();
        filteredResults = filteredResults.filter(opp => opp.type.toLowerCase() === typeLower);
    }
    // 4. After all filtering, calculate total counts from the *filtered* list.
    const totalOpportunities = filteredResults.length;
    const totalPages = Math.ceil(totalOpportunities / limit);
    // 5. Slice the filtered list to get the items for the current page.
    const startIndex = (page - 1) * limit;
    const paginatedOpportunities = filteredResults.slice(startIndex, startIndex + limit);
    // 6. Return the structured response object. This is the crucial part.
    return {
        opportunities: paginatedOpportunities,
        currentPage: page,
        totalPages,
        totalOpportunities,
    };
}
function findOpportunityById(id) {
    return opportunities_1.opportunities.find(opp => opp.id === id);
}
