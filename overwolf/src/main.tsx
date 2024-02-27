import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initPlausible } from "../../lib/stats";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

initPlausible("soc.th.gl-app", "https://metrics.th.gl");
