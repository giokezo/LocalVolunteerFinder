import { useEffect, useState } from 'react';
import { getOpportunities } from '../api/opportunityService';
import { OpportunityCard } from '../components/card/OpportunityCard';
import {type VolunteerOpportunity } from '../types/VolunteerOpportunity';

export const dummyOpportunities: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Beach Cleanup",
    description: "Join us for a community beach cleanup and help preserve the marine environment.",
    date: "2025-07-05",
    location: "Batumi Beach, Georgia",
    type: "Environmental"
  },
  {
    id: "2",
    title: "Food Bank Assistance",
    description: "Assist in organizing and distributing food packages to families in need.",
    date: "2025-07-10",
    location: "Tbilisi Food Bank",
    type: "Social Work"
  },
  {
    id: "3",
    title: "Animal Shelter Volunteer",
    description: "Help care for rescued animals by feeding, cleaning, and playing with them.",
    date: "2025-07-12",
    location: "Kutaisi Animal Shelter",
    type: "Animal Care"
  },
  {
    id: "4",
    title: "Tech Workshop for Kids",
    description: "Teach basic coding and computer skills to children aged 10-14.",
    date: "2025-07-15",
    location: "Gori Youth Center",
    type: "Education"
  },
  {
    id: "5",
    title: "Tree Planting Day",
    description: "Plant trees in the local park to support reforestation efforts.",
    date: "2025-07-18",
    location: "Rustavi Central Park",
    type: "Environmental"
  }
];


const HomePage = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>(dummyOpportunities);
  const [isLoading, setIsLoading] = useState(true); // ✅ NEW loading state

  useEffect(() => {
    getOpportunities()
      .then(data => {
        setOpportunities(data);
        setIsLoading(false); // ✅ Done loading
      })
      .catch(() => {
        setIsLoading(false); // ✅ Still stop loading even if error occurs
        // You can handle error messaging here too
      });
  }, []);

  return (
    <div>
      <h1>Volunteer Opportunities</h1>
      
      {isLoading ? (
        <div>Loading...</div> // ✅ Loading state
      ) : (
        opportunities.map(op => (
          <OpportunityCard key={op.id} opportunity={op} />
        ))
      )}
    </div>
  );
};


export default HomePage;
