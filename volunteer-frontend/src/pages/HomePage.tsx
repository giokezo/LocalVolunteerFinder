import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunityService";
import { getCurrentUser } from "../api/authService";
import { type VolunteerOpportunity } from "../types/VolunteerOpportunity";
import OpportunityList from "../components/card/OpportunityList";
import SearchBar from "../components/card/SearchBar";
import Filter from "../components/card/Filter";
import Pagination from "../components/card/Pagination";
import LocationFilter from "../components/card/LocationFilter";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const HomePage = () => {
  // --- State for Data and UI ---
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for Filters ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --- State for Location Filters ---
  const [zipcode, setZipcode] = useState('');
  const [radius, setRadius] = useState(10); // Default to 10 miles
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  const { isAuthenticated } = useAuth();

  // --- Main Data Fetching Effect ---
  // This effect runs whenever a filter or the page number changes.
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      // Build the filter object to send to the API
      const filters: any = { 
        keyword: searchTerm, 
        type: selectedType, 
        radius,
      };
      
      // Prioritize user's direct coordinates over zipcode
      if (userCoords) {
        filters.latitude = userCoords.lat;
        filters.longitude = userCoords.lon;
      } else if (zipcode && zipcode.length >= 5) { // Only search on valid-length zip
        filters.zipcode = zipcode;
      }

      try {
        const response = await getOpportunities(currentPage, 10, filters);
        
        // Correctly set state from the response object's properties
        setOpportunities(response); 
        setTotalPages(response.totalPages);
        
        if (isAuthenticated) {
          const user = await getCurrentUser();
          setSavedIds(user.savedOpportunities || []);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load volunteer opportunities. Please try again later.");
        setOpportunities([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, currentPage, searchTerm, selectedType, zipcode, radius, userCoords]);

  // --- Effect to Reset Page Number ---
  // This resets to page 1 whenever any filter changes, preventing
  // the user from being on a page that no longer exists.
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedType, zipcode, radius, userCoords]);


  const handleToggleSave = (id: string, saved: boolean) => {
    if (saved) {
      setSavedIds(prev => [...prev, id]);
    } else {
      setSavedIds(prev => prev.filter(savedId => savedId !== id));
    }
  };

  const handleDelete = (id: string) => {
    // Optimistically update the UI by removing the deleted card from the list
    setOpportunities(prev => prev.filter(op => op.id !== id));
  };
  
  const handleUseMyLocation = (coords: { lat: number, lon: number }) => {
    setZipcode(''); // Clear zipcode to prioritize coordinates
    setUserCoords(coords);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };

  return (
    <div className="main-container">
      <h1 className="title">Volunteer Opportunities</h1>

      <div className="controls-container">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Filter selectedType={selectedType} setSelectedType={setSelectedType} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
        <LocationFilter 
          onZipcodeChange={setZipcode}
          onRadiusChange={setRadius}
          onUseMyLocation={handleUseMyLocation}
        />
      </div>

      {isLoading && <div className="status-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}

      {!isLoading && !error && (
        <>
          <OpportunityList 
            opportunities={opportunities} 
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onDelete={handleDelete}
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