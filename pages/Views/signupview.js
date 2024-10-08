import React from "react";
import { useRouter } from "next/router";

const SignupView = ({
  handleSubmit,
  handleChange,
  formData,
  message,
  errors,
  loading,
  toggleShowPassword,
  showPassword,
  onProfileImageChange,
}) => {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col overflow-hidden  justify-center items-center"
      style={{
        minHeight: "100vh", // This will ensure the page height fills the full viewport
        backgroundImage: "url('/signuppic.jpg')",
        backgroundSize: "cover", // Ensures the image covers all sides
        backgroundPosition: "center", // Keeps the image centered
      }}
    >
      {/* Blurry background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-3xl"></div>
      <div className="relative z-10 max-w-5xl mb-24 h-[548px] w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        <div className="flex md:flex-row flex-col h-[557px] ">
          {/* Left side - Sign Up Information */}
          <div className="md:w-1/2 relative bg-[url('/signuppic.jpg')] bg-cover bg-center p-10 text-white flex flex-col justify-center items-center">
            {/* Softer overlay for subtle blur and semi-transparency */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* Text content */}
            <div className="relative z-10 font-mono font-extralight text-center">
              <h2 className="text-4xl font-bold m-10">
                Join this platform
                <label className="text-rose-500 text-4xl">!</label>
              </h2>
              <p className="mb-8 mt-5 text-base font-sans">
                Sign up now to access exclusive features, manage bookings, view
                invoices, and much more.
              </p>
              <p className="text-xs">
                Already have an account?
                <button
                  onClick={() => router.push("/login")}
                  className="ml-2 text-[20px] text-rose-500 bg-slate-200 font-semibold hover:bg-slate-500 hover:text-rose-500"
                >
                  Log In Now!
                </button>
              </p>
            </div>
          </div>

          {/* Right side - Sign Up Form */}
          <div className="md:w-1/2 p-8 flex flex-col justify-center relative z-20 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Register your account.
            </h2>

            <h3 className="mt-1 text-sm font-light text-gray-400 mb-2 text-left">
              Start exploring by registering your information:
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your Name"
                  className={`w-full border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600`}
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-2">{errors.name}</p>
                )}
              </div>

              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your Email"
                  className={`w-full border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600`}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-2">{errors.email}</p>
                )}
              </div>

              {/* Mobile Input */}
              <div className="relative">
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="Enter your Phone Number"
                  className={`w-full border ${
                    errors.mobile ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600`}
                />
                {errors.mobile && (
                  <p className="text-red-600 text-xs mt-2">{errors.mobile}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your Password"
                  className={`w-full border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600`}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  <img
                    src={showPassword ? "/eyeicon.svg" : "/eyeblindicon.svg"}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    className="w-5 h-5 text-gray-500"
                  />
                </button>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-2">{errors.password}</p>
                )}
              </div>

              {/* image uploading*/}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  Select Picture:
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    onProfileImageChange(event);
                    console.log("File input changed:", event.target.files[0]); // Check the file
                  }}
                  className="inline-block text-sm text-gray-500 border border-slate-300
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-white file:text-black
    hover:file:bg-white-600 hover:file:text-black
    focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50
    transition duration-150 ease-in-out"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-5 rounded-lg text-white font-semibold transition-colors duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-rose-500 hover:bg-slate-500 hover:text-rose-500"
                }`}
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              {message && (
                <p className="text-slate-600 text-center mt-4">{message}</p>
              )}

              <div className="flex items-center justify-center space-x-2 mt-2 text-gray-600">
                <span>Or, Signup with</span>
                <div className="flex space-x-2">
                  <button className="flex border-b border-rose-500 px-2 py-1 rounded-lg hover:bg-gray-500 hover:text-rose-500 transition">
                    <img
                      src="/facebookicon.svg"
                      alt="Facebook"
                      className="w-5 h-5 mr-2"
                    />
                  </button>
                  <button className="flex border-b border-rose-500 px-2 py-1 rounded-lg hover:bg-gray-500 hover:text-rose-500 transition">
                    <img
                      src="/googleicon.svg"
                      alt="Google"
                      className="w-5 h-5 mr-2"
                    />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupView;
