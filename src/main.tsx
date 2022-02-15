import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Starbeam } from "@starbeam/react";

const root = ReactDOM.createRoot(document.querySelector("#root")!);

root.render(
  <Starbeam>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Starbeam>
);
