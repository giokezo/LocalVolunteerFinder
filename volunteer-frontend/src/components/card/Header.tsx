import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
      <div className={styles['nav-links']}>
        <Link to="/">Home</Link>
        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>

      {isAuthenticated && (
        <div className={styles['user-section']}>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};

export default Header;
