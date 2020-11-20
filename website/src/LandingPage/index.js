import React, { useEffect, useState } from "react";
import Screenshot from "../assets/screenshot.png";
import playstore from "../assets/playstore.svg";
import { Header } from "./Header";

import "./LandingPage.scss";

const headerText = [
  "Pay anyone with a phone number",
  "Withdraw money with app to your bank",
  "Free app to app payments. ₦5 SMS fee non-app users",
];

function App() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setActiveSlide(
        activeSlide === headerText.length - 1 ? 0 : activeSlide + 1
      );
    }, 1500);

    return () => clearTimeout(timeout);
  }, [activeSlide]);

  return (
    <div className="App">
      <Header />

      <div className="container">
        <div className="grid-1">
          <div className="grid-content">
            <h1 className="text fade">
              <span>{headerText[activeSlide]}</span>
            </h1>

            <div className="button-container">
              <button className="cta-btn">
                <span>DOWNLOAD ON PLAYSTORE </span>
                <span>
                  <img alt="playstore" src={playstore}></img>
                </span>
              </button>

              <div className="dot-container">
                {headerText.map((_, idx) => {
                  let className = "dot";
                  if (activeSlide === idx) {
                    className += " active";
                  }

                  return (
                    <span
                      onClick={() => setActiveSlide(idx)}
                      key={idx}
                      className={className}
                    ></span>
                  );
                })}
              </div>
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
