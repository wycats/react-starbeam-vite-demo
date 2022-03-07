/// <reference types="react/next" />
/// <reference types="react-dom/next" />

import { config } from "@starbeam/config";
import { Starbeam } from "@starbeam/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const STARBEAM_ENV = Symbol.for("starbeam.config.env");

config().set("LogLevel", "warn");

const root = createRoot(document.querySelector("#root")!);

root.render(
  <StrictMode>
    <Starbeam>
      <App />
    </Starbeam>
  </StrictMode>
);
