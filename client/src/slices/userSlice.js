import { createSlice } from '@reduxjs/toolkit';

// Lock interval constants
export const LOCK_INTERVALS = {
  SESSION_END: 'session_end', // Lock after session end
  EVERY_USE: 'every_use',     // Lock on every use
  TIMEOUT_15: 'timeout_15'    // Lock after 15 minutes
};

// Auto-lock timeout constants (in minutes)
export const AUTO_LOCK_TIMEOUTS = {
  TIMEOUT_5: 5,
  TIMEOUT_15: 15,
  TIMEOUT_30: 30,
  TIMEOUT_60: 60
};

const getInitialState = () => {
  try {
    const userSettings = localStorage.getItem('userSettings');
    const savedSettings = userSettings ? JSON.parse(userSettings) : {};
    
    // Initialize with saved settings or defaults
    return {
      // darkMode: savedSettings.darkMode !== undefined ? savedSettings.darkMode : true,
      darkMode: true, // Default to dark mode
      autoLock: savedSettings.autoLock !== undefined ? savedSettings.autoLock : false,
      lockTimeout: savedSettings.lockTimeout || AUTO_LOCK_TIMEOUTS.TIMEOUT_30, // minutes
      lockInterval: savedSettings.lockInterval || LOCK_INTERVALS.SESSION_END, // default to every use
    };
  } catch (error) {
    console.error('Failed to load user settings from localStorage:', error);
    return {
      darkMode: true,
      autoLock: true,
      lockTimeout: AUTO_LOCK_TIMEOUTS.TIMEOUT_5,
      lockInterval: LOCK_INTERVALS.EVERY_USE,
    };
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    
    toggleAutoLock: (state) => {
      state.autoLock = !state.autoLock;
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    
    setLockTimeout: (state, action) => {
      state.lockTimeout = action.payload;
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    
    setLockInterval: (state, action) => {
      state.lockInterval = action.payload;
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
    
    clearSettings: (state) => {
      state.darkMode = true;
      state.autoLock = true;
      state.lockTimeout = AUTO_LOCK_TIMEOUTS.TIMEOUT_5;
      state.lockInterval = LOCK_INTERVALS.EVERY_USE;
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
  },
});

// Note: Initial dark mode setup is now handled by the App component using useEffect

export const { 
  toggleDarkMode, 
  toggleAutoLock, 
  setLockTimeout,
  setLockInterval,
  clearSettings
} = userSlice.actions;

export default userSlice.reducer;
