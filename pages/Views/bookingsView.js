import React from "react";
import Header from "../component/header";

const BookingsView = ({
  handleChange,
  handleSubmit,
  successMessage,
  error,
  formData,
  DatePicker,
  loading,
  setFormData,
  minDate,
}) => {
  return (
    <>
      <div>
        <Header />
        <div className="flex flex-col min-h-10 bg-gradient-to-b from-slate-100 to-slate-100 overflow-hidden">
          <div className="flex m-3 flex-grow flex-col items-center justify-center px-4 py-0 sm:py-6">
            <div className="w-full max-w-2xl bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
              <h1 className="text-2xl sm:text-2xl font-semibold mb-4 text-center text-gray-900">
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
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="PackageName"
                    className="text-gray-700 font-medium text-sm flex-none w-40"
                  >
                    Package Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="packageName"
                    name="packageName"
                    value={formData.packageName || ""}
                    onChange={handleChange}
                    className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Package name"
                    required
                  />
                </div>
                {/* Name */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="name"
                    className="text-gray-700 font-medium text-sm flex-none w-40"
                  >
                    Book by<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    autoFocus
                    onChange={handleChange}
                    className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Passport Number */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="passportNumber"
                    className="text-gray-700 font-medium text-sm flex-none w-40"
                  >
                    Passport Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="passportNumber"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter passport number"
                    required
                  />
                </div>

                {/* Booking Date */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="validDate"
                    className="text-gray-700 font-medium text-sm flex-none w-40"
                  >
                    Booking Date<span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={formData.validDate}
                    onChange={(date) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        validDate: date,
                      }))
                    }
                    dateFormat="dd MMM yyyy"
                    className="flex-grow border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholderText="Select boking date"
                    required
                    minDate={minDate} // Use the minDate prop from Booking component
                  />
                </div>

                {/* Net Amount */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="netAmount"
                    className="text-gray-700 font-medium text-sm flex-none w-40"
                  >
                    Net Amount ($)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="netAmount"
                    name="netAmount"
                    value={formData.netAmount}
                    onChange={handleChange}
                    className="flex-grow border border-gray-200 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter net amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Paid Amount */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="paidAmount"
                    className="text-gray-700 font-medium text-sm flex-none w-40"
                  >
                    Paid Amount ($)<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="paidAmount"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    placeholder="Enter paid amount"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                {/* Payment Status */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="paymentStatus"
                    className="text-gray-700 font-medium text-sm flex-none w-40"
                  >
                    Payment Status<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paymentStatus"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleChange}
                    className="flex-grow border border-gray-300 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                    required
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
                <div className="flex flex-col space-y-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-2 py-2 bg-rose-600 text-white rounded-lg text-base font-semibold hover:bg-rose-700 transition duration-300 disabled:bg-amber-400"
                  >
                    {loading ? "Submitting..." : "Create Booking"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full py-2 px-3 rounded-md text-white bg-gray-500 hover:bg-gray-600"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BookingsView;
