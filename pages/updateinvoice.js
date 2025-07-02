import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { auth } from "../lib/firebase";
import Header from "./component/header";
import { collection, getDocs, doc, deleteDoc, } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter} from "next/navigation";
import UpdateinvoiceView from "./Views/updateInvoiceView";

const Updateinvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState({});
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const invoicesPerPage = 10;
  const router = useRouter()
 

  const truncateText = (text, maxLength = 10) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);
  // Fetch invoices from Firestore
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "invoices"));
        const invoicesList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            dateIssued: data.dateIssued ? data.dateIssued.toDate() : null,
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
          };
        });

        invoicesList.sort((a, b) => b.dateIssued - a.dateIssued);
        setInvoices(invoicesList);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(
          "An error occurred while fetching invoices. Please try again."
        );
      }
    };

    fetchInvoices();
  }, []);

  // Fetch booking details
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bookings"));
        const bookingsMap = {};
        querySnapshot.docs.forEach((doc) => {
          const data = doc.data();
          bookingsMap[doc.id] = data.name;
        });
        setBookings(bookingsMap);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(
          "An error occurred while fetching bookings. Please try again."
        );
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id, invoiceNumber) => {
    try {
      const invoiceHistoryRef = collection(db, "invoiceHistory");
      const querySnapshot = await getDocs(invoiceHistoryRef);

      const relatedEntries = querySnapshot.docs.filter(
        (doc) => doc.data().invoiceNumber === invoiceNumber
      );

      const deletePromises = relatedEntries.map((entry) =>
        deleteDoc(doc(db, "invoiceHistory", entry.id))
      );
      await Promise.all(deletePromises);

      await deleteDoc(doc(db, "invoices", id));

      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice.id !== id)
      );
    } catch (err) {
      console.error("Error deleting invoice and related history entries:", err);
      setError(
        "An error occurred while deleting the invoice and related entries. Please try again."
      );
    }
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

  // Pagination logic
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);

  // Pagination handler
  const handlePagination = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="overflow-hidden min-h-screen">
        <UpdateinvoiceView
          error={error}
          truncateText={truncateText}
          handleDelete={handleDelete}
          getStatusClass={getStatusClass}
          totalPages={totalPages}
          currentInvoices={currentInvoices}
          bookings={bookings}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handlePagination={handlePagination}
        />
      </div>{" "}
    </>
  );
};

export default Updateinvoices;
