import React, { useState, useEffect } from 'react';
import Header from './component/header'
import { auth, db } from '../lib/firebase'; 
import { collection, addDoc, Timestamp, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

const InvoiceForm = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        invoiceNumber: '',
        bookingId: '',
        dateIssued: '',
        dueDate: '',
        status: 'Pending',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bookings, setBookings] = useState([]);
    const [netAmount, setNetAmount] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/login'); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsQuery = query(collection(db, 'bookings'));
                const querySnapshot = await getDocs(bookingsQuery);
                const bookingsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBookings(bookingsList);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            }
        };

        fetchBookings();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'bookingId') {
            const selectedBooking = bookings.find(booking => booking.id === value);
            if (selectedBooking) {
                setNetAmount(selectedBooking.netAmount || 0);
                setPaidAmount(selectedBooking.paidAmount || 0);
                setDueAmount(parseFloat(selectedBooking.netAmount || 0) - parseFloat(selectedBooking.paidAmount || 0));
            } else {
                setNetAmount(0);
                setPaidAmount(0);
                setDueAmount(0);
            }
        } else if (name === 'paidAmount') {
            const newPaidAmount = parseFloat(value) || 0;
            setPaidAmount(newPaidAmount);
            setDueAmount(netAmount - newPaidAmount);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Basic form validation
        if (!formData.invoiceNumber || !formData.bookingId || !formData.dateIssued || !formData.dueDate) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            // Create invoice data object including all form fields
            const invoiceData = {
                invoiceNumber: formData.invoiceNumber,
                bookingId: formData.bookingId,
                dateIssued: Timestamp.fromDate(new Date(formData.dateIssued)),
                dueDate: Timestamp.fromDate(new Date(formData.dueDate)),
                status: formData.status,
                createdAt: Timestamp.now(),
                netAmount,
                paidAmount,
                dueAmount
            };

            // Add invoice data to Firestore
            await addDoc(collection(db, 'invoices'), invoiceData);

            // Update the booking in the bookings table
            const bookingRef = doc(db, 'bookings', formData.bookingId);
            await updateDoc(bookingRef, {
                netAmount: netAmount, // Ensure netAmount is updated if necessary
                paidAmount: paidAmount
            });

            setSuccessMessage('Invoice created and booking updated successfully!');
            setFormData({
                invoiceNumber: '',
                bookingId: '',
                dateIssued: '',
                dueDate: '',
                status: 'Pending',
            });
            setNetAmount(0);
            setPaidAmount(0);
            setDueAmount(0);
        } catch (err) {
            console.error('Error creating invoice or updating booking:', err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
      <div>
        <Header/>
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
      <div className="flex flex-grow items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">Create New Invoice</h1>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg mb-4 text-center">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {/* Invoice Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Invoice Number */}
            <div>
              <label htmlFor="invoiceNumber" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="invoiceNumber"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter invoice number"
                required
              />
            </div>

            {/* Booking ID */}
            <div>
              <label htmlFor="bookingId" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Booking ID <span className="text-red-500">*</span>
              </label>
              <select
                id="bookingId"
                name="bookingId"
                value={formData.bookingId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              >
                <option value="">Select Booking</option>
                {bookings.map((booking) => (
                  <option key={booking.id} value={booking.id}>
                    {booking.name || 'No Name'}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Issued */}
            <div>
              <label htmlFor="dateIssued" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Date Issued <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dateIssued"
                name="dateIssued"
                value={formData.dateIssued}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Net Amount */}
            <div>
              <label htmlFor="netAmount" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Net Amount ($)
              </label>
              <input
                type="number"
                id="netAmount"
                name="netAmount"
                value={netAmount}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-sm sm:text-base"
              />
            </div>

            {/* Paid Amount */}
            <div>
              <label htmlFor="paidAmount" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Paid Amount ($)
              </label>
              <input
                type="number"
                id="paidAmount"
                name="paidAmount"
                value={paidAmount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base"
              />
            </div>

            {/* Due Amount */}
            <div>
              <label htmlFor="dueAmount" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Due Amount ($)
              </label>
              <input
                type="number"
                id="dueAmount"
                name="dueAmount"
                value={dueAmount}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100 text-sm sm:text-base"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white rounded-lg py-2 font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
              >
                Submit
              </button>
             
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full bg-red-500 text-white rounded-lg py-2 font-semibold hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm sm:text-base"
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div></div>
    );
};

export default InvoiceForm;
