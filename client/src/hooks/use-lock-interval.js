import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { LOCK_INTERVALS, AUTO_LOCK_TIMEOUTS } from "@/slices/userSlice";

// This hook helps manage locking based on the user's selected interval and app-wide auto-lock
export function useLockInterval(initialLockState = true) {
  const [isLocked, setIsLocked] = useState(initialLockState);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const { lockInterval, autoLock, lockTimeout } = useSelector((state) => state.user);
  const { masterPasswordHash } = useSelector((state) => state.notes);
  
  // If no master password is set, we don't need locking features
  const hasPasswordSet = masterPasswordHash && masterPasswordHash.length > 0;
  
  // Track user activity for both note-specific timeout and app-wide auto-lock
  useEffect(() => {
    // Only track activity if a master password is set
    if (!hasPasswordSet) return;
    
    // Check if we need to track activity for any timeout-based locking
    const needsActivityTracking = 
      lockInterval === LOCK_INTERVALS.TIMEOUT_15 || 
      (autoLock && lockTimeout > 0);
    
    if (!needsActivityTracking) return;
    
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
  }, [lockInterval, autoLock, lockTimeout, hasPasswordSet]);
  
  // Check for timeout-based locking
  useEffect(() => {
    // If no password is set, don't apply locking
    if (!hasPasswordSet) return;
    
    // If already locked, no need to check timeout
    if (isLocked) return;
    
    // Check if we need any timeout-based locking
    const shouldCheckNotesTimeout = lockInterval === LOCK_INTERVALS.TIMEOUT_15;
    const shouldCheckAutoLock = autoLock && lockTimeout > 0;
    
    if (!shouldCheckNotesTimeout && !shouldCheckAutoLock) return;
    
    const checkTimeout = () => {
      const now = Date.now();
      const idleTime = now - lastInteraction;
      
      // Check notes-specific timeout (15 min)
      if (shouldCheckNotesTimeout) {
        const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
        if (idleTime >= fifteenMinutes) {
          setIsLocked(true);
          return; // Lock activated, no need to check app-wide auto-lock
        }
      }
      
      // Check app-wide auto-lock timeout
      if (shouldCheckAutoLock) {
        const timeoutMilliseconds = lockTimeout * 60 * 1000; // Convert minutes to milliseconds
        if (idleTime >= timeoutMilliseconds) {
          setIsLocked(true);
        }
      }
    };
    
    // Check every minute
    const interval = setInterval(checkTimeout, 60 * 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [lastInteraction, isLocked, lockInterval, autoLock, lockTimeout, hasPasswordSet]);
  
  // Handle session-end locking
  // This doesn't actually work properly in a single-page app
  // But it's a placeholder for the concept
  useEffect(() => {
    // Skip if no password is set
    if (!hasPasswordSet) return;
    
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
  }, [lockInterval, hasPasswordSet]);
  
  // Check if we should always lock (EVERY_USE setting)
  useEffect(() => {
    // Skip if no password is set
    if (!hasPasswordSet) return;
    
    if (lockInterval === LOCK_INTERVALS.EVERY_USE) {
      setIsLocked(true);
    }
  }, [lockInterval, hasPasswordSet]);
  
  // Force initial lock state for EVERY_USE setting
  useEffect(() => {
    // Skip if no password is set
    if (!hasPasswordSet) return;
    
    if (lockInterval === LOCK_INTERVALS.EVERY_USE && !isLocked) {
      setIsLocked(true);
    }
  }, [hasPasswordSet]);
  
  // Provide an unlock function to clear the lock state
  const unlock = () => {
    setIsLocked(false);
    setLastInteraction(Date.now());
  };
  
  // If no password is set, never lock (override internal state)
  const effectiveIsLocked = hasPasswordSet ? isLocked : false;
  
  return { isLocked: effectiveIsLocked, unlock };
}