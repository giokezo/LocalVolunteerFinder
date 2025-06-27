import type { VolunteerOpportunity } from "../../types/VolunteerOpportunity";
import styles from './OpportunityCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { signUpForOpportunity, deleteOpportunity, unregisterFromOpportunity } from '../../api/opportunityService';
import { saveOpportunity, unsaveOpportunity } from '../../api/userService';
import { Bookmark, BookmarkCheck, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast'; // <-- 1. IMPORT TOAST

interface Props {
  opportunity: VolunteerOpportunity;
  isSaved: boolean;
  onToggleSave: (id: string, saved: boolean) => void;
  onDelete: (id: string) => void;
}

export const OpportunityCard = ({ opportunity, isSaved, onToggleSave, onDelete }: Props) => {
  const { isAuthenticated, user } = useAuth();
  
  const [signedUp, setSignedUp] = useState(
    opportunity.attendees.includes(user?.id || '')
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 2. REMOVE THE OLD ERROR STATE
  // const [error, setError] = useState(''); // <-- This is no longer needed

  const handleSignupToggle = async () => {
    setLoading(true);
    // setError(''); // No longer needed
    try {
      if (signedUp) {
        await unregisterFromOpportunity(opportunity.id);
        setSignedUp(false);
        toast.success('Unregistered successfully!'); // <-- 3. USE TOAST
      } else {
        await signUpForOpportunity(opportunity.id);
        setSignedUp(true);
        toast.success('Signed up successfully!'); // <-- 3. USE TOAST
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Action failed'); // <-- 3. USE TOAST
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
        toast.success('Opportunity unsaved.'); // <-- 3. USE TOAST
      } else {
        await saveOpportunity(opportunity.id);
        onToggleSave(opportunity.id, true);
        toast.success('Opportunity saved!'); // <-- 3. USE TOAST
      }
    } catch (err) {
      console.error("Save/Unsave failed", err);
      toast.error('Failed to update saved status.'); // <-- 3. USE TOAST
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete this opportunity?')) {
      try {
        await deleteOpportunity(opportunity.id);
        onDelete(opportunity.id);
        toast.success('Opportunity deleted.'); // <-- 3. USE TOAST
      } catch (err: any) {
        // Replace alert with toast
        toast.error(err.response?.data?.error || 'Failed to delete opportunity.'); // <-- 3. USE TOAST
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
      <p><strong>Attendees:</strong> {opportunity.attendees.length}</p>

      {/* Organizer-specific actions */}
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

      {/* General user actions */}
      {isAuthenticated ? (
        <div className={styles.actions}>
          <button onClick={handleSignupToggle} disabled={loading}>
            {loading ? '...' : (signedUp ? '✅ Signed Up (Cancel?)' : 'Sign Up')}
          </button>

          <button
            onClick={handleSaveToggle}
            disabled={saving}
            title={isSaved ? 'Unsave' : 'Save'}
            className={styles.saveButton}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>
      ) : (
        <p className={styles.loginPrompt}>Login to sign up or save</p>
      )}

      {/* 4. REMOVE THE OLD ERROR DISPLAY */}
      {/* {error && <p className={styles.error}>{error}</p>} <-- This is no longer needed */}
    </div>
  );
};