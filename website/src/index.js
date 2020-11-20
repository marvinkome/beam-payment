import React from "react";
import ReactDOM from "react-dom";
import ReactGA from "react-ga";
import LandingPage from "./LandingPage";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

ReactGA.initialize("UA-183688411-1", {
  debug: process.env.NODE_ENV === "development",
});

ReactDOM.render(
  <React.StrictMode>
    <LandingPage />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
