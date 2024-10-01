import React from "react";
import { useRouter } from "next/router";

const InvoicehistoryView = ({
  truncateText,
  selectedInvoice,
  currentInvoices,
  currentPage,
  totalPages,
  getStatusClass,
  handlePrevPage,
  handlePrev,
  handleNext,
  handleBackToList,
  handleDelete,
  handleNextPage,
  handleView,
  selectedIndex,
  setCurrentPage,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col min-h-[10vh]  bg-gradient-to-b from-slate-5100 to-slate-3100 overflow-hidden">
        <div className="flex flex-grow flex-col items-center  py-1">
          <div className="w-full max-w-20xl  bg-gradient-to-b from-slate-100 to-slate-100  rounded-lg shadow-lg">
            {selectedInvoice ? (
              <div className="flex justify-center items-center m-1 min-h-[12vh]">
                <div className="p-1  bg-gradient-to-b from-slate-100 to-slate-100 text-black shadow-2xl rounded-lg  max-w-xl w-full">
                  <h2 className="text-xl bg-slate-100 font-semibold mb-4 text-center text-slate-800">
                    Invoice Details of{" "}
                    <span className=" text-rose-500">
                      {" "}
                      {selectedInvoice.bookingName}
                    </span>
                  </h2>
                  <div className="space-y-1 text-lg text-center bg-white text-black">
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Invoice Number :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.invoiceNumber || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Payment Slip Number :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.slipNumber || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Booking ID :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.bookingId || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Invoice ID :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.id || "N/A"}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Booking Name :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.bookingName || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Package Name :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.packageName || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Status :</strong>
                      </p>
                      <p
                        className={`flex-1 text-left pl-2 font-semibold ${getStatusClass(
                          selectedInvoice.paymentStatus
                        )}`}
                      >
                        {selectedInvoice.paymentStatus || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Net Amount :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        $
                        {selectedInvoice.netAmount !== undefined
                          ? selectedInvoice.netAmount.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Total Paid Amount :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        $
                        {typeof selectedInvoice.totalPaidAmount === "number"
                          ? selectedInvoice.totalPaidAmount.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Latest Credit :</strong>
                      </p>
                      <p className="flex-1 text-green-700 text-left pl-2">
                        {selectedInvoice.creditedAmount !== undefined
                          ? `+ $${Number(
                              selectedInvoice.creditedAmount
                            ).toFixed(2)}`
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Previous Paid Amount :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        $
                        {selectedInvoice.paidAmount !== undefined
                          ? selectedInvoice.paidAmount.toFixed(2)
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Due Amount :</strong>
                      </p>
                      <p
                        className={`flex-1 text-left pl-2  ${
                          selectedInvoice.dueAmount > 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {selectedInvoice.dueAmount > 0
                          ? `-$${Number(selectedInvoice.dueAmount).toFixed(2)}`
                          : "Clear"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Issued At :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.dateIssued
                          ? new Date(
                              selectedInvoice.dateIssued.seconds * 1000
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }) +
                            ", " +
                            new Date(
                              selectedInvoice.dateIssued.seconds * 1000
                            ).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="flex-1 text-right">
                        <strong>Last Updated :</strong>
                      </p>
                      <p className="flex-1 text-left pl-2">
                        {selectedInvoice.dateIssued
                          ? new Date(
                              selectedInvoice.createdAt.seconds * 1000
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }) +
                            ", " +
                            new Date(
                              selectedInvoice.createdAt.seconds * 1000
                            ).toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex bg-slate-100 border border-slate-200 justify-between items-center mt-2">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrev}
                      disabled={selectedIndex === 0}
                      className={`py-3 px-6 ml-2 rounded-lg text-slate-800 bg-slate-300 hover:bg-slate-300 hover:text-slate-950 text-lg transition-all duration-200 ${
                        selectedIndex === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      &lt; Prev
                    </button>

                    {/* Close Button */}
                    <button
                      onClick={handleBackToList}
                      className="py-3 px-6 ml-2 rounded-lg text-white font-semibold bg-rose-500 hover:bg-rose-600 text-lg transition-all duration-200"
                    >
                      Close
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={handleNext}
                      disabled={selectedIndex === history.length - 1}
                      className={`py-3 px-6 ml-2 rounded-lg text-slate-800 bg-slate-300 hover:bg-slate-300 hover:text-slate-950 text-lg transition-all duration-200 ${
                        selectedIndex === history.length - 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Next &gt;
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <h1 className="text-xl md:text-3xl font-bold  text-center text-slate-900">
                  Invoice History
                </h1>
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Actions
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        INV No.
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Slip No.
                      </th>

                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Invoice ID
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Booking ID
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Booking Name
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Package
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Net Amount
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Total Paid{" "}
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Latest Credit
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Previous Paid
                      </th>

                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Due Amount
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Issued At
                      </th>
                      <th className="px-4 py-2 text-left text-gray-600 text-xs md:text-sm whitespace-nowrap">
                        Updated At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoices.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="py-4 px-4 text-center">
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      currentInvoices.map((entry) => (
                        <tr key={entry.id} className="border-b">
                          <td className="px-4 py-2 text-xs md:text-sm">
                            <button
                              onClick={() => handleView(entry)} // Call only with entry
                              className="py-1 px-2 m-1 rounded-lg bg-slate-100 text-rose-500 hover:bg-slate-800 hover:text-rose-500"
                            >
                              View
                            </button>

                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="py-1 px-2 m-1 rounded-lg bg-red-500 text-white hover:bg-rose-400"
                            >
                              Delete
                            </button>
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {entry.invoiceNumber || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {entry.slipNumber || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {truncateText(entry.bookingId, 8) || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {truncateText(entry.id, 8) || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {entry.bookingName || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {entry.packageName || "N/A"}
                          </td>
                          <td
                            className={`px-4 py-2 font-semibold text-gray-700 text-xs  text-center whitespace-nowrap md:text-sm ${getStatusClass(
                              entry.paymentStatus
                            )}`}
                          >
                            {entry.paymentStatus}
                          </td>

                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm text-center whitespace-nowrap">
                            $
                            {typeof entry.netAmount === "number"
                              ? entry.netAmount.toFixed(2)
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2  text-gray-700 text-xs md:text-sm text-center whitespace-nowrap">
                            $
                            {isNaN(Number(entry.totalPaidAmount))
                              ? "N/A"
                              : Number(entry.totalPaidAmount).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-green-700 text-xs md:text-sm text-center whitespace-nowrap">
                            {entry.creditedAmount
                              ? `+ $${Number(entry.creditedAmount).toFixed(2)}`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm text-center whitespace-nowrap">
                            $
                            {typeof entry.paidAmount === "number"
                              ? entry.paidAmount.toFixed(2)
                              : "N/A"}
                          </td>

                          <td
                            className={`px-4 py-2 text-gray-700 text-xs md:text-sm text-center whitespace-nowrap ${
                              entry.dueAmount > 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {entry.dueAmount > 0
                              ? `-$${Number(entry.dueAmount).toFixed(2)}`
                              : "Clear"}
                          </td>

                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {entry.dateIssued
                              ? new Date(
                                  entry.dateIssued.seconds * 1000
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }) +
                                ", " +
                                new Date(
                                  entry.dateIssued.seconds * 1000
                                ).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 text-gray-700 text-xs md:text-sm whitespace-nowrap">
                            {entry.createdAt
                              ? new Date(
                                  entry.createdAt.seconds * 1000
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }) +
                                ", " +
                                new Date(
                                  entry.createdAt.seconds * 1000
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

                <div className="flex bg-slate-100 border border-slate-200 justify-between items-center mt-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`py-2 px-4 rounded-lg font-semibold text-black ${
                      currentPage === 1
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-slate-800 hover:bg-rose-600"
                    }`}
                    aria-label={
                      currentPage === 1 ? "No previous page" : "Previous page"
                    }
                  >
                    &lt; Previous
                  </button>

                  <div className="border-l-2 border-r-2 border-l-slate-200 border-r-slate-200 mt-2 pr-10 pl-10">
                    <div className="flex items-center space-x-2">
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => setCurrentPage(1)}
                            className="py-2 px-3 rounded-lg bg-white text-gray-400 hover:bg-slate-400 hover:text-white"
                          >
                            1
                          </button>
                          <span className="text-gray-400">...</span>
                        </>
                      )}

                      {Array.from(
                        { length: Math.min(3, totalPages) },
                        (_, index) => {
                          const page = Math.max(1, currentPage - 1) + index;
                          if (page <= totalPages) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`py-2 px-3 border-slate-400 ${
                                  currentPage === page
                                    ? "border border-black bg-white text-slate-800"
                                    : "bg-white text-gray-400 hover:bg-slate-400 hover:text-white"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          }
                        }
                      )}

                      {currentPage < totalPages - 3 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`py-2 px-3 bg-white ${
                              currentPage === totalPages
                                ? "text-slate-400 cursor-not-allowed"
                                : "text-gray-400 hover:bg-slate-400 hover:text-white"
                            }`}
                            disabled={currentPage === totalPages}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`py-2 px-4 rounded-lg font-semibold text-black ${
                      currentPage === totalPages
                        ? "text-slate-400 cursor-not-allowed"
                        : "text-slate-800 hover:bg-rose-600"
                    }`}
                    aria-label={
                      currentPage === totalPages ? "No next page" : "Next page"
                    }
                  >
                    Next &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default InvoicehistoryView;
