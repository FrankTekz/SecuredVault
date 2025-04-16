import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Clear local storage for testing purposes
// Comment this out in production
if (localStorage.getItem('encryptedNotes')) {
  // Check if the entry doesn't have hasPasswordSet flag (which means it's using the old format)
  const savedNotes = JSON.parse(localStorage.getItem('encryptedNotes') || '{}');
  if (savedNotes && !('hasPasswordSet' in savedNotes)) {
    console.log('Clearing old localStorage format that lacks hasPasswordSet flag');
    localStorage.removeItem('encryptedNotes');
  }
}

createRoot(document.getElementById("root")!).render(<App />);
