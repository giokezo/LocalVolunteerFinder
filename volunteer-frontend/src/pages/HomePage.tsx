import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunityService";
import { getCurrentUser } from "../api/authService";
import { type VolunteerOpportunity } from "../types/VolunteerOpportunity";
import OpportunityList from "../components/card/OpportunityList";
import SearchBar from "../components/card/SearchBar";
import Filter from "../components/card/Filter";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const HomePage = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const opps = await getOpportunities();
        setOpportunities(opps);

        if (isAuthenticated) {
          const user = await getCurrentUser();
          setSavedIds(user.savedOpportunities);
        }
        setError(null);
      } catch {
        setError("Failed to load volunteer opportunities. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const filteredOpportunities = opportunities.filter((op) =>
    (`${op.title} ${op.description}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedType === "" || op.type.toLowerCase() === selectedType.toLowerCase())
  );

  return (
    <div className="main-container">
      <h1 className="title">Volunteer Opportunities</h1>

      <div className="controls-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Filter selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>

      {isLoading && <div className="status-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}

      {!isLoading && !error && (
        <OpportunityList opportunities={filteredOpportunities} savedIds={savedIds} />
      )}
    </div>
  );
};

export default HomePage;
