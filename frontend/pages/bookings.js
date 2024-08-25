import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from '../lib/firebase'; 
import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    validDate: new Date(), // Initialize with current date
    netAmount: '',
    paidAmount: '',
    paymentStatus: 'PAID_PARTIAL',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for user authentication
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // For amount fields, prevent negative values
    if ((name === 'netAmount' || name === 'paidAmount') && value < 0) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    // Basic form validation
    if (
      !formData.name.trim() ||
      !formData.passportNumber.trim() ||
      !formData.validDate ||
      !formData.netAmount ||
      !formData.paidAmount
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.paidAmount) > parseFloat(formData.netAmount)) {
      setError('Paid amount cannot exceed net amount.');
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        name: formData.name.trim(),
        passportNumber: formData.passportNumber.trim(),
        validDate: Timestamp.fromDate(new Date(formData.validDate)), // Ensure validDate is correctly converted
        netAmount: parseFloat(formData.netAmount),
        paidAmount: parseFloat(formData.paidAmount),
        paymentStatus: formData.paymentStatus,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      setSuccessMessage('Booking created successfully!');
      setFormData({
        name: '',
        passportNumber: '',
        validDate: new Date(), // Reset to current date
        netAmount: '',
        paidAmount: '',
        paymentStatus: 'PAID_PARTIAL',
      });
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('An error occurred while creating the booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 overflow-hidden">
  <div className="flex flex-grow flex-col items-center justify-center px-4 py-6 sm:py-10">
    <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900">Create New Booking</h1>

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

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Passport Number */}
        <div>
          <label htmlFor="passportNumber" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
            Passport Number<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="passportNumber"
            name="passportNumber"
            value={formData.passportNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter passport number"
            required
          />
        </div>

        {/* Valid Date */}
        <div>
          <label htmlFor="validDate" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
            Valid Date<span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={formData.validDate}
            onChange={(date) => setFormData((prevData) => ({
              ...prevData,
              validDate: date
            }))}
            dateFormat="yyyy/MM/dd"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholderText="Select a valid date"
            required
          />
        </div>

        {/* Net Amount */}
        <div>
          <label htmlFor="netAmount" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
            Net Amount ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="netAmount"
            name="netAmount"
            value={formData.netAmount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter net amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Paid Amount */}
        <div>
          <label htmlFor="paidAmount" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
            Paid Amount ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="paidAmount"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter paid amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Payment Status */}
        <div>
          <label htmlFor="paymentStatus" className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
            Payment Status<span className="text-red-500">*</span>
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            required
          >
            <option value="PAID_PARTIAL">Paid Partial</option>
            <option value="PAID_FULL">Paid Full</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col space-y-4 mt-6">
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg text-white ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Create Booking'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/showbookings')}
            className="w-full py-3 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700"
          >
            View All Bookings
          </button>

          <button
            type="button"
            onClick={() => router.push('/invoiceform')}
            className="w-full py-3 px-4 rounded-lg text-white bg-gray-600 hover:bg-gray-700"
          >
            Create Invoice Here
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-3 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  </div>
</div>



  
  );
};

export default Booking;
