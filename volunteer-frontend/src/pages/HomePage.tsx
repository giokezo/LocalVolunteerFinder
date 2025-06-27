import { useEffect, useState } from "react";
import { getOpportunities } from "../api/opportunityService";
import { getCurrentUser } from "../api/authService";
import { type VolunteerOpportunity } from "../types/VolunteerOpportunity";
import OpportunityList from "../components/card/OpportunityList";
import SearchBar from "../components/card/SearchBar";
import Filter from "../components/card/Filter";
import Pagination from "../components/card/Pagination";
import LocationFilter from "../components/card/LocationFilter";
import OpportunitySkeletonCard from "../components/card/OpportunitySkeletonCard"; // <-- Import the new skeleton component
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
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      const filters: any = { 
        keyword: searchTerm, 
        type: selectedType, 
        radius,
      };
      
      if (userCoords) {
        filters.latitude = userCoords.lat;
        filters.longitude = userCoords.lon;
      } else if (zipcode && zipcode.length >= 5) {
        filters.zipcode = zipcode;
      }

      try {
        const response = await getOpportunities(currentPage, 10, filters);
        
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
    setOpportunities(prev => prev.filter(op => op.id !== id));
  };
  
  const handleUseMyLocation = (coords: { lat: number, lon: number }) => {
    setZipcode('');
    setUserCoords(coords);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
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

      {/* --- UPDATED RENDERING LOGIC --- */}

      {/* If loading, show a grid of skeleton cards */}
      {isLoading && (
        <div className="opportunity-list">
          {/* Render 6 placeholder cards */}
          {Array.from({ length: 6 }).map((_, index) => (
            <OpportunitySkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* If there's an error (and not loading), show the error message */}
      {error && !isLoading && <div className="error-msg">{error}</div>}

      {/* If not loading and no error, show the actual opportunity list */}
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