import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import MisoAdmin from "./MisoAdmin";
import ContractCenter from "./contracts/ContractCenter";
import "./styles.css";
import "./v2.css";
import "./contracts/contracts.css";

const params = new URLSearchParams(window.location.search);
const isAdminPage = params.get("admin") === "1";
const isContractPage = params.get("contracts") === "1" || window.location.pathname.startsWith("/contracts");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isContractPage ? <ContractCenter /> : isAdminPage ? <MisoAdmin /> : <App />}
  </React.StrictMode>,
);
