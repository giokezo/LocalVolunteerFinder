import { useEffect, useState } from 'react';
import { getOpportunities } from '../api/opportunityService';
import {type VolunteerOpportunity } from '../types/VolunteerOpportunity';
import SearchBar from '../components/card/SearchBar';
import OpportunityList from '../components/card/OpportunityList';
import '../App.css';

const HomePage = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOpportunities()
      .then(data => {
        setOpportunities(data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load volunteer opportunities. Please try again later.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="main-container">
      <h1>Volunteer Opportunities</h1>
      <SearchBar />

      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      {!isLoading && !error && opportunities.length === 0 && (
        <div>No volunteer opportunities found.</div>
      )}

      {!isLoading && !error && opportunities.length > 0 && (
        <OpportunityList opportunities={opportunities} />
      )}
    </div>
  );
};

export default HomePage;
