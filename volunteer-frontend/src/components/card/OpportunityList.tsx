import { type VolunteerOpportunity } from '../../types/VolunteerOpportunity';
import { OpportunityCard } from './OpportunityCard';
import './OpportunityList.css';

// --- STEP 1: Update the Props interface to accept onDelete ---
interface Props {
  opportunities: VolunteerOpportunity[];
  savedIds: string[];
  onToggleSave: (id: string, saved: boolean) => void;
  onDelete: (id: string) => void; // <-- ADD THIS LINE
}

// --- STEP 2: Destructure the new onDelete prop ---
const OpportunityList = ({ opportunities = [], savedIds, onToggleSave, onDelete }: Props) => {
  return (
    <div className="opportunity-list">
      {opportunities.map((op) => (
        <OpportunityCard 
          key={op.id}
          opportunity={op}
          isSaved={savedIds.includes(op.id)}
          onToggleSave={onToggleSave}
          onDelete={onDelete} // <-- STEP 3: Pass the onDelete prop down to the card
        />
      ))}
    </div>
  );
};

export default OpportunityList;