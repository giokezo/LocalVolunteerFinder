import type { VolunteerOpportunity } from "../../types/VolunteerOpportunity";
import styles from './OpportunityCard.module.css';

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => (
  <div className={styles.opportunitycard}>
    <h3>{opportunity.title}</h3>
    <p>{opportunity.description}</p>
    <p><strong>Date:</strong> {opportunity.date}</p>
    <p><strong>Location:</strong> {opportunity.location}</p>
    <p><strong>Type:</strong> {opportunity.type}</p>
  </div>
);
