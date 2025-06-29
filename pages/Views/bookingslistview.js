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
  setDropdownOpen,
  toggleInvoiceDropdown,
  handleDownload,
}) => {
  const safeBookings = bookings || [];
  return (
    <div className="flex flex-col h-auto overflow-hidden">
      <div className="flex flex-grow  bg-bgrnd-0 flex-col items-center mb-0">
        <div className="w-full min-h-screen p-4  bg-bgrnd-0">
          <h2 className="text-4xl text-center font-ios font-bold m-6  text-hdline-0">
            Booking Lists{" "}
            <span className="text-btton-0 relative right-2">.</span>
          </h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          {/* Bookings Table */}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-bgrnd-0 space-y-10 gap-10 rounded-lg shadow-md">
              <thead>
                <tr className="bg-bgrnd-0 ">
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Booking ID
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Package
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Name
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Passport Number
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Booking Date
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Net Amount
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Paid Amount
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Creation
                  </th>
                  <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeBookings.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="py-4 px-4 text-hdline-0 text-center">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  safeBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-btton-0  border-b-[0.1px]"
                    >
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        {truncateText(booking.id, 6)}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        {booking.packageName}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        {booking.name}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        {booking.passportNumber}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        {format(new Date(booking.validDate), "dd MMM yyyy")}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        ${Number(booking.netAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        ${Number(booking.paidAmount || 0).toFixed(2)}
                      </td>
                      <td
                        className={`px-2 py-6 font-semibold font-ios text-xs  ${getStatusClass(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs ">
                        {format(
                          new Date(booking.createdAt.seconds * 1000),
                          "dd MMM yyyy, HH:mm:ss a"
                        )}
                      </td>
                      <td className="px-4 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs text-right  relative">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => toggleInvoiceDropdown(booking.id)}
                            className=" text-xs mr-2  flex items-center justify-center"
                          >
                            <img
                              src="/dropicon.png"
                              alt="Dropdown Icon"
                              className="h-4 w-5 " // Adjust size as needed
                            />
                          </button>

                          {dropdownOpen && selectedBookingId === booking.id && (
                            <div className="origin-top-right absolute right-8 top-1/2 transform -translate-y-1/2 mt-0 w-24 rounded-lg shadow-lg bg-bgrnd-0 z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleViewInvoices(booking.id);
                                    setDropdownOpen(false);
                                  }}
                                  className="block w-full font-ios text-left px-3 py-1 text-gray-200 hover:text-slate-200 bg-btton-0"
                                >
                                  Invoices
                                </button>
                                <button
                                  onClick={() => {
                                    handleDownload(booking.id);
                                    setDropdownOpen(false);
                                  }}
                                  className="block w-full font-ios text-left px-3 py-1 text-gray-200 hover:text-slate-200 bg-btton-0"
                                >
                                  Receipt
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(booking.id);
                                    setDropdownOpen(false);
                                  }}
                                  className="block w-full bg-btton-0 font-ios text-left px-3 py-1 text-red-600  hover:text-red-600"
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
          <div className="flex bg-bgrnd-0 border border-violet-400 justify-between items-center mt-2 relative top-5 mb-10 ">
            <button
              onClick={() => handlePagination("prev", "bookings")}
              disabled={currentBookingPage === 1}
              className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 ${
                currentBookingPage === 1
                  ? "text-scdry-0 cursor-not-allowed"
                  : "text-hdline-0 hover:bg-violet-600"
              }`}
              aria-label={
                currentBookingPage === 1 ? "No previous page" : "Previous page"
              }
            >
              &lt; Previous
            </button>

            <div className="border-l-2 border-r-2 border-l-violet-400 border-r-violet-400 mt-2 mb-2 pr-10 pl-10">
              <div className="flex items-center space-x-2">
                {currentBookingPage > 3 && (
                  <>
                    <button
                      onClick={() => setCurrentBookingPage(1)}
                      className="py-2 px-3 rounded-lg bg-bgrnd-0 text-hdline-0  hover:text-btton-0"
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
                          className={`py-2 px-3 border-violet-400 ${
                            currentBookingPage === page
                              ? "border border-violet-400 bg-bgrnd-0 text-hdline-0"
                              : "bg-bgrnd-0 text-gray-400 "
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
                      className={`py-2 px-3 bg-bgrnd-0 ${
                        currentBookingPage === totalPages
                          ? "text-slate-400 cursor-not-allowed"
                          : "text-bttext-0 hover:bg-bgrnd-0 hover:text-white"
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
              className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 ${
                currentBookingPage === totalPages
                ? "text-scdry-0 cursor-not-allowed"
                  : "text-hdline-0 hover:bg-violet-600"
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
        <div className=" min-w-full  fixed inset-0 bg-bgrnd-0 bg-opacity-80 flex justify-center items-center">
          <div className="min-w-full bg-bgrnd-0 text-hdline-0 p-4 rounded-lg shadow-lg w-full max-w-2xl">
            <h2 className="text-xl text-center text-hdline-0 bg-bgrnd-0 font-semibold mb-2 border-b border-violet-300 pb-2">
              Invoices for{" "}
            <span className="text-btton-0 font-ios text-2xl">
                {selectedBookingId
                ? selectedInvoices.length > 0
                  ? selectedInvoices[0].bookingName || "No Booking Name Found"
                  : bookings.find((booking) => booking.id === selectedBookingId)
                      ?.name || "No Booking Name Found"
                : "Loading..."}
            </span>
            </h2>

            <div className="overflow-x-auto relative top-3">
              <table className="min-w-full text-bttext-0 bg-bgrnd-0 border border-violet-400 rounded-lg shadow-md relative ">
                <thead>
                  <tr className="bg-bgrnd-0 border-b border-violet-300">
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Invoice No.
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Slip No.
                    </th>

                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Invoice_ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Net Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Total Paid
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Latest Credit
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Previous Paid
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Due Amount
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs  whitespace-nowrap">
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
                        className="border-b border-violet-500 hover:bg-bgrnd-0"
                      >
                        <td className="px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap">
                          {invoice.slipNumber}
                        </td>

                        <td className="px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap">
                          {truncateText(invoice.id, 6)}
                        </td>
                        <td className="px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap">
                          $
                          {typeof invoice.netAmount === "number"
                            ? invoice.netAmount.toFixed(2)
                            : "N/A"}
                        </td>
                        <td className="px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap">
                          $
                          {isNaN(Number(invoice.totalPaidAmount))
                            ? "N/A"
                            : Number(invoice.totalPaidAmount).toFixed(2)}
                        </td>
                        <td
                          className={`px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap ${
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
                        <td className="px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap">
                          $
                          {typeof invoice.paidAmount === "number"
                            ? invoice.paidAmount.toFixed(2)
                            : "N/A"}
                        </td>
                        <td
                          className={`px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap ${
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
                          className={`px-2 py-1 font-semibold text-xs  ${getStatusClass(
                            invoice.paymentStatus
                          )}`}
                        >
                          {invoice.paymentStatus}
                        </td>
                        <td className="px-4 py-2 hover:text-btton-0 text-xs  whitespace-nowrap">
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
            <div className="flex bg-bgrnd-0 border border-violet-400 justify-between items-center mt-2">
              <button
                onClick={() => handlePagination("prev", "invoices")}
                disabled={currentInvoicePage === 1}
                className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 disabled:text-red-400  ${
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

              <div className="border-l-2 border-r-2 border-l-violet-400 border-r-violet-400 mt-2 pr-10 pl-10">
                <div className="flex items-center space-x-2">
                  {totalInvoicePages > 0 && currentInvoicePage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentInvoicePage(1)}
                        className="py-2 px-3 rounded-lg bg-bgrnd-0 text-hdline-0 hover:bg-bgrnd-0 hover:text-btton-0"
                        aria-label="Go to first page"
                      >
                        1
                      </button>
                      <span className="text-violet-400">...</span>
                    </>
                  )}

                  {Array.from({ length: totalInvoicePages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentInvoicePage(page)}
                        className={`py-2 px-3 border-violet-400 ${
                          currentInvoicePage === page
                            ? "border border-violet-500 bg-bgrnd-0 text-hdline-0"
                            : "bg-bgrnd-0 text-scdry-0 hover:bg-bgrnd-0 hover:text-white"
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
                        <span className="text-violet-500">...</span>
                        <button
                          onClick={() =>
                            setCurrentInvoicePage(totalInvoicePages)
                          }
                          className={`py-2 px-3 bg-bgrnd-0 ${
                            currentInvoicePage === totalInvoicePages
                              ? "text-slate-400 cursor-not-allowed"
                              : "text-gray-400 hover:bg-bgrnd-0 hover:text-white"
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
                className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 disabled:text-red-400 ${
                  currentInvoicePage === totalInvoicePages
                    ? "text-scdry-0 cursor-not-allowed"
                    : "text-hdline-0 hover:bg-bgrnd-0"
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
                className="bg-btton-0 text-bttext-0 py-1 px-4 rounded "
              >
                Close
              </button>
              <button
                onClick={() => router.push("/updateinvoice")}
                className="bg-btton-0 text-bttext-0 py-1 px-4 rounded hover:bg-amber-600 ml-4"
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
