import React from 'react';
import styles from './Filter.module.css';

interface FilterProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

const Filter: React.FC<FilterProps> = ({ selectedType, setSelectedType }) => {
  return (
    <select
      className={styles.filterDropdown}
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
    >
      <option value="">All Types</option>
      <option value="environment">Environment</option>
      <option value="education">Education</option>
      <option value="animal care">Animal Care</option>
    </select>
  );
};

export default Filter;
