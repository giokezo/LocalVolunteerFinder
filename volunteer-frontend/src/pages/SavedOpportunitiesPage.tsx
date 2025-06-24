import { useState, useEffect } from 'react';
// FIX: Corrected the import path from opportunityService to userService
import { getSavedOpportunities } from '../api/userService';
import type { VolunteerOpportunity } from '../types/VolunteerOpportunity';
import OpportunityList from '../components/card/OpportunityList';
import "../App.css";

const SavedOpportunitiesPage = () => {
  const [savedOpportunities, setSavedOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setIsLoading(true);
        const data = await getSavedOpportunities();
        setSavedOpportunities(data);
      } catch (err) {
        setError('Failed to load saved opportunities. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const handleToggleSave = (id: string, saved: boolean) => {
    if (!saved) {
      setSavedOpportunities(prev => prev.filter(op => op.id !== id));
    }
  };

  if (isLoading) {
    return <div className="status-msg">Loading your saved opportunities...</div>;
  }

  if (error) {
    return <div className="error-msg">{error}</div>;
  }

  return (
    <div className="page-container">
      <h1>My Saved Opportunities</h1>
      {savedOpportunities.length > 0 ? (
        <OpportunityList
          opportunities={savedOpportunities}
          savedIds={savedOpportunities.map(op => op.id)}
          onToggleSave={handleToggleSave}
        />
      ) : (
        <p>You haven't saved any opportunities yet. Go back to the homepage to find some!</p>
      )}
    </div>
  );
};

export default SavedOpportunitiesPage;