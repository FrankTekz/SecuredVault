import { configureStore } from '@reduxjs/toolkit';
import credentialsReducer from './slices/credentialsSlice';
import notesReducer from './slices/notesSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    credentials: credentialsReducer,
    notes: notesReducer,
    user: userReducer,
  },
});

export default store;
