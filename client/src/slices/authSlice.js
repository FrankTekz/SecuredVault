import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

const initialState = {
  isUnlocked: false, // Should never persist across refresh
  hasPasswordSet: false,
  masterPasswordHash: { hash: "", salt: "" },
};

const authSlice = createSlice({
  name: "auth",
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
      state.isUnlocked = inputHash === hash;
    },
    lockApp: (state) => {
      state.isUnlocked = false;
    },
    changeMasterPassword: (state, action) => {
      const { oldPassword, newPassword, credentials } = action.payload;

      // Validate old password
      const { hash, salt } = state.masterPasswordHash;
      const oldInputHash = CryptoJS.SHA256(salt + oldPassword).toString();
      if (oldInputHash !== hash) {
        throw new Error("Incorrect current master password");
      }

      // Generate new salt + hash for master password
      const newSalt = CryptoJS.lib.WordArray.random(16).toString();
      const newHash = CryptoJS.SHA256(newSalt + newPassword).toString();
      state.masterPasswordHash = { hash: newHash, salt: newSalt };

      // Re-encrypt credentials with the new password
      const reEncryptedCredentials = credentials.map((item) => {
        const decryptedUsername = CryptoJS.AES.decrypt(
          item.username,
          oldPassword + item.usernameSalt
        ).toString(CryptoJS.enc.Utf8);

        const decryptedPassword = CryptoJS.AES.decrypt(
          item.password,
          oldPassword + item.passwordSalt
        ).toString(CryptoJS.enc.Utf8);

        const decryptedUrl = item.url
          ? CryptoJS.AES.decrypt(item.url, oldPassword + item.urlSalt).toString(CryptoJS.enc.Utf8)
          : "";

        const decryptedNotes = item.notes
          ? CryptoJS.AES.decrypt(item.notes, oldPassword + item.notesSalt).toString(CryptoJS.enc.Utf8)
          : "";

        const usernameSalt = CryptoJS.lib.WordArray.random(16).toString();
        const passwordSalt = CryptoJS.lib.WordArray.random(16).toString();
        const urlSalt = item.url ? CryptoJS.lib.WordArray.random(16).toString() : "";
        const notesSalt = item.notes ? CryptoJS.lib.WordArray.random(16).toString() : "";

        return {
          ...item,
          username: CryptoJS.AES.encrypt(decryptedUsername, newPassword + usernameSalt).toString(),
          usernameSalt,
          password: CryptoJS.AES.encrypt(decryptedPassword, newPassword + passwordSalt).toString(),
          passwordSalt,
          url: item.url ? CryptoJS.AES.encrypt(decryptedUrl, newPassword + urlSalt).toString() : "",
          urlSalt,
          notes: item.notes ? CryptoJS.AES.encrypt(decryptedNotes, newPassword + notesSalt).toString() : "",
          notesSalt,
        };
      });
    },
    resetAuth: (state) => {
  state.isUnlocked = false;
  state.hasPasswordSet = false;
  state.masterPasswordHash = { hash: "", salt: "" };
},

  },
});

export const { setMasterPassword, unlockApp, lockApp, changeMasterPassword, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;
