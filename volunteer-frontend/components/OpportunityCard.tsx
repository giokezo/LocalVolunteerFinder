import type {VolunteerOpportunity} from "../src/types/VolunteerOpportunity"

export const OpportunityCard = ({ opportunity }: { opportunity: VolunteerOpportunity }) => (
  <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem' }}>
    <h3>{opportunity.title}</h3>
    <p>{opportunity.description}</p>
    <p><strong>Date:</strong> {opportunity.date}</p>
    <p><strong>Location:</strong> {opportunity.location}</p>
    <p><strong>Type:</strong> {opportunity.type}</p>
  </div>
);
