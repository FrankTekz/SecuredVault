import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';



const getInitialState = () => {
  try {
    const savedCredentials = localStorage.getItem('encryptedCredentials');
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
      const { title, username, password, url, notes, masterPassword } = action.payload;

      // Generate unique salts for each field
      const usernameSalt = CryptoJS.lib.WordArray.random(16).toString();
      const passwordSalt = CryptoJS.lib.WordArray.random(16).toString();
      const urlSalt = url ? CryptoJS.lib.WordArray.random(16).toString() : '';
      const notesSalt = notes ? CryptoJS.lib.WordArray.random(16).toString() : '';

      // Encrypt sensitive fields
      const encryptedUsername = CryptoJS.AES.encrypt(username, masterPassword + usernameSalt).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(password, masterPassword + passwordSalt).toString();
      const encryptedUrl = url ? CryptoJS.AES.encrypt(url, masterPassword + urlSalt).toString() : '';
      const encryptedNotes = notes ? CryptoJS.AES.encrypt(notes, masterPassword + notesSalt).toString() : '';

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

        // Encrypt updated fields
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
    updateAllCredentials: (state, action) => {
  console.log("🔄 Updating all credentials in Redux:", action.payload);

  state.items = action.payload.credentials;

  // Save updated credentials to localStorage
  localStorage.setItem(
    "encryptedCredentials",
    JSON.stringify({ ...state, items: action.payload })
  );
},

  },
});

// Helper function to decrypt a field
export const decryptField = (encryptedContent, masterPassword, salt) => {
  try {
    if (!encryptedContent) return '';
    const bytes = CryptoJS.AES.decrypt(encryptedContent, masterPassword + salt);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Failed to decrypt field:', error);
    return '[Decryption failed]';
  }
};

export const { 
  addCredential, 
  updateCredential, 
  deleteCredential, 
  clearCredentials,
  updateAllCredentials
} = credentialsSlice.actions;

export default credentialsSlice.reducer;
