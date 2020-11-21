import React from "react";
import ReactGA from "react-ga";
import Screenshot from "../assets/screenshot.png";
import playstore from "../assets/playstore.svg";
import { Header } from "./Header";

import "./LandingPage.scss";

if (process.env.NODE_ENV !== "development") {
  ReactGA.initialize("UA-183688411-1");
}

function App() {
  return (
    <div className="App">
      <Header />

      <div className="container">
        <div className="grid-1">
          <div className="grid-content">
            <h1 className="text fade">
              <span>Pay anyone with a phone number in seconds</span>
            </h1>

            <div className="button-container">
              <a
                href="https://play.google.com/store/apps/details?id=com.usebeam"
                className="cta-btn"
              >
                <span>DOWNLOAD ON PLAYSTORE </span>
                <span>
                  <img alt="playstore" src={playstore}></img>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <img alt="Mobile screenshot of Beam" src={Screenshot}></img>
        </div>
      </div>
    </div>
  );
}

export default App;
