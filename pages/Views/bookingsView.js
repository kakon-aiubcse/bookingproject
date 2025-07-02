import React from "react";
import Header from "../component/header";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false });

const BookingsView = ({
  handleChange,
  handleSubmit,
  successMessage,
  error,
  formData,
  loading,
  setFormData,
  minDate,
}) => {
  const router = useRouter();
  return (
    <>
      <div className="xs:bg-bgrnd-0 xs:h-auto ">
        <Header />
        <div className="flex flex-col min-h-screen bg-bgrnd-0  overflow-hidden xs:h-full xs:relative xs:top-[-5px]">
          <div className="flex m-3 flex-grow flex-col items-center justify-center px-4 py-0  relative ">
            <div className="w-full max-w-2xl bg-bgrnd-0 p-4  rounded-lg shadow-md border border-violet-500  xs:items-center xs:justify-center">
              <h1 className="text-4xl font-ios p-4 font-semibold mb-4 text-center text-hdline-0 xs:text-2xl xs:w-fit xs:p-2 xs:relative xs:left-8">
                Create New Booking
              </h1>

              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-100 text-green-800 p-2 rounded-lg mb-3 text-center">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 text-red-800 p-2 rounded-lg mb-3 text-center">
                  {error}
                </div>
              )}

              {/* Booking Form */}
              {loading ? (
                <div className="flex items-center text-bttext-0 font-semibold">
                  <svg
                    className="w-20 h-20 flex items-center justify-center animate-spin mr-2 text-bttext-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 xs:flex xs:flex-col xs:items-center"
                >
                  <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start ">
                    <label
                      htmlFor="PackageName"
                      className="text-scdry-0 font-ios text-end pr-4 font-medium text-base flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start "
                    >
                      Package Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="packageName"
                      name="packageName"
                      value={formData?.packageName || ""}
                      onChange={handleChange}
                      className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm
                      xs:w-[275px] "
                      placeholder="Package name"
                      required
                    />
                  </div>

                  {/* Name */}
                  <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start">
                    <label
                      htmlFor="name"
                      className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                    >
                      Book by<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData?.name || ""}
                      autoFocus
                      onChange={handleChange}
                      className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm
                       xs:w-[275px]"
                      placeholder="Enter full name "
                      required
                    />
                  </div>

                  {/* Passport Number */}
                  <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start">
                    <label
                      htmlFor="passportNumber"
                      className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                    >
                      Passport Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="passportNumber"
                      name="passportNumber"
                      value={formData?.passportNumber || ""}
                      onChange={handleChange}
                      className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm
                       xs:w-[275px]"
                      placeholder="Enter passport number "
                      required
                    />
                  </div>

                  {/* Booking Date */}
                  <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start">
                    <label
                      htmlFor="validDate"
                      className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                    >
                      Booking Date<span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                      selected={formData?.validDate || ""}
                      onChange={(date) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          validDate: date,
                        }))
                      }
                      dateFormat="dd MMM yyyy"
                      className="flex-grow border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm
                       xs:w-[275px]"
                      placeholderText="Select booking date"
                      required
                      minDate={minDate} // Use the minDate prop from Booking component
                    />
                  </div>

                  {/* Net Amount */}
                  <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start">
                    <label
                      htmlFor="netAmount"
                      className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                    >
                      Net Amount ($)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="netAmount"
                      name="netAmount"
                      value={formData?.netAmount || ""}
                      onChange={handleChange}
                      className="flex-grow border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm
                       xs:w-[275px]"
                      placeholder="Enter net amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* Paid Amount */}
                  <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start">
                    <label
                      htmlFor="paidAmount"
                      className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                    >
                      Paid Amount ($)<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="paidAmount"
                      name="paidAmount"
                      value={formData?.paidAmount || ""}
                      onChange={handleChange}
                      className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm
                       xs:w-[275px]"
                      placeholder="Enter paid amount "
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center space-x-2 xs:flex-col xs:items-start xs:justify-start">
                    <label
                      htmlFor="paymentStatus"
                      className="text-scdry-0 font-ios text-end pr-4 font-medium text-sm flex-none w-40 xs:relative xs:left-2 xs:m-1  xs:text-start"
                    >
                      Payment Status<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={formData?.paymentStatus || ""}
                      onChange={handleChange}
                      className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm
                       xs:w-[275px]"
                      require
                      d
                      placeholder="Updated Status "
                      disabled
                    >
                      <option value="N/A" className="text-gray-500">
                        N/A
                      </option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Submit and Go Back Buttons */}
                  <div className="flex flex-col space-y-3 mt-4 p-2 xs:items-center xs:justify-center xs:relative  ">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-2 py-3 bg-btton-0 text-bttext-0 rounded-lg text-base font-semibold hover:bg-btton-0 transition duration-300 disabled:bg-rose-400
                    "
                    >
                      {loading ? "Submitting..." : "Create Booking"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="w-full py-2 px-3 rounded-md text-rose-500 bg-bgrnd-0"
                    >
                      Go Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BookingsView;
