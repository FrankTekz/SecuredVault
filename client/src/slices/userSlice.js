import { createSlice } from '@reduxjs/toolkit';

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
    };
  } catch (error) {
    console.error('Failed to load user settings from localStorage:', error);
    return {
      darkMode: true,
      autoLock: true,
      clearClipboard: true,
      lockTimeout: 5,
    };
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      
      // Apply dark mode class to document
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
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
    
    clearSettings: (state) => {
      state.darkMode = true;
      state.autoLock = true;
      state.clearClipboard = true;
      state.lockTimeout = 5;
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(state));
    },
  },
});

// Apply initial dark mode setting
if (getInitialState().darkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

export const { 
  toggleDarkMode, 
  toggleAutoLock, 
  toggleClearClipboard, 
  setLockTimeout,
  clearSettings
} = userSlice.actions;

export default userSlice.reducer;
