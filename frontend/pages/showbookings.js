import React, { useState, useEffect } from 'react';
import Header from './component/header'
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase'; 
import { Router, useRouter } from 'next/router';

const ShowBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const bookingsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Debugging line
        console.log('Fetched data:', data);
        const validDate = data.validDate instanceof Timestamp 
          ? data.validDate.toDate() 
          : new Date(data.validDate.seconds * 1000 || data.validDate); // Handles different formats

        return {
          id: doc.id,
          ...data,
          validDate
        };
      });
      setBookings(bookingsList);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('An error occurred while fetching the bookings.');
    }
  };

  return (
    <div><Header/>
    <div className="flex flex-col min-h-screen bg-gray-100">
  <div className="container mx-auto p-4 flex-grow">
    <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-center">Booking List</h2>

    {/* Error Message */}
    {error && (
      <div className="bg-red-100 text-red-800 p-4 rounded mb-4 text-center">
        {error}
      </div>
    )}

    {/* Booking Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Name</th>
            <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Passport Number</th>
            <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Valid Date</th>
            <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Net Amount</th>
            <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Paid Amount</th>
            <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Payment Status</th>
            <th className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">Creation</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-4 text-center">No bookings found</td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{booking.name}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{booking.passportNumber}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{booking.validDate.toLocaleDateString()}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">${booking.netAmount.toFixed(2)}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">${booking.paidAmount.toFixed(2)}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{booking.paymentStatus.replace('_', ' ')}</td>
                <td className="py-2 px-2 md:px-4 border-b text-xs md:text-sm">{new Date(booking.createdAt.seconds * 1000).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="flex justify-center mt-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="w-full max-w-xs py-2 px-4 rounded-lg text-white bg-red-400 hover:bg-red-600 text-sm md:text-base"
      >
        Go Back
      </button>
    </div>
  </div>
</div>
</div>

    
  );
};

export default ShowBookings;
