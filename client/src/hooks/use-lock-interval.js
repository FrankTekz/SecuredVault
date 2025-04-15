import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LOCK_INTERVALS } from "@/slices/userSlice";

// This hook helps manage locking based on the user's selected interval
export function useLockInterval(initialLockState = true) {
  const [isLocked, setIsLocked] = useState(initialLockState);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const { lockInterval } = useSelector((state) => state.user);
  
  // Track user activity
  useEffect(() => {
    // Only track activity if we're using the timeout option
    if (lockInterval !== LOCK_INTERVALS.TIMEOUT_15) return;
    
    const updateLastInteraction = () => {
      setLastInteraction(Date.now());
    };
    
    // Listen for user interaction events
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach(event => {
      window.addEventListener(event, updateLastInteraction);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateLastInteraction);
      });
    };
  }, [lockInterval]);
  
  // Check for timeout-based locking
  useEffect(() => {
    if (lockInterval !== LOCK_INTERVALS.TIMEOUT_15) return;
    
    // If already locked, no need to check timeout
    if (isLocked) return;
    
    const checkTimeout = () => {
      const now = Date.now();
      const idleTime = now - lastInteraction;
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
      
      if (idleTime >= fifteenMinutes) {
        setIsLocked(true);
      }
    };
    
    // Check every minute
    const interval = setInterval(checkTimeout, 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [lastInteraction, isLocked, lockInterval]);
  
  // Handle session-end locking
  // This doesn't actually work properly in a single-page app
  // But it's a placeholder for the concept
  useEffect(() => {
    if (lockInterval !== LOCK_INTERVALS.SESSION_END) return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // Page is hidden (browser tab hidden or minimized)
        // This is a simplification of "session end"
        setIsLocked(true);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lockInterval]);
  
  // Check if we should always lock (EVERY_USE setting)
  useEffect(() => {
    if (lockInterval === LOCK_INTERVALS.EVERY_USE) {
      setIsLocked(true);
    }
  }, [lockInterval]);
  
  // Provide an unlock function to clear the lock state
  const unlock = () => {
    setIsLocked(false);
    setLastInteraction(Date.now());
  };
  
  return { isLocked, unlock };
}