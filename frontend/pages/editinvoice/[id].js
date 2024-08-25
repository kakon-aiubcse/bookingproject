import React, { useState, useEffect } from 'react';
import {db} from '../../lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const EditInvoice = () => {
  const router = useRouter();
  const { id } = router.query;

  const [invoice, setInvoice] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    bookingId: '',
    netAmount: '',
    paidAmount: '',
    dueAmount: '',
    dateIssued: '',
    dueDate: '',
    status: 'Pending'
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch invoice details
  useEffect(() => {
    if (!id) return;
    
    const fetchInvoice = async () => {
      try {
        const invoiceDoc = doc(db, 'invoices', id);
        const docSnapshot = await getDoc(invoiceDoc);
        if (docSnapshot.exists()) {
          const invoiceData = docSnapshot.data();
          setInvoice(invoiceData);
          setFormData({
            invoiceNumber: invoiceData.invoiceNumber || '',
            bookingId: invoiceData.bookingId || '',
            netAmount: invoiceData.netAmount || '',
            paidAmount: invoiceData.paidAmount || '',
            dueAmount: invoiceData.dueAmount || '',
            dateIssued: invoiceData.dateIssued ? invoiceData.dateIssued.toDate().toISOString().split('T')[0] : '',
            dueDate: invoiceData.dueDate ? invoiceData.dueDate.toDate().toISOString().split('T')[0] : '',
            status: invoiceData.status || 'Pending'
          });
        } else {
          setError('Invoice not found.');
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError('An error occurred while fetching the invoice. Please try again.');
      }
    };

    fetchInvoice();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const invoiceRef = doc(db, 'invoices', id);

      await updateDoc(invoiceRef, {
        ...formData,
        netAmount: parseFloat(formData.netAmount),
        paidAmount: parseFloat(formData.paidAmount),
        dueAmount: parseFloat(formData.dueAmount),
        dateIssued: new Date(formData.dateIssued),
        dueDate: new Date(formData.dueDate),
      });

      setSuccessMessage('Invoice updated successfully!');
    } catch (err) {
      console.error('Error updating invoice:', err);
      setError('An error occurred while updating the invoice. Please try again.');
    }
  };

  const handleGoBack = () => {
    router.back(); // Go back to the previous page
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-md bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Invoice</h1>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* Edit Invoice Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Invoice Number */}
        <div>
          <label htmlFor="invoiceNumber" className="block text-gray-700 font-medium mb-1">
            Invoice Number<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="invoiceNumber"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter invoice number"
            required
          />
        </div>

        {/* Booking ID */}
        <div>
          <label htmlFor="bookingId" className="block text-gray-700 font-medium mb-1">
            Booking ID<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="bookingId"
            name="bookingId"
            value={formData.bookingId}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter booking ID"
            required
          />
        </div>

        {/* Net Amount */}
        <div>
          <label htmlFor="netAmount" className="block text-gray-700 font-medium mb-1">
            Net Amount ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="netAmount"
            name="netAmount"
            value={formData.netAmount}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter net amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Paid Amount */}
        <div>
          <label htmlFor="paidAmount" className="block text-gray-700 font-medium mb-1">
            Paid Amount ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="paidAmount"
            name="paidAmount"
            value={formData.paidAmount}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter paid amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Due Amount */}
        <div>
          <label htmlFor="dueAmount" className="block text-gray-700 font-medium mb-1">
            Due Amount ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="dueAmount"
            name="dueAmount"
            value={formData.dueAmount}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter due amount"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Date Issued */}
        <div>
          <label htmlFor="dateIssued" className="block text-gray-700 font-medium mb-1">
            Date Issued<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dateIssued"
            name="dateIssued"
            value={formData.dateIssued}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-1">
            Due Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-gray-700 font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="py-2 px-4 rounded text-white bg-blue-500 hover:bg-blue-600"
          >
            Update Invoice
          </button>
        </div>
      </form>

      {/* Go Back Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleGoBack}
          className="py-2 px-4 rounded text-white bg-gray-500 hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default EditInvoice;
