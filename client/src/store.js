import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import credentialsReducer from './slices/credentialsSlice';
import notesReducer from './slices/notesSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    credentials: credentialsReducer,
    notes: notesReducer,
    user: userReducer,
    search: searchReducer,
  },
});

export default store;
