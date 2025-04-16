import { configureStore } from '@reduxjs/toolkit';
import credentialsReducer from './slices/credentialsSlice';
import notesReducer from './slices/notesSlice';
import userReducer from './slices/userSlice';
import searchReducer from './slices/searchSlice';

const store = configureStore({
  reducer: {
    credentials: credentialsReducer,
    notes: notesReducer,
    user: userReducer,
    search: searchReducer,
  },
});

export default store;
