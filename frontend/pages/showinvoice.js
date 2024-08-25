import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase'; // Adjust import path as necessary
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

const ShowInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch invoices from Firestore
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'invoices'));
        const invoicesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setInvoices(invoicesList);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        setError('An error occurred while fetching invoices. Please try again.');
      }
    };

    fetchInvoices();
  }, []);

  // Handle delete invoice
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'invoices', id));
      setInvoices((prevInvoices) => prevInvoices.filter((invoice) => invoice.id !== id));
    } catch (err) {
      console.error('Error deleting invoice:', err);
      setError('An error occurred while deleting the invoice. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 overflow-hidden">
    <div className="flex flex-grow flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-full md:max-w-5xl bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">Invoices</h1>
  
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
  
        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Invoice Number</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Booking ID</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Net Amount</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Paid Amount</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Due Amount</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Date Issued</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Due Date</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Status</th>
                <th className="px-2 py-1 text-left text-gray-600 text-xs md:text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b">
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">{invoice.invoiceNumber}</td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">{invoice.bookingId}</td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
                    ${invoice.netAmount ? invoice.netAmount.toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
                    ${invoice.paidAmount ? invoice.paidAmount.toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
                    ${invoice.dueAmount ? invoice.dueAmount.toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
                    {invoice.dateIssued ? new Date(invoice.dateIssued).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">{invoice.status}</td>
                  <td className="px-2 py-1 text-gray-700 text-xs md:text-sm">
                    <button
                      onClick={() => router.push(`/editinvoice/${invoice.id}`)}
                      className="text-blue-500 hover:text-blue-600 text-xs md:text-sm mr-2 md:mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-500 hover:text-red-600 text-xs md:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        <div className="flex justify-center mt-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full max-w-xs py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 text-sm md:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default ShowInvoices;
