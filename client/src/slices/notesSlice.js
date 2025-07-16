import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const getInitialState = () => {
  try {
    console.log("Initializing notes state from localStorage");
    const savedNotes = localStorage.getItem('encryptedNotes');

    const defaultState = {
      items: []
    };

    if (!savedNotes) {
      console.log("No saved notes found in localStorage, using default state");
      return defaultState;
    }

    const parsedState = JSON.parse(savedNotes);

    const masterPasswordExists = !!(
      parsedState.masterPasswordHash &&
      parsedState.masterPasswordHash.hash &&
      parsedState.masterPasswordHash.hash.length > 0 &&
      parsedState.masterPasswordHash.salt &&
      parsedState.masterPasswordHash.salt.length > 0
    );

    console.log("Loaded state from localStorage:", {
      hasPasswordInState: 'hasPasswordSet' in parsedState,
      masterPasswordExists
    });

    parsedState.hasPasswordSet = masterPasswordExists;

    if (!parsedState.hasPasswordSet) {
      console.log("No master password set, ensuring unlocked state");
      parsedState.isLocked = false;
    }

    return parsedState;
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error);
    return {
      items: [],
      masterPasswordHash: {
        hash: '',
        salt: ''
      },
      isLocked: false,
      hasPasswordSet: false
    };
  }
};

const notesSlice = createSlice({
  name: 'notes',
  initialState: getInitialState(),
  reducers: {
    setMasterPassword: (state, action) => {
      const salt = CryptoJS.lib.WordArray.random(16).toString();
      const hash = CryptoJS.SHA256(salt + action.payload).toString();
      const passwordObject = { hash, salt };

      state.masterPasswordHash = passwordObject;
      state.hasPasswordSet = true;
      state.isLocked = false;

      localStorage.setItem('encryptedNotes', JSON.stringify({
        items: state.items,
        masterPasswordHash: passwordObject,
        hasPasswordSet: true,
        isLocked: false
      }));
    },

    unlockNotes: (state, action) => {
      const { hash, salt } = state.masterPasswordHash;
      const inputHash = CryptoJS.SHA256(salt + action.payload).toString();

      console.log("🔐 Unlock Attempt");
      console.log("Stored Hash:", hash);
      console.log("Stored Salt:", salt);
      console.log("Input Hash:", inputHash);

      if (inputHash === hash) {
        state.isLocked = false;

        localStorage.setItem('encryptedNotes', JSON.stringify({
          ...state,
          isLocked: false
        }));

        return state;
      }

      return state;
    },

    lockNotes: (state) => {
      if (state.hasPasswordSet) {
        state.isLocked = true;

        localStorage.setItem('encryptedNotes', JSON.stringify({
          ...state,
          isLocked: true
        }));
      }
    },

    addNote: (state, action) => {
      const { title, content, masterPassword } = action.payload;

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

      localStorage.setItem('encryptedNotes', JSON.stringify(state));
    },

    updateNote: (state, action) => {
      const { id, title, content, masterPassword } = action.payload;
      const index = state.items.findIndex(item => item.id === id);

      if (index !== -1) {
        const encryptedContent = content
          ? CryptoJS.AES.encrypt(content, masterPassword).toString()
          : state.items[index].content;

        state.items[index] = {
          ...state.items[index],
          title: title || state.items[index].title,
          content: encryptedContent,
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem('encryptedNotes', JSON.stringify(state));
      }
    },

    deleteNote: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('encryptedNotes', JSON.stringify(state));
    },

    clearNotes: (state) => {
      state.items = [];
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
