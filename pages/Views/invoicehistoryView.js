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
  const safecurrentInvoices = currentInvoices || [];
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col flex-grow-0  bg-bgrnd-0 ">
        <div className="flex flex-grow flex-col items-center bg-bgrnd-0 py-1">
          <div className="w-full   bg-bgrnd-0  ">
            {selectedInvoice ? (
              <div className="flex justify-center items-center m-1 ">
                <div className="p-1  bg-bgrnd-0 text-black shadow-2xl rounded-lg  max-w-xl w-full">
                  <h2 className="text-xl bg-bgrnd-0 font-semibold mb-4 text-center text-hdline-0">
                    Invoice Details of{" "}
                    <span className=" text-violet-500">
                      {" "}
                      {selectedInvoice.bookingName}
                    </span>
                  </h2>
                  <div className="space-y-1 text-lg text-center bg-bgrnd-0 text-hdline-0 border border-violet-700">
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
                      <div className="flex bg-bgrnd-0 justify-between items-center my-2 py-2">
                    {/* Previous Button */}
                    <button
                      onClick={handlePrev}
                      disabled={selectedIndex === 0}
                      className={`py-3 px-6 ml-2 rounded-lg text-bttext-0 bg-btton-0 hover:bg-bttext-0 hover:text-btton-0 text-lg transition-all duration-200 ${
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
                      className="py-3 px-6 ml-2 rounded-lg text-red-500 font-semibold bg-bgrnd-0 text-lg transition-all duration-200"
                    >
                      Close
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={handleNext}
                      disabled={selectedIndex === history.length - 1}
                      className={`py-3 px-6 ml-2 rounded-lg text-bttext-0 bg-btton-0 hover:bg-bttext-0 hover:text-btton-0 text-lg transition-all duration-200 ${
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
              </div>
            ) : (
              <div className="overflow-x-auto">
                <h1 className="text-3xl font-ios p-2 font-bold  text-center text-hdline-0">
                  Invoice History
                </h1>
                <table className="min-w-full text-bttext-0 bg-bgrnd-0 border border-violet-400 rounded-lg shadow-md relative">
                  <thead>
                    <tr className="bg-bgrnd-0 border-b border-violet-500">
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Actions
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        INV No.
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Slip No.
                      </th>

                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Invoice ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Booking ID
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Booking Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Package
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Net Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Total Paid{" "}
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Latest Credit
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Previous Paid
                      </th>

                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Due Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Issued At
                      </th>
                      <th className="px-4 py-2 text-left text-xs  font-ios whitespace-nowrap">
                        Updated At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {safecurrentInvoices.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="py-4 px-4 text-center">
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      safecurrentInvoices.map((entry) => (
                        <tr key={entry.id} className="border-b border-violet-500 ">
                          <td className="px-4 py-2 text-xs bg-bgrnd-0 ">
                            <button
                              onClick={() => handleView(entry)} // Call only with entry
                              className="py-1 px-2 m-1 rounded-lg bg-btton-0 text-bttext-0 "
                            >
                              View
                            </button>

                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="py-1 px-2 m-1 rounded-lg text-rose-500"
                            >
                              Delete
                            </button>
                          </td>
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
                            {entry.invoiceNumber || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
                            {entry.slipNumber || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
                            {truncateText(entry.bookingId, 8) || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
                            {truncateText(entry.id, 8) || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
                            {entry.bookingName || "N/A"}
                          </td>
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
                            {entry.packageName || "N/A"}
                          </td>
                          <td
                            className={`px-4 py-2 font-semibold  text-xs  text-center whitespace-nowrap font-ios hover:text-btton-0 ${getStatusClass(
                              entry.paymentStatus
                            )}`}
                          >
                            {entry.paymentStatus}
                          </td>

                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 text-center whitespace-nowrap">
                            $
                            {typeof entry.netAmount === "number"
                              ? entry.netAmount.toFixed(2)
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2  text-slate-300 text-xs font-ios hover:text-btton-0 text-center whitespace-nowrap">
                            $
                            {isNaN(Number(entry.totalPaidAmount))
                              ? "N/A"
                              : Number(entry.totalPaidAmount).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-green-400 text-xs font-ios hover:text-btton-0 text-center whitespace-nowrap">
                            {entry.creditedAmount
                              ? `+ $${Number(entry.creditedAmount).toFixed(2)}`
                              : "N/A"}
                          </td>
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 text-center whitespace-nowrap">
                            $
                            {typeof entry.paidAmount === "number"
                              ? entry.paidAmount.toFixed(2)
                              : "N/A"}
                          </td>

                          <td
                            className={`px-4 py-2  text-xs font-ios hover:text-btton-0 text-center whitespace-nowrap ${
                              entry.dueAmount > 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {entry.dueAmount > 0
                              ? `-$${Number(entry.dueAmount).toFixed(2)}`
                              : "Clear"}
                          </td>

                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
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
                          <td className="px-4 py-2 text-slate-300 text-xs font-ios hover:text-btton-0 whitespace-nowrap">
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

                <div className="flex flex-grow w-screen bg-bgrnd-0 border border-violet-400 justify-between items-center mt-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 disabled:text-red-400   ${
                      currentPage === 1
                        ? "text-slate-800 cursor-not-allowed"
                        : "text-slate-200 hover:bg-violet-600"
                    }`}
                    aria-label={
                      currentPage === 1 ? "No previous page" : "Previous page"
                    }
                  >
                    &lt; Previous
                  </button>

                  <div className="border-l-2 border-r-2 border-l-violet-400 border-r-violet-400 mt-2 pr-10 pl-10">
                    <div className="flex items-center space-x-2">
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => setCurrentPage(1)}
  className="py-2 px-3 rounded-lg bg-bgrnd-0 text-hdline-0 hover:bg-bgrnd-0 hover:text-btton-0"                          >
                            1
                          </button>
                          <span className="text-violet-400">...</span>
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
                                className={`py-2 px-3 border-violet-400  ${
                                  currentPage === page
                                  ? "border border-violet-500 bg-bgrnd-0 text-hdline-0"
                            : "bg-bgrnd-0 text-scdry-0 hover:bg-bgrnd-0 hover:text-white"
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
                          <span className="text-violet-500">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className={`py-2 px-3 bg-bgrnd-0 ${
                              currentPage === totalPages
                                ? "text-slate-400 cursor-not-allowed"
                              : "text-gray-400 hover:bg-bgrnd-0 hover:text-white"
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
                className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 disabled:text-red-400 ${
                      currentPage === totalPages
                        ? "text-scdry-0 cursor-not-allowed"
                    : "text-hdline-0 hover:bg-violet-600"
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
