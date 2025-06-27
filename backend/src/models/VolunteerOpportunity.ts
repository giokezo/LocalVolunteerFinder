export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  attendees: string[];
  organizerId: string;
  latitude: number;
  longitude: number;
}