import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MisoAdmin from "./MisoAdmin";
import "./styles.css";
import "./v2.css";
import "./growth.css";

const isAdminPage = new URLSearchParams(window.location.search).get("admin") === "1";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isAdminPage ? <MisoAdmin /> : <App />}
  </React.StrictMode>,
);
