import React, { useState, useEffect } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import BookingListView from "../pages/Views/bookingslistview";
import PageForm from "./Controller/pdfForm/[id]";

const ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGEind = 5;

const ShowBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [error, setError] = useState("");
  const [currentBookingPage, setCurrentBookingPage] = useState(1);
  const [currentInvoicePage, setCurrentInvoicePage] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalInvoicePages, setTotalInvoicePages] = useState(0);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const router = useRouter();
  const [user, setUser] = useState(null);

  const fetchBookings = async () => {
    try {
      const startIndex = (currentBookingPage - 1) * ITEMS_PER_PAGE;
      const bookingsQuery = query(
        collection(db, "bookings"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(bookingsQuery);
      const bookingsList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const validDate =
          data.validDate instanceof Timestamp
            ? data.validDate.toDate()
            : new Date(data.validDate.seconds * 1000 || data.validDate);

        return {
          id: doc.id,
          ...data,
          validDate,
        };
      });

      setTotalBookings(bookingsList.length);
      setBookings(bookingsList.slice(startIndex, startIndex + ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("An error occurred while fetching the bookings.");
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [currentBookingPage]);

  useEffect(() => {
    if (showInvoiceModal && selectedBookingId) {
      fetchInvoices(selectedBookingId);
    }
  }, [currentInvoicePage, selectedBookingId, showInvoiceModal]);

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
  const fetchInvoices = async (bookingId) => {
    try {
      // Calculate the starting index for pagination
      const startIndex = (currentInvoicePage - 1) * ITEMS_PER_PAGEind;

      // Construct the query to fetch invoices associated with the given bookingId
      const invoicesQuery = query(
        collection(db, "invoiceHistory"),
        where("bookingId", "==", bookingId),
        orderBy("slipNumber", "asc")
      );

      // Execute the query
      const querySnapshot = await getDocs(invoicesQuery);

      // Map through the documents to create an array of invoice objects
      const invoices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update total invoices and pages for pagination
      const totalCount = invoices.length;
      setTotalInvoices(totalCount);
      setTotalInvoicePages(Math.ceil(totalCount / ITEMS_PER_PAGEind));

      // Slice the invoices array to get only the items for the current page
      const paginatedInvoices = invoices.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGEind
      );

      // Update the selected invoices state
      setSelectedInvoices(paginatedInvoices);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      // Set error state to notify user about the error
      setError("An error occurred while fetching the invoices.");
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const invoicesQuery = query(
        collection(db, "invoiceHistory"),
        where("bookingId", "==", bookingId)
      );

      const invoiceSnapshot = await getDocs(invoicesQuery);
      const deletePromises = invoiceSnapshot.docs.map((invoiceDoc) =>
        deleteDoc(doc(db, "invoiceHistory", invoiceDoc.id))
      );
      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "bookings", bookingId));
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking and related entries:", error);
      setError(
        "An error occurred while deleting the booking and related entries. Please try again."
      );
    }
  };

  const handleViewInvoices = (bookingId) => {
    setSelectedBookingId(bookingId); // Ensure this ID matches an actual booking
    fetchInvoices(bookingId); // Fetch invoices related to the booking
    setShowInvoiceModal(true); // Show modal for invoices
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-500";
      case "Pending":
        return "text-red-500";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const handlePagination = (direction, type) => {
    if (type === "invoices") {
      setCurrentInvoicePage((prevPage) => {
        const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
        return newPage;
      });
    }
    if (type === "bookings") {
      setCurrentBookingPage((prevPage) => {
        const newPage = direction === "next" ? prevPage + 1 : prevPage - 1;
        return newPage;
      });
    }
  };

  const truncateText = (text = "", maxLength = 10) => {
    // Ensure text is a string and handle undefined cases
    const str = typeof text === "string" ? text : "";
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };
  const toggleInvoiceDropdown = (id) => {
    if (selectedBookingId === id) {
      setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
    } else {
      setSelectedBookingId(id);
      setDropdownOpen(true);
    }
  };

  const handleDownload = (id) => {
    // Set the selected booking ID in state (if you need to use it elsewhere)
    setSelectedBookingId(id);

    // Navigate to the PDF form page with the autoSubmit query
    router.push(`/Controller/pdfForm/${id}?autoSubmit=true`);
  };

  const totalPages = Math.ceil(totalBookings / ITEMS_PER_PAGE);
  console.log("Selected Invoices:", selectedInvoices);
  console.log("Bookings:", bookings);
  console.log("Selected Booking ID:", selectedBookingId);

  return (
    <>
      <div className=" min-h-screen]">
        <BookingListView
          handleViewInvoices={handleViewInvoices}
          handleDelete={handleDelete}
          getStatusClass={getStatusClass}
          handlePagination={handlePagination}
          truncateText={truncateText}
          totalPages={totalPages}
          error={error}
          bookings={bookings}
          currentBookingPage={currentBookingPage}
          currentInvoicePage={currentInvoicePage}
          showInvoiceModal={showInvoiceModal}
          selectedBookingId={selectedBookingId}
          selectedInvoices={selectedInvoices}
          totalInvoicePages={totalInvoicePages}
          setShowInvoiceModal={setShowInvoiceModal}
          setCurrentBookingPage={setCurrentBookingPage}
          setCurrentInvoicePage={setCurrentInvoicePage}
          dropdownOpen={dropdownOpen}
          toggleInvoiceDropdown={toggleInvoiceDropdown}
          handleDownload={handleDownload}
        />
      </div>
    </>
  );
};

export default ShowBookings;
