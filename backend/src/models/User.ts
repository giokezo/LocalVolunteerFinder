export interface User {
  id: string;
  name: string;
  email: string;
  password: string; 
  savedOpportunities: string[];
  role: 'volunteer' | 'organizer';
}