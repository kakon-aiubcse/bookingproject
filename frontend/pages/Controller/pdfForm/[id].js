import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { jsPDF } from "jspdf";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import Header from "../../component/header";

const today = new Date();
const options = { day: "numeric", month: "short", year: "numeric" };
const formattedDate = today.toLocaleDateString("en-US", options);

const PdfForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState({
    name: "",
    createdBy: "",
    netAmount: 0,
    paidAmount: 0,
    passportNumber: "",
    paymentStatus: "",
    packageName: "",
    validDate: "",
    createdAt: "",
    usermobile: "",
  });
  const [invoices, setInvoices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const pdfContentRef = useRef();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (id) {
          await fetchBookingData();
        }
      } else {
        setIsAuthenticated(false);
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, router]);

  useEffect(() => {
    if (
      router.query.autoSubmit === "true" &&
      formData &&
      Object.values(formData).some((value) => value !== "" && value !== 0) &&
      invoices.length > 0 &&
      !pdfGenerated
    ) {
      handleSubmit();
    }
  }, [formData, invoices, router.query.autoSubmit, pdfGenerated]);

  const fetchBookingData = async () => {
    if (!id) {
      console.warn("No ID provided to fetchBookingData");
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(db, "bookings", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        let createdByName = "";
        let usermobile = "";
        const userDocRef = doc(db, "users", data.createdBy);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          createdByName = userData.name;
          usermobile = userData.mobile;
        }

        setFormData({
          name: data.name,
          createdBy: createdByName,
          usermobile: usermobile,
          netAmount: data.netAmount || 0,
          paidAmount: data.paidAmount || 0,
          passportNumber: data.passportNumber || "",
          paymentStatus: data.paymentStatus || "",
          packageName: data.packageName || "",
          validDate: data.validDate
            ? format(data.validDate.toDate(), "dd MMM yyyy, hh:mm:ss a")
            : "",
          createdAt: data.createdAt
            ? format(data.createdAt.toDate(), "dd MMM yyyy, hh:mm:ss a")
            : "",
        });

        const invoicesQuery = query(
          collection(db, "invoiceHistory"),
          where("bookingId", "==", id),
          orderBy("slipNumber", "asc")
        );

        const invoicesSnapshot = await getDocs(invoicesQuery);
        const invoicesData = invoicesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setInvoices(invoicesData);
      } else {
        console.warn("No such document with ID: ", id);
      }
    } catch (error) {
      console.error("Error fetching booking data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!pdfContentRef.current) return;

    // Use html2canvas to take a screenshot of the styled content
    const canvas = await html2canvas(pdfContentRef.current, {
      scale: 1.5, // Reduced scale for better fit and quality
      useCORS: true, // Handle CORS for images if needed
    });

    const imgData = canvas.toDataURL("image/png");

    // Initialize jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      floatPrecision: 16, // or "smart"
    });

    const imgWidth = 205; // Increased width for better fit
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    let heightLeft = imgHeight;
    let position = 5; // Adjust the initial position

    // Add image to the PDF
    doc.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight); // Adjust x-position as needed
    heightLeft -= doc.internal.pageSize.height;

    // Add new pages if content exceeds one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
      heightLeft -= doc.internal.pageSize.height;
    }

    doc.save(`receipt_${id}_data.pdf`);
    setPdfGenerated(true);
  };
  const truncateText = (text = "", maxLength = 10) => {
    // Ensure text is a string and handle undefined cases
    const str = typeof text === "string" ? text : "";
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return null;
  }
  console.log("formData:", formData);
  // Check the structure of formData

  let netAmount = formData.netAmount;
  let paidAmount = formData.paidAmount;
  const taxRate = 0.0; // 5%
  const tax = Number(netAmount * taxRate); // Calculate tax
  const total = Number(netAmount + tax);
  const paid = tax + Number(paidAmount);
  const balance = Number(total - paid);

  return (
    <>
      <Header />
      <div>
        <form onSubmit={handleSubmit} ref={pdfContentRef}>
          <div className="p-8 bg-gray-50 shadow-md rounded-lg">
            <div className="flex justify-center items-center mb-8 border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Booking Receipt.
              </h1>
            </div>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-8 pb-4">
              <div className="flex items-center space-x-2 text-xl sm:text-2xl cursor-pointer">
                <div className="flex items-center">
                  <img
                    src="/bookinglogo.png"
                    alt="bookinglogo"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                  />
                  <span className="ml-2 text-2xl font-bold">
                    Bookie
                    <span className="font-extrabold text-amber-500">.</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-lg">{formattedDate}</p>
              </div>
            </div>
            {/* Info Details Section */}
            <div className="border border-gray-300 p-5 mb-8 rounded-lg bg-white shadow-sm">
              <div className="flex justify-between mb-4">
                <div className="w-1/2 pr-4">
                  <h2 className="text-2xl font-semibold mb-4">Booked by</h2>
                  <p className="mb-2">
                    <strong className="text-gray-700">Name:</strong>{" "}
                    <span className="text-black">{formData.name}</span>
                  </p>

                  <p>
                    <strong className="text-gray-700">Passport Number:</strong>{" "}
                    <span className="text-black">
                      {formData.passportNumber}
                    </span>
                  </p>
                </div>
                <div className="w-1/2 pl-4">
                  <h2 className="text-2xl font-semibold mb-4">Hosted by</h2>
                  <p className="mb-2">
                    <strong className="text-gray-700">Name:</strong>{" "}
                    <span className="text-black">{formData.createdBy}</span>
                  </p>
                  <p className="mb-2">
                    <strong className="text-gray-700">Mobile:</strong>{" "}
                    <span className="text-black">{formData.usermobile}</span>
                  </p>
                  <p>
                    <strong className="text-gray-700">Creation:</strong>
                    <span className="text-black ml-1">
                      {formData.createdAt}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details Section */}
            <div className="border border-gray-300 p-5 mb-8 rounded-lg bg-white shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
              <p className="mb-2">
                <strong className="text-gray-700">Package Name:</strong>{" "}
                <span className="text-black">{formData.packageName}</span>
              </p>
              <p className="mb-2">
                <strong className="text-gray-700">Booking ID:</strong>{" "}
                <span className="text-black">{id}</span>
              </p>

              <p>
                <strong className="text-gray-700">Date of Booking:</strong>{" "}
                <span className="text-black">{formData.validDate}</span>
              </p>
            </div>
            {/* bookings Data Section */}
            <div className="border border-gray-300 p-5 mb-8 rounded-lg bg-white shadow-sm">
              <div className="flex justify-start mb-4">
                <h2 className="text-2xl font-semibold">Booking Data</h2>
              </div>

              <table className="min-w-full text-center bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100  border-b">
                    <th className="px-2 py-2 text-center  text-gray-600 text-xs md:text-sm">
                      Net Amount
                    </th>
                    <th className="px-2 py-2 text-center  text-gray-600 text-xs md:text-sm">
                      Paid Amount
                    </th>
                    <th className="px-2 py-2 text-center  text-gray-600 text-xs md:text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                    ${Number(formData.netAmount || 0).toFixed(2)}
                  </td>
                  <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                    ${Number(formData.paidAmount || 0).toFixed(2)}
                  </td>
                  <td
                    className={`px-2 py-2 font-semibold text-gray-700 text-xs md:text-sm ${getStatusClass(
                      formData.paymentStatus
                    )}`}
                  >
                    {formData.paymentStatus}
                  </td>
                </tbody>
              </table>
            </div>

            {/* Invoice Data Section */}
            <div className="border border-gray-300 p-5 mb-8 rounded-lg bg-white shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">Invoice Data</h2>
              <table className="min-w-full text-black bg-white border border-gray-300 rounded-lg shadow-md mx-auto">
                <thead>
                  <tr className="bg-white border-b border-gray-300">
                    <th className="px-4 py-2 text-center text-xs md:text-sm whitespace-nowrap">
                      Invoice_ID
                    </th>
                    <th className="px-4 py-2 text-center text-xs md:text-sm whitespace-nowrap">
                      Slip No.
                    </th>
                    <th className="px-4 py-2 text-center text-xs md:text-sm whitespace-nowrap">
                      Net Amount
                    </th>
                    <th className="px-4 py-2 text-center text-xs md:text-sm whitespace-nowrap">
                      Total Paid
                    </th>
                    <th className="px-4 py-2 text-center text-xs md:text-sm whitespace-nowrap">
                      Debit
                    </th>
                    <th className="px-4 py-2 text-center text-xs md:text-sm whitespace-nowrap">
                      Credit
                    </th>
                    <th className="px-4 py-2 text-center text-xs md:text-sm whitespace-nowrap">
                      Creation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-4 px-4 text-center">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b text-center border-slate-200 hover:bg-slate-200"
                      >
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap text-center">
                          {truncateText(invoice.id, 6)}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap text-center">
                          {invoice.slipNumber}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap text-center">
                          $
                          {typeof invoice.netAmount === "number"
                            ? invoice.netAmount.toFixed(2)
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap text-center">
                          $
                          {isNaN(Number(invoice.totalPaidAmount))
                            ? "N/A"
                            : Number(invoice.totalPaidAmount).toFixed(2)}
                        </td>
                        <td
                          className={`px-4 py-2 text-xs md:text-sm whitespace-nowrap text-center ${
                            Number(invoice.creditedAmount) > 0
                              ? "text-green-500"
                              : ""
                          }`}
                        >
                          {isNaN(Number(invoice.creditedAmount))
                            ? "N/A"
                            : `${
                                Number(invoice.creditedAmount) > 0 ? "+" : ""
                              } $${Number(invoice.creditedAmount).toFixed(2)}`}
                        </td>
                        <td
                          className={`px-4 py-2 text-xs md:text-sm whitespace-nowrap text-center ${
                            Number(invoice.dueAmount) > 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {Number(invoice.dueAmount) > 0
                            ? `-$${Number(invoice.dueAmount).toFixed(2)}`
                            : "Clear"}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap text-center">
                          {invoice.createdAt
                            ? new Date(
                                invoice.createdAt.seconds * 1000
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }) +
                              ", " +
                              new Date(
                                invoice.createdAt.seconds * 1000
                              ).toLocaleTimeString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Amount Section */}
            <div className="flex p-5 mb-8 rounded-lg bg-white shadow-sm">
              {/* Left div for additional content, taking 70% width */}
              <div className="flex-[7]">
                <p className="text-gray-700 text-base"></p>
              </div>

              {/* Right div for existing content, taking 30% width */}
              <div className="flex-[3] text-right text-base pr-10">
                <p className="mb-2 flex justify-end">
                  <strong className="text-gray-700 mr-40">
                    Sub Total Amount:
                  </strong>
                  <span className="mr-3">{`$${
                    netAmount ? parseFloat(netAmount.toFixed(2)) : "0.00"
                  }`}</span>
                </p>
                <p className="mb-2 flex justify-end border-b border-gray-300">
                  <strong className="text-gray-700 pb-2 mr-16">
                    Value Added Tax:
                    <span className="text-slate-500 text-xs ml-2">
                      (0% of subtotal)
                    </span>
                  </strong>
                  <span className="mr-3">{`$${
                    tax ? parseFloat(tax).toFixed(2) : "0.00"
                  }`}</span>
                </p>

                {/* Nested div for Total without border */}
                <div className="mb-2 flex justify-end">
                  <strong className="text-gray-700 mr-40">Total Amount:</strong>
                  <span className="mr-3">{`$${
                    total ? parseFloat(total).toFixed(2) : "0.00"
                  }`}</span>
                </div>

                <p className="mb-2 flex justify-end border-b border-gray-300">
                  <strong className="text-gray-700 pb-2 mr-40">
                    Paid Amount:
                  </strong>
                  <span className="mr-3">{`$${
                    paid ? parseFloat(paid).toFixed(2) : "0.00"
                  }`}</span>
                </p>
                <p className="mb-2 flex justify-end">
                  <strong className="text-gray-700 mr-40">Balance:</strong>
                  <span className="mr-3">{`$${
                    balance ? parseFloat(balance).toFixed(2) : "0.00"
                  }`}</span>
                </p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="pt-4 mt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-left">
                Authorized Signature
              </h2>
              <div className="relative h-20 w-48 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-100 overflow-hidden mb-1">
                <img
                  src="/signature.png" // Update with the actual path to your image
                  alt="Authorized Signature"
                  className="h-full w-full object-contain opacity-90"
                />
              </div>
              <p className="text-gray-800 font-semibold text-left">
                Khairul Islam
              </p>
              <p className="text-gray-600 text-left">Full Stack Developer</p>
            </div>
          </div>
        </form>
        <div className="flex flex-col space-y-3 mt-4">
          <button
            type="submit"
            className="px-2 py-2 bg-rose-600 text-white rounded-lg text-base font-semibold hover:bg-rose-700 transition duration-300 disabled:bg-gray-400"
          >
            Download Again?
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-2 px-3 rounded-md text-white bg-gray-500 hover:bg-gray-600"
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
};

export default PdfForm;
