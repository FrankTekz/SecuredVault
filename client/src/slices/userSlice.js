import { createSlice } from '@reduxjs/toolkit';

// Lock interval constants
export const LOCK_INTERVALS = {
  SESSION_END: 'session_end', // Lock after session end
  EVERY_USE: 'every_use',     // Lock on every use
  TIMEOUT_15: 'timeout_15'    // Lock after 15 minutes
};

const getInitialState = () => {
  try {
    const userSettings = localStorage.getItem('userSettings');
    const savedSettings = userSettings ? JSON.parse(userSettings) : {};
    
    // Initialize with saved settings or defaults
    return {
      darkMode: savedSettings.darkMode !== undefined ? savedSettings.darkMode : true,
      autoLock: savedSettings.autoLock !== undefined ? savedSettings.autoLock : true,
      clearClipboard: savedSettings.clearClipboard !== undefined ? savedSettings.clearClipboard : true,
      lockTimeout: savedSettings.lockTimeout || 5, // minutes
      lockInterval: savedSettings.lockInterval || LOCK_INTERVALS.SESSION_END, // default to session end
    };
  } catch (error) {
    console.error('Failed to load user settings from localStorage:', error);
    return {
      darkMode: true,
      autoLock: true,
      clearClipboard: true,
      lockTimeout: 5,
      lockInterval: LOCK_INTERVALS.SESSION_END,
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
    
    toggleClearClipboard: (state) => {
      state.clearClipboard = !state.clearClipboard;
      
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
      state.clearClipboard = true;
      state.lockTimeout = 5;
      state.lockInterval = LOCK_INTERVALS.SESSION_END;
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
  },
});

// Note: Initial dark mode setup is now handled by the App component using useEffect

export const { 
  toggleDarkMode, 
  toggleAutoLock, 
  toggleClearClipboard, 
  setLockTimeout,
  setLockInterval,
  clearSettings
} = userSlice.actions;

export default userSlice.reducer;
