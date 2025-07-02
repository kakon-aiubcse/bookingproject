import React, { useState, useEffect } from "react";
import Header from "./component/header";
import { auth, db } from "../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "./component/spinner";

const InvoiceForm = () => {
  const router = useRouter();
  const [options, setOptions] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",

    bookingId: "",
    packageName: "",
    dateIssued: "",
    paymentStatus: "N/A",
    netAmount: 0,
    paidAmount: 0,
    creditedAmount: 0,
    totalPaidAmount: 0, // Add totalPaidAmount field
    dueAmount: 0,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [netAmount, setNetAmount] = useState("");

  const [paidAmount, setPaidAmount] = useState("");
  const [creditedAmount, setcreditedAmount] = useState(0);
  const [totalPaidAmount, settotalPaidAmount] = useState(0);
  const { packageName } = formData;

  const [dueAmount, setDueAmount] = useState("");
  const [loading, setLoading] = useState(true)
    

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);
    useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500); 
        return () => clearTimeout(timer);
      }, []);
    
     

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsQuery = query(collection(db, "bookings"));
        const querySnapshot = await getDocs(bookingsQuery);
        const bookingsList = querySnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().name || "No Name",
          ...doc.data(),
        }));
        setBookings(bookingsList);
        setOptions(bookingsList);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);
  useEffect(() => {
    // Parse creditedAmount and totalPaidAmount, default to empty if not a valid number
    const credited = creditedAmount !== "" ? parseFloat(creditedAmount) : null;
    const paid = paidAmount !== "" ? parseFloat(paidAmount) : null;

    // Check if both credited and totalPaid are numbers before calculating paidAmount
    if (credited !== null && paid !== null) {
      const calculatedPaidAmount = credited + paid;
      setPaidAmount(calculatedPaidAmount);
    } else {
      setPaidAmount(""); // Set to blank if either value is not valid
    }
    

    // Handle dueAmount only when netAmount and paidAmount are numbers
    const net = netAmount !== "" ? parseFloat(netAmount) : null;
    if (net !== null && credited !== null && paid !== null) {
      const calculatedDueAmount = net - (credited + paid);
      setDueAmount(calculatedDueAmount > 0 ? calculatedDueAmount : "");
    } else {
      setDueAmount(""); // Set to blank if any value is missing
    }
  }, [creditedAmount, paidAmount, netAmount]);

  useEffect(() => {
    const fetchLatestInvoiceNumber = async () => {
      try {
        const invoicesQuery = query(collection(db, "invoices"));
        const querySnapshot = await getDocs(invoicesQuery);
        const invoiceNumbers = querySnapshot.docs.map(
          (doc) => doc.data().invoiceNumber
        );
        if (invoiceNumbers.length > 0) {
          const latestInvoice = invoiceNumbers.sort().pop();
          const lastNumber = latestInvoice.split("-")[1];
          const nextNumber = `INV-${String(
            parseInt(lastNumber, 10) + 1
          ).padStart(2, "0")}`;
          setFormData((prevData) => ({
            ...prevData,
            invoiceNumber: nextNumber,
          }));
        } else {
          setFormData((prevData) => ({
            ...prevData,
            invoiceNumber: "INV-01",
          }));
        }
      } catch (err) {
        console.error("Error fetching latest invoice number:", err);
      }
    };

    fetchLatestInvoiceNumber();
  }, []);
 if (loading) {
        return <Spinner />;
      }
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert value to a number if it's meant to be numeric
    const numericValue =
      name === "netAmount" || name === "paidAmount"
        ? parseFloat(value) || 0
        : value;

    // Prevent negative values for amount fields
    if ((name === "netAmount" || name === "paidAmount") && numericValue < 0)
      return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: numericValue,
      // Update payment status based on netAmount and paidAmount
      paymentStatus:
        name === "netAmount" || name === "paidAmount"
          ? numericValue >= (prevData.netAmount || 0)
            ? "Paid"
            : "Pending"
          : prevData.paymentStatus,
    }));
  };

  const handleBookingChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      bookingId: selectedOption?.value || "",
      packageName: selectedOption?.packageName || "",
    }));

    if (selectedOption) {
      const newNetAmount = selectedOption.netAmount || 0;
      const newPaidAmount =
        (selectedOption.paidAmount || 0) + creditedAmount + totalPaidAmount;
      setNetAmount(newNetAmount);
      setPaidAmount(newPaidAmount);
      setDueAmount(parseFloat(newNetAmount) - parseFloat(newPaidAmount));
      setFormData((prevData) => ({
        ...prevData,
        paymentStatus: newPaidAmount >= newNetAmount ? "Paid" : "Pending",
      }));
    } else {
      setNetAmount(0);
      setPaidAmount(0);
      setDueAmount(0);
      setFormData((prevData) => ({
        ...prevData,
        paymentStatus: "N/A",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!formData.invoiceNumber || !formData.bookingId) {
      setError("Please fill in all required fields.");
      return;
    }

    if (netAmount < 0 || paidAmount < 0) {
      setError("Net Amount and Paid Amount cannot be negative.");
      return;
    }

    try {
      let slipNumber = 0;
      const newslipNumber = Number(slipNumber + 1);
      const currentDate = new Date();
      const invoiceData = {
        invoiceNumber: formData.invoiceNumber,
        bookingId: formData.bookingId,
        packageName: formData.packageName,
        dateIssued: Timestamp.fromDate(currentDate),
        paymentStatus: formData.paymentStatus,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.fromDate(currentDate),
        netAmount: netAmount,
        paidAmount: paidAmount, // Combine both values into paidAmount
        creditedAmount: paidAmount, // Add creditedAmount field
        totalPaidAmount: paidAmount, // Add totalPaidAmount field
        dueAmount,
        slipNumber: newslipNumber,
      };

      await addDoc(collection(db, "invoices"), invoiceData);

      const historyData = {
        ...invoiceData, // Use the same data structure for invoice history
        bookingName:
          options.find((b) => b.value === formData.bookingId)?.label ||
          "No Name",
      };

      await addDoc(collection(db, "invoiceHistory"), historyData);

      // Reset Form and Navigate
      setSuccessMessage("Invoice created and booking updated successfully!");
      setFormData({
        invoiceNumber: "",
        bookingId: "",
        packageName: "",
        paymentStatus: "N/A",
      });
      setNetAmount(0);
      setPaidAmount(0);
      setDueAmount(0);

      router.push("/updateinvoice");
    } catch (err) {
      console.error("Error creating invoice or updating booking:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="xs:bg-bgrnd-0 xs:h-auto">
      <Header />
       <div className="flex flex-col min-h-screen bg-bgrnd-0 bottom-10 overflow-hidden xs:h-full xs:relative xs:top-[-5px]">
          <div className="flex m-3 flex-grow flex-col items-center justify-center px-4 py-0 bottom-5 relative ">
            <div className="w-full max-w-2xl bg-bgrnd-0 p-4  rounded-lg shadow-md border border-violet-500 xs:relative xs:top-[20px] xs:items-center xs:justify-center">
              <h1 className="text-4xl font-ios p-4 font-semibold mb-4 text-center text-hdline-0 xs:text-2xl xs:w-fit xs:p-2 xs:relative xs:left-8">
              Create First Invoice{" "}
            </h1>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-100 text-green-800 p-2 rounded-lg mb-3 text-center text-sm">
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-800 p-2 rounded-lg mb-3 text-center text-sm">
                {error}
              </div>
            )}

            {/* Invoice Form */}
            <form onSubmit={handleSubmit} className="space-y-4  xs:flex xs:flex-col xs:items-center">
              {/* Invoice Number */}
              <div className="flex items-center space-x-2   xs:flex-col xs:items-start xs:justify-start ">
                <label className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={formData.invoiceNumber || "..."}
                  className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm
                  xs:w-[275px]"
                />
              </div>

              {/* Booking ID */}
              <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start ">
                <label
                  htmlFor="bookingId"
                  className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                >
                  Booking Name <span className="text-red-500">*</span>
                </label>
                <Select
                  options={options}
                  autoFocus
                  onChange={handleBookingChange}
                  placeholder="Select Booking"
                  isClearable
                  className="flex-grow  rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-violet-600
                  xs:w-[275px]"
                  styles={{
                    control: (provided, state) => ({
                      ...provided,
                      borderColor: state.isFocused
                        ? "rgba(244, 114, 182, 0)"
                        : "rgba(209, 213, 219, 0)", // Change border color on focus
                      boxShadow: "none", // Remove any default shadow styles
                      "&:hover": {
                        borderColor: "rgba(244, 114, 182, 0)", // Change border color on hover
                      },
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999, // Ensure dropdown is above other elements
                    }),
                  }}
                />
              </div>

              <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start ">
                <label
                  htmlFor="packageName"
                  className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                >
                  Package Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text" // Corrected type from 'packageName' to 'text'
                  id="packageName"
                  name="packageName"
                  value={packageName}
                  onChange={handleChange} // If input is read-only, handleChange won't be needed
                  readOnly // Ensures the input cannot be modified
                  className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm xs:w-[275px]"
                />
              </div>

              {/* Net Amount */}
              <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start ">
                <label
                  htmlFor="netAmount"
                  className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                >
                  Net Amount<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="netAmount"
                  name="netAmount"
                  value={netAmount}
                  onChange={handleChange}
                  readOnly
                  className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm xs:w-[275px]"
                />
              </div>

              {/* Paid Amount */}
              <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start ">
                <label
                  htmlFor="paidAmount"
                  className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                >
                  Paid Amount<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="paidAmount"
                  name="paidAmount"
                  value={paidAmount}
                  onChange={handleChange}
                  readOnly
                  className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm
                  xs:w-[275px]"
                />
              </div>

              {/* Due Amount */}
              <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start ">
                <label
                  htmlFor="dueAmount"
                  className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                >
                  Due Amount<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="dueAmount"
                  name="dueAmount"
                  value={dueAmount}
                  readOnly
                  className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm
                  xs:w-[275px]"
                />
              </div>

              {/* Payment Status */}
              <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start ">
                <label
                  htmlFor="paymentStatus"
                  className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                >
                  Payment Status<span className="text-red-500">*</span>
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="flex-grow border border-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500 text-sm
                  xs:w-[275px]"
                  required
                  placeholder="Updated Status "
                  disabled
                >
                  <option value="N/A" className="text-gray-500">
                    N/A
                  </option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col space-y-3 mt-4 py-3">
                <button
                  type="submit"
                  className="px-2 py-2 bg-btton-0 text-bttext-0 rounded-lg text-base font-semibold  transition duration-300 disabled:bg-gray-400
                  "
                >
                  Create Invoice
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-2 px-3 rounded-md text-red-500"
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
