import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSavedOpportunities, getSignedUpOpportunities } from '../api/userService';
import type { VolunteerOpportunity } from '../types/VolunteerOpportunity';
import OpportunityList from '../components/card/OpportunityList';
import styles from './DashboardPage.module.css'; // We will create this CSS file next

const DashboardPage = () => {
  const { user } = useAuth();
  const [savedOpportunities, setSavedOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [signedUpOpportunities, setSignedUpOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return; // Should not happen if page is protected, but good practice
      
      try {
        // Fetch saved and signed-up opportunities concurrently
        const [saved, signedUp] = await Promise.all([
          getSavedOpportunities(),
          getSignedUpOpportunities()
        ]);
        setSavedOpportunities(saved);
        setSignedUpOpportunities(signedUp);
      } catch (err) {
        setError('Failed to load your dashboard. Please try refreshing the page.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleToggleSave = (id: string, saved: boolean) => {
    // If an item is unsaved, remove it from both lists visually
    if (!saved) {
      setSavedOpportunities(prev => prev.filter(op => op.id !== id));
      setSignedUpOpportunities(prev => prev.map(op => op.id === id ? { ...op, isSaved: false } : op));
    }
  };

  if (isLoading) {
    return <div className={styles.statusMsg}>Loading your dashboard...</div>;
  }

  if (error) {
    return <div className={styles.errorMsg}>{error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>My Dashboard</h1>

      <section className={styles.profileSection}>
        <h2>Profile Information</h2>
        <div className={styles.profileDetails}>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>
      </section>
      
      <section>
        <h2>My Signed-Up Events</h2>
        {signedUpOpportunities.length > 0 ? (
          <OpportunityList
            opportunities={signedUpOpportunities}
            savedIds={savedOpportunities.map(op => op.id)}
            onToggleSave={handleToggleSave}
          />
        ) : (
          <p className={styles.emptyMessage}>You haven't signed up for any events yet.</p>
        )}
      </section>
      
      <section>
        <h2>My Saved Opportunities</h2>
        {savedOpportunities.length > 0 ? (
          <OpportunityList
            opportunities={savedOpportunities}
            savedIds={savedOpportunities.map(op => op.id)}
            onToggleSave={handleToggleSave}
          />
        ) : (
          <p className={styles.emptyMessage}>You don't have any saved opportunities.</p>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;