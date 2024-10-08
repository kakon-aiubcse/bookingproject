import React from "react";
import { useRouter } from "next/router";
const UpdateinvoiceView = ({
  error,
  truncateText,
  handleDelete,
  getStatusClass,
  totalPages,
  currentInvoices,
  bookings,
  currentPage,
  setCurrentPage,
  handlePagination,
}) => {
  const router = useRouter();
  const safeinvoices = currentInvoices || [];
  return (
    <>
      <div className="flex flex-grow  bg-gradient-to-b from-slate100 to-slate-100 flex-col items-center mb-0">
        <div className="w-full max-w-8xl p-1  bg-gradient-to-b from-slate100 to-slate-100 rounded-lg shadow-lg ">
          <div className="w-full max-w-8xl p-3  bg-gradient-to-b from-slate100 to-slate-100 rounded-lg shadow-lg ">
            <h2 className="text-2xl text-center md:text-3xl font-bold m-6  text-slate-900">
              Invoice List
            </h2>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    {/* Table headers */}
                    <th className="px-2 py-2 text-left text-gray-600 text-xs md:text-sm">
                      INV No.
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Bookie ID
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Bookie Name
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Package Name
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Issued At
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Status
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Net Amount
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Total Paid
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Due
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Updated At
                    </th>
                    <th className="px-2 py-2  text-left text-gray-600 text-xs md:text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {safeinvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        {truncateText(invoice.bookingId, 6)}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        {bookings[invoice.bookingId] || "N/A"}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        {invoice.packageName}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        {invoice.dateIssued
                          ? new Date(invoice.dateIssued).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>
                      <td
                        className={`px-2 py-2  text-gray-700 font-semibold text-xs md:text-sm ${getStatusClass(
                          invoice.paymentStatus
                        )}`}
                      >
                        {invoice.paymentStatus}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        $
                        {invoice.netAmount
                          ? Number(invoice.netAmount).toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        $
                        {isNaN(Number(invoice.totalPaidAmount))
                          ? "N/A"
                          : Number(invoice.totalPaidAmount).toFixed(2)}
                      </td>
                      <td
                        className={`px-2 py-2  text-xs md:text-sm ${
                          invoice.dueAmount > 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {invoice.dueAmount > 0
                          ? `-$${Number(invoice.dueAmount).toFixed(2)}`
                          : "Clear"}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        {invoice.updatedAt
                          ? new Date(invoice.updatedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            ) +
                            ", " +
                            new Date(invoice.updatedAt).toLocaleTimeString(
                              "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )
                          : "N/A"}
                      </td>
                      <td className="px-2 py-2  text-gray-700 text-xs md:text-sm">
                        <button
                          onClick={() =>
                            router.push(`/Controller/editinvoice/${invoice.id}`)
                          }
                          className="text-amber-500 hover:text-rose-600 text-xs md:text-sm mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(invoice.id, invoice.invoiceNumber)
                          }
                          className="text-red-500 hover:text-red-600 text-xs md:text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex bg-slate-100 border border-slate-200 justify-between items-center mt-2 ">
              <button
                onClick={() => handlePagination("prev", "invoices")}
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

              <div className="border-l-2 border-r-2 border-l-slate-200 border-r-slate-200 mt-2 mb-2 pr-10 pl-10">
                <div className="flex items-center space-x-2">
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="py-2 px-3 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-400 hover:text-white"
                      >
                        1
                      </button>
                      <span>...</span>
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
                                ? "border border-black bg-slate-100 text-slate-800"
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
                      <span>...</span>
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
                onClick={() => handlePagination("next", "invoices")}
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
        </div>
      </div>
    </>
  );
};
export default UpdateinvoiceView;
