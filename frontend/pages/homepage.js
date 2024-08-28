import React from 'react';
import Link from 'next/link';
import Header from './component/header'


const HomePage = () => {
  return (<div>
     <Header/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-lg shadow-2xl border border-gray-300">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <Link href="/bookie"              className="block w-full px-4 py-2 text-center text-white bg-black rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition duration-200 text-lg font-semibold"
          >
              Bookings
            
          </Link>
          <Link href="/invoice" className="block w-full px-4 py-2 text-center text-white bg-black rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 transition duration-200 text-lg font-semibold">
            
              Invoices
            
          </Link>
        </div>
      </div>
    </div></div>
  );
};

export default HomePage;
