// volunteer-frontend/src/pages/HomePage.tsx
import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunityService";
import { getCurrentUser } from "../api/authService";
import { type VolunteerOpportunity } from "../types/VolunteerOpportunity";
import OpportunityList from "../components/card/OpportunityList";
import SearchBar from "../components/card/SearchBar";
import Filter from "../components/card/Filter";
import Pagination from "../components/card/Pagination"; // Import the new component
import { useAuth } from "../context/AuthContext";
import "../App.css";

const HomePage = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- New state for pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const { isAuthenticated } = useAuth();

  // --- Updated useEffect hook to handle pagination and filtering ---
  useEffect(() => {
    // When filters change, reset to page 1
    if (currentPage !== 1) {
        setCurrentPage(1);
        return; // Let the effect re-run for page 1
    }

    // Inside your HomePage component

const loadData = async () => {
  setIsLoading(true);
  try {
    // Pass page and filters to the API call
    const response = await getOpportunities(currentPage, 10, { keyword: searchTerm, type: selectedType });
    
    // --- THIS IS THE CRITICAL FIX ---
    // The 'response' is now the object: { opportunities: [...], totalPages: X }
    // We need to set state from its properties.
    setOpportunities(response); // <-- Use response.opportunities
    setTotalPages(response.totalPages);       // <-- Use response.totalPages
    // console.log("Correct response object from API:", response); // This will now show the object
    
    if (isAuthenticated) {
      const user = await getCurrentUser();
      setSavedIds(user.savedOpportunities || []); // Ensure savedOpportunities is an array
    }
    setError(null);
  } catch (err) {
    console.error("Failed to load data:", err);
    setError("Failed to load volunteer opportunities. Please try again later.");
    setOpportunities([]); // On error, set to an empty array
    setTotalPages(0);
  } finally {
    setIsLoading(false);
  }
};

    loadData();
    // Dependency array now includes filters to reset pagination
  }, [isAuthenticated, currentPage, searchTerm, selectedType]);

  const handleToggleSave = (id: string, saved: boolean) => {
    if (saved) {
      setSavedIds(prev => [...prev, id]);
    } else {
      setSavedIds(prev => prev.filter(savedId => savedId !== id));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  // The opportunities state is now already filtered by the backend
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
        <>
          <OpportunityList 
            opportunities={opportunities} 
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;