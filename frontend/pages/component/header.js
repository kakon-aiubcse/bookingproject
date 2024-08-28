import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-blue-800 text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo or Title */}
        <div
          className="text-2xl font-bold cursor-pointer mb-2 sm:mb-0"
          aria-label="Go to home page"
        >
          <Link href="/homepage">
            <span className="text-2xl font-bold">Bookie</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6 mb-2 sm:mb-0">
        <Link href="/homepage">
            <span className="hover:text-gray-300" aria-label="Bookings page">
             homepage
            </span>
          </Link>
          <Link href="/bookie">
            <span className="hover:text-gray-300" aria-label="Bookings page">
              Bookings
            </span>
          </Link>
          <Link href="/invoice">
            <span className="hover:text-gray-300" aria-label="Invoices page">
              Invoices
            </span>
          </Link>
          
        </nav>

        {/* User Profile or Logout */}
        <div className="flex items-center space-x-4">
          <Link href="/profile">
            <span
              className="bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              aria-label="Go to profile page"
            >
              Profile
            </span>
          </Link>
          <Link href="/logout">
            <span
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500 transition duration-300"
              aria-label="Logout"
            >
              Logout
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
