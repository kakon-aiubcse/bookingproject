import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import Header from "../../component/header";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-GB", options).replace(",", " ||");
};

const EditInvoice = () => {
  const router = useRouter();
  const { id } = router.query;

  const [invoice, setInvoice] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    bookingId: "",
    packageName: "",
    netAmount: "",
    paidAmount: "",
    creditedAmount: "",
    totalPaidAmount: "",
    dueAmount: "",
    paymentStatus: "Pending",
    slipNumber: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const { packageName } = formData;
  const { dateIssued } = formData;

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const invoiceDoc = doc(db, "invoices", id);
        const docSnapshot = await getDoc(invoiceDoc);

        if (docSnapshot.exists()) {
          const invoiceData = docSnapshot.data();
          const slipNumber = Number(invoiceData.slipNumber) || 0;
          const netAmount = Number(invoiceData.netAmount) || 0;
          const paidAmount = Number(invoiceData.paidAmount) || 0;

          const creditedAmount = Number(invoiceData.creditedAmount) || 0;
          const totalPaidAmount = (paidAmount + creditedAmount).toFixed(2);
          const dueAmount = (netAmount - parseFloat(totalPaidAmount)).toFixed(
            2
          );

          const packageName = invoiceData.packageName || "";
          const dateIssued = invoiceData.dateIssued
            ? new Date(
                invoiceData.dateIssued.seconds * 1000
              ).toLocaleDateString() // Convert Firestore Timestamp to Date
            : "";

          setInvoice(invoiceData);
          setFormData({
            invoiceNumber: invoiceData.invoiceNumber || "",
            bookingId: invoiceData.bookingId || "",
            netAmount: netAmount,
            paidAmount: paidAmount,
            creditedAmount: "",
            slipNumber: slipNumber,

            totalPaidAmount: totalPaidAmount,
            dueAmount: dueAmount,
            paymentStatus: dueAmount > 0 ? "Pending" : "Paid",
            packageName: invoiceData.packageName || "",
            dateIssued: invoiceData.dateIssued || "",
          });

          // Should log the input element

          if (invoiceData.bookingId) {
            const bookingDoc = doc(db, "bookings", invoiceData.bookingId);
            const bookingSnapshot = await getDoc(bookingDoc);
            if (bookingSnapshot.exists()) {
              setBookingName(bookingSnapshot.data().name || "No Name");
            }
          }
        } else {
          setError("Invoice not found.");
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError(
          "An error occurred while fetching the invoice. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  // Run this effect when the invoice is fetched
  useEffect(() => {
    const { netAmount, paidAmount, creditedAmount } = formData;
    const net = Number(netAmount) || 0;
    const paid = Number(paidAmount) || 0;
    const credited = Number(creditedAmount) || 0;

    const totalPaidAmount = (paid + credited).toFixed(2);
    const dueAmount = (net - parseFloat(totalPaidAmount)).toFixed(2);

    setFormData((prevData) => ({
      ...prevData,
      totalPaidAmount: totalPaidAmount,
      dueAmount: dueAmount,
      paymentStatus: dueAmount > 0 ? "Pending" : "Paid",
    }));

    if (parseFloat(dueAmount) < 0) {
      setError("Due Amount cannot be negative.");
    } else {
      setError("");
    }
  }, [formData.netAmount, formData.paidAmount, formData.creditedAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value) || 0;

    if (name === "creditedAmount" && parsedValue < 0) {
      setError("Credited Amount cannot be negative.");
      return;
    }

    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };

      if (["netAmount", "paidAmount", "creditedAmount"].includes(name)) {
        const net = Number(newData.netAmount) || 0;
        const paid = Number(newData.paidAmount) || 0;
        const credited = Number(newData.creditedAmount) || 0;

        const totalPaidAmount = (paid + credited).toFixed(2);
        const dueAmount = (net - parseFloat(totalPaidAmount)).toFixed(2);

        if (parseFloat(dueAmount) < 0) {
          setError("Due Amount cannot be negative.");
          return prevData;
        }

        return {
          ...newData,
          totalPaidAmount,
          dueAmount,
          paymentStatus: parseFloat(dueAmount) > 0 ? "Pending" : "Paid",
        };
      }

      return newData;
    });

    if (name === "bookingId") {
      const fetchBookingName = async () => {
        const bookingDoc = doc(db, "bookings", value);
        const bookingSnapshot = await getDoc(bookingDoc);
        if (bookingSnapshot.exists()) {
          setBookingName(bookingSnapshot.data().name || "No Name");
        } else {
          setBookingName("No Name");
        }
      };
      fetchBookingName();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate form data
    if (parseFloat(formData.dueAmount) < 0) {
      setError("Due Amount cannot be negative.");
      return;
    }

    try {
      const { paidAmount, creditedAmount, netAmount, slipNumber } = formData;
      const totalPaidAmount = Number(paidAmount) + Number(creditedAmount);
      const dueAmount = Number(netAmount) - totalPaidAmount;

      const newslipNumber = Number(slipNumber + 1);

      const historyData = {
        invoiceNumber: formData.invoiceNumber,
        bookingId: formData.bookingId,
        bookingName: bookingName,
        packageName: packageName,
        netAmount: Number(netAmount),
        paidAmount: Number(paidAmount),
        creditedAmount: Number(creditedAmount),
        totalPaidAmount: totalPaidAmount, // Keep it as a number
        dueAmount: dueAmount,
        paymentStatus: dueAmount > 0 ? "Pending" : "Paid",
        createdAt: Timestamp.now(),
        dateIssued: dateIssued,
        slipNumber: newslipNumber,
      };

      await addDoc(collection(db, "invoiceHistory"), historyData);

      const invoiceRef = doc(db, "invoices", id);
      await updateDoc(invoiceRef, {
        ...formData,
        slipNumber: newslipNumber,
        paidAmount: totalPaidAmount.toFixed(2),
        creditedAmount: Number(creditedAmount),
        totalPaidAmount: totalPaidAmount, // Keep it as a number
        dueAmount: dueAmount,
        paymentStatus: dueAmount > 0 ? "Pending" : "Paid",
        updatedAt: Timestamp.now(),
      });

      const bookingRef = doc(db, "bookings", formData.bookingId);
      await updateDoc(bookingRef, {
        netAmount: Number(netAmount),
        paidAmount: totalPaidAmount.toFixed(2),
        paymentStatus: dueAmount > 0 ? "Pending" : "Paid",
      });

      setSuccessMessage("Invoice and related booking updated successfully!");
      setTimeout(() => {
        router.push("/updateinvoice");
      }, 2000);
    } catch (err) {
      console.error("Error updating invoice and booking:", err);
      setError(
        "An error occurred while updating the invoice and booking. Please try again."
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center text-center bg-gradient-to-b from-slate-500 to-slate-300">
        <div className="flex flex-grow justify-center items-center bg-gradient-to-b from-slate-500 to-slate-300 flex-col mb-0 w-full">
          <div className="w-full justify-center items-center max-w-4xl p-6 bg-gradient-to-b from-slate-500 to-slate-300 rounded-lg shadow-lg">
            <div className="w-full justify-center items-center max-w-4xl bg-white p-6 sm:p-8 rounded-lg shadow-md mx-auto">
              <h1 className="text-2xl sm:text-2xl font-semibold mb-4 text-center text-gray-900">
                Edit Invoice of {bookingName}
              </h1>

              {successMessage && (
                <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-center">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded mb-4 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="invoiceNumber"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter invoice number"
                    readOnly
                    required
                  />
                </div>

                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="bookingId"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Booking ID
                  </label>
                  <input
                    type="text"
                    id="bookingId"
                    name="bookingId"
                    value={formData.bookingId}
                    onChange={handleChange}
                    className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter booking ID"
                    required
                  />
                </div>

                {bookingName && (
                  <div className="flex items-start space-x-0">
                    <label
                      htmlFor="bookingName"
                      className="text-gray-700 font-medium text-sm w-36"
                    >
                      Booking Name
                    </label>
                    <input
                      type="text"
                      id="bookingName"
                      name="bookingName"
                      value={bookingName}
                      readOnly
                      className="flex-grow border border-gray-100 rounded-md p-1.5 bg-gray-100 text-sm"
                    />
                  </div>
                )}

                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="netAmount"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Net Amount
                  </label>
                  <input
                    type="number"
                    id="netAmount"
                    name="netAmount"
                    value={formData.netAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, netAmount: e.target.value })
                    }
                    className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter net amount"
                    required
                  />
                </div>

                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="paidAmount"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    id="paidAmount"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    readOnly
                    required
                  />
                </div>

                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="creditedAmount"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Debited Amount: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="creditedAmount"
                    autoFocus
                    id="creditedAmount"
                    value={formData.creditedAmount}
                    onChange={handleChange}
                    className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter New amount"
                    min="0" // Optional: Prevent negative values
                  />
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}
                </div>

                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="totalPaidAmount"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Total Paid Amount
                  </label>
                  <input
                    type="text"
                    id="totalPaidAmount"
                    name="totalPaidAmount"
                    value={formData.totalPaidAmount}
                    readOnly
                    className="flex-grow border border-gray-100 rounded-md p-1.5 bg-gray-100 text-sm"
                  />
                </div>

                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="dueAmount"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Due Amount
                  </label>
                  <input
                    type="text"
                    id="dueAmount"
                    name="dueAmount"
                    value={formData.dueAmount}
                    readOnly
                    className="flex-grow border border-gray-100 rounded-md p-1.5 bg-gray-100 text-sm"
                  />
                </div>

                <div className="flex items-start space-x-0">
                  <label
                    htmlFor="paymentStatus"
                    className="text-gray-700 font-medium text-sm w-36"
                  >
                    Payment Status
                  </label>
                  <input
                    type="text"
                    id="paymentStatus"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    readOnly
                    className="flex-grow border border-gray-100 rounded-md p-1.5 bg-gray-100 text-sm"
                  />
                </div>

                <div className="flex flex-col space-y-3 mt-4">
                  <button
                    type="submit"
                    className="px-2 py-2 bg-rose-600 text-white rounded-lg text-base font-semibold hover:bg-rose-700 transition duration-300 disabled:bg-gray-400"
                  >
                    Update Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full py-2 px-3 rounded-md text-white bg-gray-500 hover:bg-gray-600"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditInvoice;
