import type { VolunteerOpportunity } from "../../types/VolunteerOpportunity";
import style from "./OpportunityCard.module.css"

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => (
  <div className = {style.opportunityCard}>
    <h3 className={style.opportunityTitle}>{opportunity.title}</h3>
    <p className={style.opportunityDescription}>{opportunity.description}</p>
    <div className={style.opportunityDetails}>
      <p><strong>Date:</strong> {opportunity.date}</p>
      <p><strong>Location:</strong> {opportunity.location}</p>
      <p><strong>Type:</strong> {opportunity.type}</p>
    </div>
  </div>
);
