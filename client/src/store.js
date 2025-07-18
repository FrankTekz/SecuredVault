import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "./slices/authSlice";
import credentialsReducer from "./slices/credentialsSlice";
import notesReducer from "./slices/notesSlice";
import userReducer from "./slices/userSlice";
import searchReducer from "./slices/searchSlice";

// 🔥 Transform to exclude isUnlocked from persistence
const authTransform = createTransform(
  // Before saving to localStorage
  (inboundState) => ({
    ...inboundState,
    isUnlocked: false, // Never persist isUnlocked
  }),
  // When loading from localStorage
  (outboundState) => outboundState,
  { whitelist: ["auth"] }
);

// Configure which slices to persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "credentials", "notes"], // Persist these slices only
  transforms: [authTransform], // 🆕 Apply authTransform
};

const rootReducer = combineReducers({
  auth: authReducer,
  credentials: credentialsReducer,
  notes: notesReducer,
  user: userReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);
