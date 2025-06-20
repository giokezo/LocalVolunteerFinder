import React from 'react';
import { OpportunityCard } from './OpportunityCard';
import {type VolunteerOpportunity } from '../../../../backend/src/models/VolunteerOpportunity';

interface Props {
  opportunities: VolunteerOpportunity[];
}

const OpportunityList: React.FC<Props> = ({ opportunities }) => {
  return (
    <div className="opportunity-list">
      {opportunities.map(op => (
        <OpportunityCard key={op.id} opportunity={op} />
      ))}
    </div>
  );
};

export default OpportunityList;
