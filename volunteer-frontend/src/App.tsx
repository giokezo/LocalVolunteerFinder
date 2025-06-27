import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutUsPage from './pages/AboutUsPage';
import SavedOpportunitiesPage from './pages/SavedOpportunitiesPage';
import DashboardPage from './pages/DashboardPage';
// REMOVED Import for CreateOpportunityPage
// REMOVED Import for NotFoundPage
import Header from './components/card/Header';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Header />
      <Toaster 
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: '#dcfce7',
              color: '#166534',
            },
          },
          error: {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
            },
          },
        }}
      />
      
      <Routes>
        {/* These are the pages that actually exist in your project */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/saved-opportunities" element={<SavedOpportunitiesPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* REMOVED the routes for /create-opportunity and the 404 page */}
      </Routes>
    </>
  );
}

export default App;