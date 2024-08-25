import React from 'react';
import Link from 'next/link';

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-400">
      <div className="bg-white p-6 sm:p-12 rounded-lg shadow-lg border border-gray-300 w-full max-w-md sm:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-800">
          Welcome to Our Booking App
        </h1>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/login" className="w-full sm:w-auto">
            
              <button className="w-full px-4 py-2 sm:px-6 sm:py-3 text-white bg-blue-600 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition">
                Login
              </button>
            
          </Link>
          <Link href="/signup" className="w-full sm:w-auto">
            
              <button className="w-full px-4 py-2 sm:px-6 sm:py-3 text-white bg-green-600 rounded-lg text-base sm:text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 transition">
                Sign Up
              </button>
         
          </Link>
        </div>
      </div>
    </div>
  );
}
