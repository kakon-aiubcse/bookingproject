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
        <div className="flex flex-col h-auto overflow-hidden">
      <div className="flex flex-grow  bg-bgrnd-0 flex-col items-center mb-0">
        <div className="w-full min-h-screen p-4  bg-bgrnd-0">
          <h2 className="text-4xl text-center font-ios font-bold m-6  text-hdline-0">
          Invoice Lists{" "}
            <span className="text-btton-0 relative right-2">.</span>
          </h2>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center">
                {error}
              </div>
            )}

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-bgrnd-0 space-y-10 gap-10 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-bgrnd-0">
                    {/* Table headers */}
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      INV No.
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Bookie ID
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Bookie Name
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Package Name
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Issued At
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Status
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Net Amount
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Total Paid
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Due
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Updated At
                    </th>
                    <th className="px-2 py-2 text-left text-hdline-0 font-ios text-xs">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {safeinvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
                        {truncateText(invoice.bookingId, 6)}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
                        {bookings[invoice.bookingId] || "N/A"}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
                        {invoice.packageName}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
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
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
                        $
                        {invoice.netAmount
                          ? Number(invoice.netAmount).toFixed(2)
                          : "N/A"}
                      </td>
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
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
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
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
                      <td className="px-2 py-6 text-slate-200 font-ios hover:text-btton-0 text-xs">
                        <button
                          onClick={() =>
                            router.push(`/Controller/editinvoice/${invoice.id}`)
                          }
                          className="text-btton-0 hover:text-violet-600 text-xs  mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(invoice.id, invoice.invoiceNumber)
                          }
                          className="text-red-500 hover:text-red-600 text-xs "
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
            <div className="flex bg-bgrnd-0 border border-violet-400 justify-between items-center mt-2 relative top-5 mb-10 
            xs:w-[350px] xs:space-x-14 xs:justify-normal">
              <button
                onClick={() => handlePagination("prev", "invoices")}
                disabled={currentPage === 1}
                className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 xs:font-extralight xs:text-base xs:px-1 xs:py-4 ${
                  currentPage === 1
                    ? "text-scdry-0 cursor-not-allowed"
                    : "text-hdline-0 hover:bg-violet-600"
                }`}
                aria-label={
                  currentPage === 1 ? "No previous page" : "Previous page"
                }
              >
                &lt; Previous
              </button>

              <div className="border-l-2 border-r-2 border-l-violet-400 border-r-violet-400 my-2 px-10 xs:px-0 xs:my-0">
                <div className="flex items-center space-x-2 xs:space-x-2">
                  {currentPage > 3 && (
                    <>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className="py-2 px-3 rounded-lg bg-bgrnd-0 text-hdline-0  hover:text-btton-0"
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
                            className={`py-2 px-3 border-violet-400  xs:py-0 xs:px-0 ${
                              currentPage === page
                                ? "border border-violet-400 bg-bgrnd-0 text-hdline-0"
                                : "bg-bgrnd-0 text-gray-400"
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
                      <span >...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`py-2 px-3 bg-bgrnd-0 xs:px-0 ${
                          currentPage === totalPages
                             ? "text-slate-400 cursor-not-allowed"
                          : "text-bttext-0 hover:bg-bgrnd-0 hover:text-white"
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
                className={`py-2 px-4 rounded-lg font-semibold text-hdline-0 xs:py-0 xs:px-0 xs:font-extralight xs:text-base ${
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
        </div>
      </div>
    </>
  );
};
export default UpdateinvoiceView;
