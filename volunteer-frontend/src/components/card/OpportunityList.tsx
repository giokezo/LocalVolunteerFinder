// volunteer-frontend/src/components/card/OpportunityList.tsx

import { type VolunteerOpportunity } from '../../types/VolunteerOpportunity';
import { OpportunityCard } from './OpportunityCard';
import './OpportunityList.css';

interface Props {
  opportunities: VolunteerOpportunity[];
  savedIds: string[];
  onToggleSave: (id: string, saved: boolean) => void;
}

// ======================= THE FIX IS HERE =======================
// By adding `= []` we provide a default value.
// If the `opportunities` prop is undefined, it will use an empty array instead.
const OpportunityList = ({ opportunities = [], savedIds, onToggleSave }: Props) => {
// ===============================================================
  return (
    <div className="opportunity-list">
      {opportunities.map((op) => (
        <OpportunityCard 
          key={op.id}
          opportunity={op}
          isSaved={savedIds.includes(op.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
};

export default OpportunityList;