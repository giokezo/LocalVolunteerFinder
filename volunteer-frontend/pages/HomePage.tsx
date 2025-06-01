import { useEffect, useState } from 'react';
import { getOpportunities } from '../src/api/opportunityService';
import { OpportunityCard } from '../components/OpportunityCard';
import { VolunteerOpportunity } from '../src/types/VolunteerOpportunity';

const HomePage = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);

  useEffect(() => {
    getOpportunities().then(setOpportunities);
  }, []);

  return (
    <div>
      <h1>Volunteer Opportunities</h1>
      {opportunities.map(op => (
        <OpportunityCard key={op.id} opportunity={op} />
      ))}
    </div>
  );
};

export default HomePage;
