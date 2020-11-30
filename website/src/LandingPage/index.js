import React, { useEffect } from "react";
import ReactGA from "react-ga";
import Screenshot from "../assets/screenshot.png";
import playstore from "../assets/playstore.svg";
import { Header } from "./Header";

import "./LandingPage.scss";

function App() {
  useEffect(() => {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div className="App">
      <Header />

      <div className="container">
        <div className="grid-1">
          <div className="grid-content">
            <div className="header-text">
              <h1 className="text fade">
                <span>Pay anyone without cash.</span>
                <span>Never go to an ATM again.</span>
              </h1>

              <p>Free transfers in seconds to any user</p>
            </div>

            <div className="button-container">
              <ReactGA.OutboundLink
                eventLabel="Playstore"
                to="https://play.google.com/store/apps/details?id=com.usebeam"
                target="_self"
                className="cta-btn"
              >
                <span>DOWNLOAD ON PLAYSTORE </span>
                <span>
                  <img alt="playstore" src={playstore}></img>
                </span>
              </ReactGA.OutboundLink>
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
