import React from "react";
import Link from "next/link";

const Header2 = ({ isReadOnly }) => {
  return (
    <header className="border-b-2 border-white bg-gradient-to-r from-rose-500 to-orange-600 text-black font-semibold py-4 px-4 sm:py-6 sm:px-6">
      {isReadOnly ? (
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 text-xl sm:text-2xl cursor-pointer">
            <Link href="/resetpass">
              <div className="flex items-center">
                <img
                  src="/bookinglogo.svg"
                  alt="bookinglogo"
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
                <span className="ml-2 text-2xl font-bold">
                  Bookie
                  <span className="font-extrabold text-amber-500">.</span>
                </span>
              </div>
            </Link>
          </div>

          <nav className="flex flex-grow justify-center  font-semibold space-x-10">
            <Link href="/resetpass">
              <span className="hover:text-gray-300 hover:border-b border-slate-200 transition duration-200">
                Homepage
              </span>
            </Link>
            <Link href="/resetpass">
              <span className="hover:text-gray-300 hover:border-b border-slate-200 transition duration-200">
                Bookings
              </span>
            </Link>
            <Link href="/resetpass">
              <span className="hover:text-gray-300 hover:border-b border-slate-200 transition duration-200">
                Invoices
              </span>
            </Link>

            <Link href="/resetpass">
              <span className="hover:text-gray-300  hover:border-b border-slate-200 transition duration-200">
                Contact
              </span>
            </Link>
          </nav>
        </div>
      ) : (
        <>
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2 text-xl sm:text-2xl cursor-pointer">
              <Link href="/">
                <div className="flex items-center">
                  <img
                    src="/bookinglogo.svg"
                    alt="bookinglogo"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  />
                  <span className="ml-2 text-2xl font-bold">
                    Bookie
                    <span className="font-extrabold text-rose-600">.</span>
                  </span>
                </div>
              </Link>
            </div>

            <nav className="flex flex-grow justify-center  font-semibold space-x-10">
              <Link href="/Views/homepage">
                <span className="hover:text-gray-300 hover:border-b border-slate-200 transition duration-200">
                  Homepage
                </span>
              </Link>
              <Link href="/bookie">
                <span className="hover:text-gray-300 hover:border-b border-slate-200 transition duration-200">
                  Bookings
                </span>
              </Link>
              <Link href="/invoice">
                <span className="hover:text-gray-300 hover:border-b border-slate-200 transition duration-200">
                  Invoices
                </span>
              </Link>

              <Link href="/Views/contact">
                <span className="hover:text-gray-300  hover:border-b border-slate-200 transition duration-200">
                  Contact
                </span>
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header2;
