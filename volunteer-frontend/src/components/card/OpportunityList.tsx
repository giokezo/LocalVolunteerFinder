import {type VolunteerOpportunity } from '../../types/VolunteerOpportunity';
import { OpportunityCard } from './OpportunityCard';
import './OpportunityList.css';

interface Props {
  opportunities: VolunteerOpportunity[];
}

const OpportunityList = ({ opportunities }: Props) => {
  return (
    <div className="opportunity-list">
      {opportunities.map((op) => (
        <OpportunityCard key={op.id} opportunity={op} />
      ))}
    </div>
  );
};

export default OpportunityList;
