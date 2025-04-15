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
      
      // Update theme.json appearance value through meta theme-color
      try {
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute('content', state.darkMode ? '#121212' : '#ffffff');
        }
        
        // Apply dark mode class to document for tailwind dark mode
        if (state.darkMode) {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (err) {
        console.error('Error applying dark mode:', err);
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
try {
  const isDarkMode = getInitialState().darkMode;
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDarkMode ? '#121212' : '#ffffff');
  }
  
  // Apply dark mode class to document for tailwind dark mode
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
} catch (err) {
  console.error('Error applying initial dark mode:', err);
}

export const { 
  toggleDarkMode, 
  toggleAutoLock, 
  toggleClearClipboard, 
  setLockTimeout,
  clearSettings
} = userSlice.actions;

export default userSlice.reducer;
