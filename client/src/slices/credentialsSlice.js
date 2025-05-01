import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const getInitialState = () => {
  try {
    const savedCredentials = localStorage.getItem('encryptedCredentials');
    const defaultState = {
      items: [],
      masterPasswordHash: {
        hash: '',
        salt: ''
      },
      isLocked: true,
      hasPasswordSet: false
    };

    if (!savedCredentials) {
      return defaultState;
    }

    const parsedState = JSON.parse(savedCredentials);
    const masterPasswordExists = !!(
      parsedState.masterPasswordHash &&
      parsedState.masterPasswordHash.hash &&
      parsedState.masterPasswordHash.hash.length > 0 &&
      parsedState.masterPasswordHash.salt &&
      parsedState.masterPasswordHash.salt.length > 0
    );

    parsedState.hasPasswordSet = masterPasswordExists;
    if (!parsedState.hasPasswordSet) {
      parsedState.isLocked = true;
    }

    return parsedState;
  } catch (error) {
    console.error('Failed to load credentials from localStorage:', error);
    return {
      items: [],
      masterPasswordHash: {
        hash: '',
        salt: ''
      },
      isLocked: true,
      hasPasswordSet: false
    };
  }
};

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState: getInitialState(),
  reducers: {
    setMasterPassword: (state, action) => {
      const salt = CryptoJS.lib.WordArray.random(16).toString();
      const hash = CryptoJS.SHA256(salt + action.payload).toString();
      const passwordObject = { hash, salt };

      state.masterPasswordHash = passwordObject;
      state.hasPasswordSet = true;
      state.isLocked = false;

      localStorage.setItem('encryptedCredentials', JSON.stringify({
        items: state.items,
        masterPasswordHash: passwordObject,
        hasPasswordSet: true,
        isLocked: false
      }));
    },

    unlockCredentials: (state, action) => {
      const { hash, salt } = state.masterPasswordHash;
      const inputHash = CryptoJS.SHA256(salt + action.payload).toString();

      if (inputHash === hash) {
        state.isLocked = false;
        localStorage.setItem('encryptedCredentials', JSON.stringify({
          ...state,
          isLocked: false
        }));
      }
    },

    lockCredentials: (state) => {
      if (state.hasPasswordSet) {
        state.isLocked = true;
        localStorage.setItem('encryptedCredentials', JSON.stringify({
          ...state,
          isLocked: true
        }));
      }
    },

    addCredential: (state, action) => {
      const { title, username, password, url, notes, masterPassword } = action.payload;

      console.log('Adding new credential with master password:', masterPassword ? '****' : 'none');
      console.log('Original values:', {
        title,
        username: username ? '****' : 'none',
        password: password ? '****' : 'none',
        url: url ? '****' : 'none',
        notes: notes ? '****' : 'none'
      });

      // Generate unique salts for each field
      const usernameSalt = CryptoJS.lib.WordArray.random(16).toString();
      const passwordSalt = CryptoJS.lib.WordArray.random(16).toString();
      const urlSalt = url ? CryptoJS.lib.WordArray.random(16).toString() : '';
      const notesSalt = notes ? CryptoJS.lib.WordArray.random(16).toString() : '';

      console.log('Generated salts:', {
        usernameSalt,
        passwordSalt,
        urlSalt,
        notesSalt
      });

      // Encrypt sensitive fields with their unique salts
      const encryptedUsername = CryptoJS.AES.encrypt(username, masterPassword + usernameSalt).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, masterPassword + passwordSalt).toString();
      const encryptedUrl = url ? CryptoJS.AES.encrypt(url, masterPassword + urlSalt).toString() : '';
      const encryptedNotes = notes ? CryptoJS.AES.encrypt(notes, masterPassword + notesSalt).toString() : '';

      console.log('Encrypted values:', {
        username: encryptedUsername,
        password: encryptedPassword,
        url: encryptedUrl,
        notes: encryptedNotes
      });

      state.items.push({
        id: Date.now().toString(),
        title,
        username: encryptedUsername,
        usernameSalt,
        password: encryptedPassword,
        passwordSalt,
        url: encryptedUrl,
        urlSalt,
        notes: encryptedNotes,
        notesSalt,
        createdAt: new Date().toISOString(),
      });
      
      localStorage.setItem('encryptedCredentials', JSON.stringify(state));
    },

    updateCredential: (state, action) => {
      const { id, title, username, password, url, notes, masterPassword } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      
      if (index !== -1) {
        // Generate new salts for updated fields
        const usernameSalt = username ? CryptoJS.lib.WordArray.random(16).toString() : state.items[index].usernameSalt;
        const passwordSalt = password ? CryptoJS.lib.WordArray.random(16).toString() : state.items[index].passwordSalt;
        const urlSalt = url ? CryptoJS.lib.WordArray.random(16).toString() : state.items[index].urlSalt;
        const notesSalt = notes ? CryptoJS.lib.WordArray.random(16).toString() : state.items[index].notesSalt;

        // Encrypt any updated sensitive fields with their unique salts
        const encryptedUsername = username ? CryptoJS.AES.encrypt(username, masterPassword + usernameSalt).toString() : state.items[index].username;
        const encryptedPassword = password ? CryptoJS.AES.encrypt(password, masterPassword + passwordSalt).toString() : state.items[index].password;
        const encryptedUrl = url ? CryptoJS.AES.encrypt(url, masterPassword + urlSalt).toString() : state.items[index].url;
        const encryptedNotes = notes ? CryptoJS.AES.encrypt(notes, masterPassword + notesSalt).toString() : state.items[index].notes;

        state.items[index] = {
          ...state.items[index],
          title: title || state.items[index].title,
          username: encryptedUsername,
          usernameSalt,
          password: encryptedPassword,
          passwordSalt,
          url: encryptedUrl,
          urlSalt,
          notes: encryptedNotes,
          notesSalt,
          updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem('encryptedCredentials', JSON.stringify(state));
      }
    },

    deleteCredential: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('encryptedCredentials', JSON.stringify(state));
    },

    clearCredentials: (state) => {
      state.items = [];
      localStorage.removeItem('encryptedCredentials');
    },
  },
});

export const { 
  addCredential, 
  updateCredential, 
  deleteCredential, 
  clearCredentials,
  setMasterPassword,
  unlockCredentials,
  lockCredentials
} = credentialsSlice.actions;

// Helper function to decrypt a field
export const decryptField = (encryptedContent, masterPassword, salt) => {
  try {
    if (!encryptedContent) return '';
    console.log('Decrypting field with master password:', masterPassword ? '****' : 'none');
    console.log('Using salt:', salt);
    const bytes = CryptoJS.AES.decrypt(encryptedContent, masterPassword + salt);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    console.log('Decryption result:', decrypted ? '****' : 'empty');
    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt field:', error);
    return '[Decryption failed]';
  }
};

export default credentialsSlice.reducer;
