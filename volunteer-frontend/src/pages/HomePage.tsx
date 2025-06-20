import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunityService";
import { type VolunteerOpportunity } from "../types/VolunteerOpportunity";
import OpportunityList from "../components/card/OpportunityList";
import SearchBar from "../components/card/SearchBar";
import Filter from "../components/card/Filter";
import "../App.css"; // Or your HomePage.module.css

const HomePage = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
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
    (`${op.title} ${op.description}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedType === "" || op.type.toLowerCase() === selectedType.toLowerCase())
  );

  return (
    <div className="main-container">
      <h1 className="title">Volunteer Opportunities</h1>

      {/* Search and Filter section */}
      <div className="controls-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Filter selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>

      {/* Loading / Error */}
      {isLoading && <div className="status-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* List of Opportunities */}
      {!isLoading && !error && (
        <OpportunityList opportunities={filteredOpportunities} />
      )}
    </div>
  );
};

export default HomePage;
