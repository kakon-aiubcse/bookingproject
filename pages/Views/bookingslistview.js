import React from "react";
import { format } from "date-fns";

const BookingListView = ({
  handleViewInvoices,
  handleDelete,
  getStatusClass,
  handlePagination,
  truncateText,
  totalPages,
  error,
  bookings,
  currentBookingPage,
  currentInvoicePage,
  showInvoiceModal,
  selectedBookingId,
  selectedInvoices,
  totalInvoicePages,
  setShowInvoiceModal,
  setCurrentBookingPage,
  setCurrentInvoicePage,
  dropdownOpen,
  toggleInvoiceDropdown,
  handleDownload,
}) => {
  const safeBookings = bookings || [];
  return (
    <div className="flex flex-col  overflow-hidden">
      <div className="flex flex-grow  bg-gradient-to-b from-slate-100 to-slate-100 flex-col items-center mb-0">
        <div className="w-full max-w-8xl p-4  bg-gradient-to-b from-slate-100 to-slate-100 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-2xl text-center md:text-3xl font-bold m-6  text-black">
            Booking List
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {/* Bookings Table */}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Booking ID
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Package
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Name
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Passport Number
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Booking Date
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Net Amount
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Paid Amount
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Creation
                  </th>
                  <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeBookings.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-4 px-4 text-center">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  safeBookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        {truncateText(booking.id, 6)}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        {booking.packageName}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        {booking.name}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        {booking.passportNumber}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        {format(new Date(booking.validDate), "dd MMM yyyy")}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        ${Number(booking.netAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        ${Number(booking.paidAmount || 0).toFixed(2)}
                      </td>
                      <td
                        className={`px-2 py-2 font-semibold text-gray-700 text-xs md:text-sm ${getStatusClass(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus}
                      </td>
                      <td className="px-2 py-2 text-gray-700 text-xs md:text-sm">
                        {format(
                          new Date(booking.createdAt.seconds * 1000),
                          "dd MMM yyyy, HH:mm:ss a"
                        )}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-xs text-right md:text-sm relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => toggleInvoiceDropdown(booking.id)}
                            className="text-amber-800 hover:text-amber-600 text-xs md:text-sm mr-2 md:mr-4 flex items-center justify-center"
                          >
                            <img
                              src="/dropicon.png"
                              alt="Dropdown Icon"
                              className="h-4 w-5 hover:border hover:border-slate-100" // Adjust size as needed
                            />
                          </button>

                          {dropdownOpen && selectedBookingId === booking.id && (
                            <div className="origin-top-right absolute right-9 top-1/2 transform -translate-y-1/2 mt-0 w-24 rounded-lg shadow-lg bg-white border border-gray-300 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleViewInvoices(booking.id)}
                                  className="block w-full text-left px-3 py-1 text-gray-800 hover:bg-blue-100"
                                >
                                  Invoices
                                </button>
                                <button
                                  onClick={() => handleDownload(booking.id)}
                                  className="block w-full text-left px-3 py-1 text-gray-800 hover:bg-blue-100"
                                >
                                  Receipt
                                </button>
                                <button
                                  onClick={() => handleDelete(booking.id)}
                                  className="block w-full text-left px-3 py-1 text-red-600 hover:bg-red-100"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls for Bookings */}
          <div className="flex bg-slate-100 border border-slate-200 justify-between items-center mt-2 ">
            <button
              onClick={() => handlePagination("prev", "bookings")}
              disabled={currentBookingPage === 1}
              className={`py-2 px-4 rounded-lg font-semibold text-black ${
                currentBookingPage === 1
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-slate-800 hover:bg-amber-600"
              }`}
              aria-label={
                currentBookingPage === 1 ? "No previous page" : "Previous page"
              }
            >
              &lt; Previous
            </button>

            <div className="border-l-2 border-r-2 border-l-slate-200 border-r-slate-200 mt-2 mb-2 pr-10 pl-10">
              <div className="flex items-center space-x-2">
                {currentBookingPage > 3 && (
                  <>
                    <button
                      onClick={() => setCurrentBookingPage(1)}
                      className="py-2 px-3 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-400 hover:text-white"
                    >
                      1
                    </button>
                    <span>...</span>
                  </>
                )}

                {Array.from(
                  {
                    length: Math.min(3, totalPages),
                    start: Math.max(1, currentBookingPage - 1),
                  },
                  (_, index) => {
                    const page = Math.max(1, currentBookingPage - 1) + index;
                    if (page <= totalPages) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentBookingPage(page)}
                          className={`py-2 px-3 border-slate-400 ${
                            currentBookingPage === page
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

                {currentBookingPage < totalPages - 3 && (
                  <>
                    <span>...</span>
                    <button
                      onClick={() => setCurrentBookingPage(totalPages)}
                      className={`py-2 px-3 bg-white ${
                        currentBookingPage === totalPages
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-gray-400 hover:bg-slate-400 hover:text-white"
                      }`}
                      disabled={currentBookingPage === totalPages}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={() => handlePagination("next", "bookings")}
              disabled={currentBookingPage === totalPages}
              className={`py-2 px-4 rounded-lg font-semibold text-black ${
                currentBookingPage === totalPages
                  ? "text-slate-400 cursor-not-allowed"
                  : "text-slate-800 hover:bg-amber-600"
              }`}
              aria-label={
                currentBookingPage === totalPages ? "No next page" : "Next page"
              }
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>{" "}
      {showInvoiceModal && (
        <div className=" min-w-full  fixed inset-0 bg-slate-500 bg-opacity-80 flex justify-center items-center">
          <div className="min-w-full border border-slate-900 bg-slate-100 text-black p-4 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl text-center text-black bg-amber-500 font-semibold mb-2 border-b border-slate-300 pb-2">
              Invoices for{" "}
              {selectedBookingId
                ? selectedInvoices.length > 0
                  ? selectedInvoices[0].bookingName || "No Booking Name Found"
                  : bookings.find((booking) => booking.id === selectedBookingId)
                      ?.name || "No Booking Name Found"
                : "Loading..."}
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full text-black bg-white border border-slate-400 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-slate-400 border-b border-gray-300">
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Invoice No.
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Slip No.
                    </th>

                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Invoice_ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Net Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Total Paid
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Latest Credit
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Previous Paid
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Due Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs md:text-sm whitespace-nowrap">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="py-4 px-4 text-center">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    selectedInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="border-b border-slate-200 hover:bg-slate-200"
                      >
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                          {invoice.slipNumber}
                        </td>

                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                          {truncateText(invoice.id, 6)}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                          $
                          {typeof invoice.netAmount === "number"
                            ? invoice.netAmount.toFixed(2)
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                          $
                          {isNaN(Number(invoice.totalPaidAmount))
                            ? "N/A"
                            : Number(invoice.totalPaidAmount).toFixed(2)}
                        </td>
                        <td
                          className={`px-4 py-2 text-xs md:text-sm whitespace-nowrap ${
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
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap">
                          $
                          {typeof invoice.paidAmount === "number"
                            ? invoice.paidAmount.toFixed(2)
                            : "N/A"}
                        </td>
                        <td
                          className={`px-4 py-2 text-xs md:text-sm whitespace-nowrap ${
                            Number(invoice.dueAmount) > 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {Number(invoice.dueAmount) > 0
                            ? `-$${Number(invoice.dueAmount).toFixed(2)}`
                            : "Clear"}
                        </td>
                        <td
                          className={`px-2 py-1 font-semibold text-xs md:text-sm ${getStatusClass(
                            invoice.paymentStatus
                          )}`}
                        >
                          {invoice.paymentStatus}
                        </td>
                        <td className="px-4 py-2 text-xs md:text-sm whitespace-nowrap">
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

            {/* Pagination Controls for Invoices */}
            <div className="flex bg-slate-100 border border-slate-200 justify-between items-center mt-2">
              <button
                onClick={() => handlePagination("prev", "invoices")}
                disabled={currentInvoicePage === 1}
                className={`py-2 px-4 rounded-lg font-semibold text-slate-900 disabled:text-slate-400  ${
                  currentInvoicePage === 1 ? "cursor-not-allowed" : ""
                }`}
                aria-label={
                  currentInvoicePage === 1
                    ? "No previous page"
                    : "Previous page"
                }
              >
                &lt; Previous
              </button>

              <div className="border-l-2 border-r-2 border-l-slate-200 border-r-slate-200 mt-2 pr-10 pl-10">
                <div className="flex items-center space-x-2">
                  {totalInvoicePages > 0 && currentInvoicePage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentInvoicePage(1)}
                        className="py-2 px-3 rounded-lg bg-white text-gray-400 hover:bg-slate-400 hover:text-white"
                        aria-label="Go to first page"
                      >
                        1
                      </button>
                      <span className="text-slate-400">...</span>
                    </>
                  )}

                  {Array.from({ length: totalInvoicePages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentInvoicePage(page)}
                        className={`py-2 px-3 border-slate-400 ${
                          currentInvoicePage === page
                            ? "border border-black bg-white text-slate-800"
                            : "bg-white text-gray-400 hover:bg-slate-400 hover:text-white"
                        }`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {totalInvoicePages > 0 &&
                    currentInvoicePage < totalInvoicePages - 2 && (
                      <>
                        <span className="text-gray-400">...</span>
                        <button
                          onClick={() =>
                            setCurrentInvoicePage(totalInvoicePages)
                          }
                          className={`py-2 px-3 bg-white ${
                            currentInvoicePage === totalInvoicePages
                              ? "text-slate-400 cursor-not-allowed"
                              : "text-gray-400 hover:bg-slate-400 hover:text-white"
                          }`}
                          disabled={currentInvoicePage === totalInvoicePages}
                          aria-label={`Go to last page (${totalInvoicePages})`}
                        >
                          {totalInvoicePages}
                        </button>
                      </>
                    )}
                </div>{" "}
              </div>

              <button
                onClick={() => handlePagination("next", "invoices")}
                disabled={
                  currentInvoicePage === totalInvoicePages ||
                  totalInvoicePages === 0
                }
                className={`py-2 px-4 rounded-lg font-semibold text-slate-900 disabled:text-slate-400 ${
                  currentInvoicePage === totalInvoicePages
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-800 hover:bg-amber-600"
                }`}
                aria-label={
                  currentInvoicePage === totalInvoicePages ||
                  totalInvoicePages === 0
                    ? "No next page"
                    : "Next page"
                }
              >
                Next &gt;
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="bg-slate-500 text-amber-500 py-1 px-4 rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => router.push("/updateinvoice")}
                className="bg-amber-500 text-white py-1 px-4 rounded hover:bg-amber-600 ml-4"
              >
                Update Invoices
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default BookingListView;
