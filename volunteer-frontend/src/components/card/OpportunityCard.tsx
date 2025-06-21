import type { VolunteerOpportunity } from "../../types/VolunteerOpportunity";
import styles from './OpportunityCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { signUpForOpportunity } from '../../api/opportunityService';

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => {
  const { isAuthenticated } = useAuth();
  const [signedUp, setSignedUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await signUpForOpportunity(opportunity.id);
      setSignedUp(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.opportunitycard}>
      <h3>{opportunity.title}</h3>
      <p>{opportunity.description}</p>
      <p><strong>Date:</strong> {opportunity.date}</p>
      <p><strong>Location:</strong> {opportunity.location}</p>
      <p><strong>Type:</strong> {opportunity.type}</p>

      {isAuthenticated ? (
        signedUp ? (
          <button disabled>✅ Signed Up</button>
        ) : (
          <button onClick={handleSignup} disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        )
      ) : (
        <p className={styles.loginPrompt}>Login to sign up</p>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
