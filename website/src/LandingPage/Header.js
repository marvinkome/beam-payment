import React from "react";
import Logo from "../assets/logo.svg";

export function Header() {
  return (
    <div className="nav">
      <img alt="Beam logo" src={Logo}></img>

      <a href="https://www.notion.so/About-0b48a0611c3f486a9e0130fdd3b7d459">
        About 👋
      </a>
    </div>
  );
}
