import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import styles from './Header.module.css';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/creators">Creators</Link> {/* <-- ADD THIS LINK */}
        
        {isAuthenticated && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/saved-opportunities">Saved</Link>
          </>
        )}
        
        {isAuthenticated && user?.role === 'organizer' && (
             <Link to="/create-opportunity">Create Event</Link>
        )}

        {isAuthenticated ? (
          <>
            <span>Welcome, {user?.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;