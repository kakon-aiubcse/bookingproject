import React from 'react';
import Link from 'next/link';
import Header from './component/header'


const HomePage = () => {
  return (<div>
     <Header/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-lg shadow-2xl border border-gray-300">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <Link href="/bookings"              className="block w-full px-4 py-2 text-center text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-200 text-lg font-semibold"
          >
              Create a Booking
            
          </Link>
          <Link href="/showbookings" className="block w-full px-4 py-2 text-center text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 transition duration-200 text-lg font-semibold">
            
              Show Bookings
            
          </Link>
        </div>
      </div>
    </div></div>
  );
};

export default HomePage;
