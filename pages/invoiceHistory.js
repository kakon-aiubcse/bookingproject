import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Header from "./component/header";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import InvoicehistoryView from "./Views/invoicehistoryView";

const InvoiceHistory = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
    const fetchHistory = async () => {
      try {
        const historyQuery = query(
          collection(db, "invoiceHistory"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(historyQuery);
        const historyList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHistory(historyList);
      } catch (err) {
        console.error("Error fetching invoice history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, "invoiceHistory", id);
      await deleteDoc(docRef);
      setHistory((prevHistory) =>
        prevHistory.filter((entry) => entry.id !== id)
      );
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  const handleView = (invoice) => {
    
    const index = history.findIndex((entry) => entry.id === invoice.id); // Get the index based on the unique ID
    setSelectedInvoice(invoice);
    setSelectedIndex(index);
    console.log(invoice)
  };

  const handleBackToList = () => {
    setSelectedInvoice(null);
    setSelectedIndex(null);
  };

const handleNext = () => {
  if (selectedIndex !== null) {
    const currentBookingId = selectedInvoice.bookingId;
    for (let i = selectedIndex + 1; i < history.length; i++) {
      if (history[i].bookingId === currentBookingId) {
        setSelectedInvoice(history[i]);
        setSelectedIndex(i);
        return;
      }
    }
    console.log("No next slip for this booking.");
  }
};

const handlePrev = () => {
  if (selectedIndex !== null) {
    const currentBookingId = selectedInvoice.bookingId;
    for (let i = selectedIndex - 1; i >= 0; i--) {
      if (history[i].bookingId === currentBookingId) {
        setSelectedInvoice(history[i]);
        setSelectedIndex(i);
        return;
      }
    }
    console.log("No previous slip for this booking.");
  }
};

  const hasNext =
    selectedInvoice &&
    history.length &&
    history
      .slice(selectedIndex + 1)
      .some((item) => item.bookingId === selectedInvoice.bookingId);
  const hasPrev =
    selectedInvoice &&
    history.length &&
    history
      .slice(0, selectedIndex)
      .some((item) => item.bookingId === selectedInvoice.bookingId);


  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentInvoices =
    history.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedInvoice(null); // Reset invoice view
      setSelectedIndex(null); // Reset index view
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedInvoice(null); // Reset invoice view
      setSelectedIndex(null); // Reset index view
    }
  };

  const truncateText = (text, maxLength = 10) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "text-green-500";
      case "Pending":
        return "text-rose-500";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="overflow-hidden min-h-screen bg-bgrnd-0">
        <InvoicehistoryView
          truncateText={truncateText}
          currentPage={currentPage}
          totalPages={totalPages}
          getStatusClass={getStatusClass}
          handlePrev={handlePrev}
          handleNext={handleNext}
          handleBackToList={handleBackToList}
          selectedInvoice={selectedInvoice}
          currentInvoices={currentInvoices}
          handlePrevPage={handlePrevPage}
          handleDelete={handleDelete}
          handleNextPage={handleNextPage}
          handleView={handleView}
          selectedIndex={selectedIndex}
          setCurrentPage={setCurrentPage}
          hasNext =  {hasNext}
          hasPrev = {hasPrev}
        />
      </div>
    </>
  );
};

export default InvoiceHistory;
