import type { VolunteerOpportunity } from "../../types/VolunteerOpportunity";
import styles from './OpportunityCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { signUpForOpportunity, deleteOpportunity } from '../../api/opportunityService';
import { saveOpportunity, unsaveOpportunity } from '../../api/userService';
import { Bookmark, BookmarkCheck, Edit, Trash2 } from 'lucide-react'; // Added Edit and Trash2 icons

interface Props {
  opportunity: VolunteerOpportunity;
  isSaved: boolean;
  onToggleSave: (id: string, saved: boolean) => void;
  onDelete: (id: string) => void; // <-- ADDED: A function to call when an item is deleted
}

export const OpportunityCard = ({ opportunity, isSaved, onToggleSave, onDelete }: Props) => {
  const { isAuthenticated, user } = useAuth(); // <-- Get the full user object
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

  // --- NEW: Handler for deleting an opportunity ---
  const handleDelete = async () => {
    // Show a confirmation dialog before proceeding
    if (window.confirm('Are you sure you want to permanently delete this opportunity?')) {
      try {
        await deleteOpportunity(opportunity.id);
        // Notify the parent component to remove this card from the list
        onDelete(opportunity.id); 
      } catch (err: any) {
        alert(`Failed to delete opportunity: ${err.response?.data?.error || err.message}`);
      }
    }
  };

  return (
    <div className={styles.opportunitycard}>
      <h3>{opportunity.title}</h3>
      <p>{opportunity.description}</p>
      <p><strong>Date:</strong> {opportunity.date}</p>
      <p><strong>Location:</strong> {opportunity.location}</p>
      <p><strong>Type:</strong> {opportunity.type}</p>

      {/* --- NEW: Organizer-specific actions --- */}
      {isAuthenticated && user?.role === 'organizer' && user.id === opportunity.organizerId && (
        <div className={styles.organizerActions}>
          <button className={styles.editButton}>
            <Edit size={16} /> Edit
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      )}

      {/* --- Existing user actions --- */}
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