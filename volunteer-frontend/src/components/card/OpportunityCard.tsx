import type { VolunteerOpportunity } from "../../types/VolunteerOpportunity";
import styles from './OpportunityCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { signUpForOpportunity } from '../../api/opportunityService';
import { saveOpportunity, unsaveOpportunity } from '../../api/userService';
import { Bookmark, BookmarkCheck } from 'lucide-react'; // optional: replace with any icon or text

interface Props {
  opportunity: VolunteerOpportunity;
  isSaved: boolean; // <-- from HomePage
  onToggleSave: (id: string, saved: boolean) => void; // <-- from HomePage to update saved state
}

export const OpportunityCard = ({ opportunity, isSaved, onToggleSave }: Props) => {
  const { isAuthenticated } = useAuth();
  const [signedUp, setSignedUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handleSaveToggle = async () => {
    if (!isAuthenticated) return;
    setSaving(true);
    try {
      if (isSaved) {
        await unsaveOpportunity(opportunity.id);
        onToggleSave(opportunity.id, false);
      } else {
        await saveOpportunity(opportunity.id);
        onToggleSave(opportunity.id, true);
      }
    } catch (err) {
      console.error("Save/Unsave failed", err);
    } finally {
      setSaving(false);
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
        <>
          <div className={styles.actions}>
            {signedUp ? (
              <button disabled>✅ Signed Up</button>
            ) : (
              <button onClick={handleSignup} disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            )}

            <button
              onClick={handleSaveToggle}
              disabled={saving}
              title={isSaved ? 'Unsave' : 'Save'}
              className={styles.saveButton}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        </>
      ) : (
        <p className={styles.loginPrompt}>Login to sign up or save</p>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};
