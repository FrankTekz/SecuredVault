// This component will reset the localStorage completely
// Import and use this component temporarily in App.jsx to reset the state

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const ResetLocalStorage = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("🔄 Completely resetting localStorage");
    localStorage.clear(); // Clear ALL localStorage 
    
    // Force reload the page to reinitialize Redux with fresh state
    window.location.reload();
  }, []);
  
  return null; // This component doesn't render anything
};

export default ResetLocalStorage;
