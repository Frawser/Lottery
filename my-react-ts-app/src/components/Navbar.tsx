import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className='container-fluid'>
          <Link to="/" className="navbar-brand">Home</Link>
          <Link to="lottery" className="nav-item nav-link">Lottery</Link>
        </div>
      </nav>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
