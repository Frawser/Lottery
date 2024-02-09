import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../Styling/Background.css";

const Navbar = () => {
  const [navbarVisible, setNavbarVisible] = useState(false);

  const toggleNavbar = () => {
    setNavbarVisible((prevState) => !prevState);
  };

  return (
    <div
      className={`lottery-background ${navbarVisible ? "navbar-visible" : ""}`}
    >
      <button
        className="navbar-toggle rounded-pill btn honk-font"
        onClick={toggleNavbar}
      >
        X
      </button>
      {navbarVisible && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link to="/" className="navbar-brand">
              Home
            </Link>
            <Link to="lottery" className="nav-item nav-link">
              Lottery
            </Link>
          </div>
        </nav>
      )}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
