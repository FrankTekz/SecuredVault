import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => {
  try {
    const savedCredentials = localStorage.getItem('credentials');
    return savedCredentials ? JSON.parse(savedCredentials) : { items: [] };
  } catch (error) {
    console.error('Failed to load credentials from localStorage:', error);
    return { items: [] };
  }
};

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState: getInitialState(),
  reducers: {
    addCredential: (state, action) => {
      state.items.push({
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      });
      
      // Save to localStorage
      localStorage.setItem('credentials', JSON.stringify(state));
    },
    updateCredential: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        // Save to localStorage
        localStorage.setItem('credentials', JSON.stringify(state));
      }
    },
    deleteCredential: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Save to localStorage
      localStorage.setItem('credentials', JSON.stringify(state));
    },
    clearCredentials: (state) => {
      state.items = [];
      
      // Clear from localStorage
      localStorage.removeItem('credentials');
    },
  },
});

export const { 
  addCredential, 
  updateCredential, 
  deleteCredential, 
  clearCredentials
} = credentialsSlice.actions;

export default credentialsSlice.reducer;
