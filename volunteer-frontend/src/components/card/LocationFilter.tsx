import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import styles from './LocationFilter.module.css';

interface LocationFilterProps {
  onZipcodeChange: (zipcode: string) => void;
  onRadiusChange: (radius: number) => void;
  onUseMyLocation: (coords: { lat: number; lon: number }) => void;
}

const LocationFilter: React.FC<LocationFilterProps> = ({ onZipcodeChange, onRadiusChange, onUseMyLocation }) => {
  const [zip, setZip] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleUseMyLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onUseMyLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setZip(''); // Clear zip code input
        setGettingLocation(false);
      },
      (error) => {
        alert('Could not get your location. Please check your browser permissions.');
        console.error('Geolocation error:', error);
        setGettingLocation(false);
      }
    );
  };

  return (
    <div className={styles.locationFilterContainer}>
      <input
        type="text"
        placeholder="Enter Zip Code"
        value={zip}
        onChange={(e) => {
          setZip(e.target.value);
          onZipcodeChange(e.target.value);
        }}
        className={styles.zipInput}
      />
      <select 
        onChange={(e) => onRadiusChange(Number(e.target.value))}
        className={styles.radiusSelect}
      >
        <option value={10}>10 miles</option>
        <option value={25}>25 miles</option>
        <option value={50}>50 miles</option>
        <option value={100}>100 miles</option>
      </select>
      <button onClick={handleUseMyLocation} className={styles.locationButton} disabled={gettingLocation}>
        <MapPin size={16} /> {gettingLocation ? 'Finding...' : 'Use My Location'}
      </button>
    </div>
  );
};

export default LocationFilter;