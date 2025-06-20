import styles from './SearchBar.module.css'; // optional if you want to style later

const SearchBar = () => {
  return (
    <div className= {styles.searchBar}>
      <input
        type="text"
        placeholder="Search by keyword..."
        className={styles.searchInput}
      />
    </div>
  );
};

export default SearchBar;
