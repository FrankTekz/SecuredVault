import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const getInitialState = () => {
  try {
    console.log("Initializing notes state from localStorage");
    const savedNotes = localStorage.getItem('encryptedNotes');
    
    // Default state for new users or after clearing localStorage
    const defaultState = { 
      items: [],
      masterPasswordHash: '',
      isLocked: false,  // Default to unlocked for new users with no password
      hasPasswordSet: false // Explicitly track if a password has been set
    };
    
    // If nothing in localStorage, return default state
    if (!savedNotes) {
      console.log("No saved notes found in localStorage, using default state");
      return defaultState;
    }
    
    // Parse saved state
    const parsedState = JSON.parse(savedNotes);
    console.log("Loaded state from localStorage:", { 
      hasPasswordInState: 'hasPasswordSet' in parsedState,
      masterPasswordExists: !!(parsedState.masterPasswordHash && parsedState.masterPasswordHash.length > 0)
    });
    
    // Always recalculate hasPasswordSet based on masterPasswordHash existence
    // This ensures the flag is always in sync with the actual password state
    parsedState.hasPasswordSet = !!(parsedState.masterPasswordHash && parsedState.masterPasswordHash.length > 0);
    
    // Always ensure unlocked state when no password exists
    if (!parsedState.hasPasswordSet) {
      console.log("No master password set, ensuring unlocked state");
      parsedState.isLocked = false; // No password, no lock
    }
    
    return parsedState;
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error);
    return { 
      items: [],
      masterPasswordHash: '',
      isLocked: false,  // Default to unlocked for new users
      hasPasswordSet: false // Explicitly track if a password has been set
    };
  }
};

const notesSlice = createSlice({
  name: 'notes',
  initialState: getInitialState(),
  reducers: {
    setMasterPassword: (state, action) => {
      // Store a hash of the master password
      const passwordHash = CryptoJS.SHA256(action.payload).toString();
      state.masterPasswordHash = passwordHash;
      state.hasPasswordSet = true; // Mark that a password has been set
      state.isLocked = false;
      
      // Save to localStorage (just the hash, not the actual password)
      localStorage.setItem('encryptedNotes', JSON.stringify({
        items: state.items,
        masterPasswordHash: passwordHash,
        hasPasswordSet: true,
        isLocked: false
      }));
    },
    
    unlockNotes: (state, action) => {
      const passwordHash = CryptoJS.SHA256(action.payload).toString();
      
      if (passwordHash === state.masterPasswordHash) {
        state.isLocked = false;
        
        // Update localStorage
        localStorage.setItem('encryptedNotes', JSON.stringify({
          ...state,
          isLocked: false
        }));
        
        return state;
      }
      
      // Return unchanged state if password is incorrect
      return state;
    },
    
    lockNotes: (state) => {
      // Only lock if a master password exists
      if (state.hasPasswordSet) {
        state.isLocked = true;
        
        // Update localStorage
        localStorage.setItem('encryptedNotes', JSON.stringify({
          ...state,
          isLocked: true
        }));
      }
    },
    
    addNote: (state, action) => {
      const { title, content, masterPassword } = action.payload;
      
      // Encrypt the note content
      const encryptedContent = CryptoJS.AES.encrypt(
        content,
        masterPassword
      ).toString();
      
      const newNote = {
        id: Date.now().toString(),
        title,
        content: encryptedContent,
        createdAt: new Date().toISOString(),
      };
      
      state.items.push(newNote);
      
      // Save to localStorage
      localStorage.setItem('encryptedNotes', JSON.stringify(state));
    },
    
    updateNote: (state, action) => {
      const { id, title, content, masterPassword } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        // Encrypt the updated content
        const encryptedContent = content 
          ? CryptoJS.AES.encrypt(content, masterPassword).toString()
          : state.items[index].content;
        
        state.items[index] = {
          ...state.items[index],
          title: title || state.items[index].title,
          content: encryptedContent,
          updatedAt: new Date().toISOString(),
        };
        
        // Save to localStorage
        localStorage.setItem('encryptedNotes', JSON.stringify(state));
      }
    },
    
    deleteNote: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Save to localStorage
      localStorage.setItem('encryptedNotes', JSON.stringify(state));
    },
    
    clearNotes: (state) => {
      state.items = [];
      
      // Save to localStorage
      localStorage.setItem('encryptedNotes', JSON.stringify(state));
    },
  },
});

export const { 
  setMasterPassword,
  unlockNotes,
  lockNotes,
  addNote,
  updateNote,
  deleteNote,
  clearNotes
} = notesSlice.actions;

export const decryptNote = (encryptedContent, masterPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, masterPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Failed to decrypt note:', error);
    return '[Decryption failed]';
  }
};

export default notesSlice.reducer;
