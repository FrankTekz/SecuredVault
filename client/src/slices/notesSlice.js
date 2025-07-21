import { createSlice } from "@reduxjs/toolkit";
import CryptoJS from "crypto-js";

const initialState = {
  items: [],
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
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
    },

    updateNote: (state, action) => {
      const { id, title, content, masterPassword } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);

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
      }
    },

    deleteNote: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearNotes: (state) => {
      state.items = [];
    },
    updateAllNotes: (state, action) => {
  const { oldPassword, newPassword } = action.payload;

  state.items = state.items.map((note) => {
    // Decrypt content with old password
    const decryptedContent = CryptoJS.AES.decrypt(
      note.content,
      oldPassword
    ).toString(CryptoJS.enc.Utf8);

    // Re-encrypt with new password
    const encryptedContent = CryptoJS.AES.encrypt(
      decryptedContent,
      newPassword
    ).toString();

    return {
      ...note,
      content: encryptedContent,
    };
  });
},

  },
});

export const { addNote, updateNote, deleteNote, clearNotes, updateAllNotes } =
  notesSlice.actions;

export const decryptNote = (encryptedContent, masterPassword) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, masterPassword);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Failed to decrypt note:", error);
    return "[Decryption failed]";
  }
};

export default notesSlice.reducer;
