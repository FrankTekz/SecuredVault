import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import "./index.css";

// For debugging purposes only, to see when the app initializes
console.log("Main.jsx: Application initialized");

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
