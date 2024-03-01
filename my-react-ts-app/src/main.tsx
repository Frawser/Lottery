import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";
import "./Styling/Background.css";
import "./Styling/Bouncing.css";
import "./Styling/Fonts.css";
import "./Styling/Vinst.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
