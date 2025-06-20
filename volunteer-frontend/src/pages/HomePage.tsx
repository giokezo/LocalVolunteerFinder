// HomePage.tsx
import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunityService";
import { type VolunteerOpportunity } from "../types/VolunteerOpportunity";
import OpportunityList from "../components/card/OpportunityList";
import SearchBar from "../components/card/SearchBar";
import "../App.css"; // or HomePage.module.css

const HomePage = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOpportunities()
      .then((data) => {
        setOpportunities(data);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load volunteer opportunities. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredOpportunities = opportunities.filter((op) =>
    `${op.title} ${op.description}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-container">
      <h1 className="title">Volunteer Opportunities</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {!isLoading && !error && (
        <OpportunityList opportunities={filteredOpportunities} />
      )}
    </div>
  );
};

export default HomePage;
