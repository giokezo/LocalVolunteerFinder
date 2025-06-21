import { opportunities } from '../data/opportunities';
import { VolunteerOpportunity } from '../models/VolunteerOpportunity';

interface OpportunityFilters {
  keyword?: string;
  type?: string;
}

export function findOpportunities(filters: OpportunityFilters): VolunteerOpportunity[] {
  let results = [...opportunities];

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    results = results.filter(opp =>
      opp.title.toLowerCase().includes(keyword) ||
      opp.description.toLowerCase().includes(keyword)
    );
  }

  if (filters.type) {
    const type = filters.type.toLowerCase();
    results = results.filter(opp =>
      opp.type.toLowerCase() === type
    );
  }

  return results;
}

export function findOpportunityById(id: string): VolunteerOpportunity | undefined {
  return opportunities.find(opp => opp.id === id);
}
