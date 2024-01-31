import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="min-h-screen">
      <nav className="bg-gray-800 text-white p-4 flex space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="lottery" className="hover:text-gray-300">Lottery</Link>
      </nav>
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
