import {type VolunteerOpportunity } from '../../types/VolunteerOpportunity';
import { OpportunityCard } from './OpportunityCard';
import './OpportunityList.css';

interface Props {
  opportunities: VolunteerOpportunity[];
  savedIds: string[];
}

const OpportunityList = ({ opportunities, savedIds }: Props) => {
  return (
    <div className="opportunity-list">
      {opportunities.map((op) => (
        <OpportunityCard 
          key={op.id}
          opportunity={op}
          isSaved={savedIds.includes(op.id)} onToggleSave={function (_id: string): void {
            throw new Error('Function not implemented.');
          } }        />
      ))}
    </div>
  );
};

export default OpportunityList;