export interface VolunteerOpportunity {
  date: string;
  description: string;
  id: string;
  location: string;
  title: string;
  type: string;
  organizerId: string;
  latitude: number;
  longitude: number;
    attendees: string[];
}