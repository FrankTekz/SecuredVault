import { createSlice } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const initialState = {
  isUnlocked: false, // Global unlock status
  hasPasswordSet: false,
  masterPasswordHash: { hash: '', salt: '' },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMasterPassword: (state, action) => {
      const salt = CryptoJS.lib.WordArray.random(16).toString();
      const hash = CryptoJS.SHA256(salt + action.payload).toString();
      state.masterPasswordHash = { hash, salt };
      state.hasPasswordSet = true;
      state.isUnlocked = true; // Auto-unlock after setting password
    },
    unlockApp: (state, action) => {
      const { hash, salt } = state.masterPasswordHash;
      const inputHash = CryptoJS.SHA256(salt + action.payload).toString();
      if (inputHash === hash) {
        state.isUnlocked = true;
      } else {
        console.error('Invalid master password attempt');
      }
    },
    lockApp: (state) => {
      state.isUnlocked = false;
    },
  },
});

export const { setMasterPassword, unlockApp, lockApp } = authSlice.actions;
export default authSlice.reducer;
