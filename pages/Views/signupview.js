import React from "react";
import { useRouter } from "next/router";

const SignupView = ({
  handleSubmit,
  handleChange,
  formData = {
    name: "",
    email: "",
    mobile: "",
    password: "",
  },
  message,
  errors,
  loading,
  toggleShowPassword,
  showPassword,
  onProfileImageChange,
}) => {
  const router = useRouter();

  return (
    <div className="rrelative flex flex-col  w-screen pb-32 justify-center items-center bg-bgrnd-0 h-dvh">
      <div className="relative  w-full bg-bgrnd-0  flex flex-row">
        {/* Left side - Sign Up Information */}{" "}
        <div className="px-32 w-1/2 flex flex-col justify-center relative rounded-lg top-5">
          <h2 className="text-4xl font-semibold text-hdline-0 mb-4 text-center">
            User Registration.
          </h2>

          <h3 className="mt-1 text-lg font-base  text-scdry-0 mb-2 text-left">
            Start exploring by registering your data:
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
                required
                placeholder="Enter your Name"
                className={`w-full border ${
                  errors?.name ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600`}
              />
              {errors?.name && (
                <p className="text-red-600 text-xs mt-2">{errors?.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
                required
                placeholder="Enter your Email"
                className={`w-full border ${
                  errors?.email ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600`}
              />
              {errors?.email && (
                <p className="text-red-600 text-xs mt-2">{errors?.email}</p>
              )}
            </div>

            {/* Mobile Input */}
            <div className="relative">
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData?.mobile || ""}
                onChange={handleChange}
                required
                placeholder="Enter your Phone Number"
                className={`w-full border ${
                  errors?.mobile ? "border-red-500" : "border-gray-300"
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600`}
              />
              {errors?.mobile && (
                <p className="text-red-600 text-xs mt-2">{errors?.mobile}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData?.password || ""}
                onChange={handleChange}
                required
                placeholder="Enter your Password"
                className={`w-full border ${
                  errors?.password ? "border-red-500" : "border-gray-300"
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
              {errors?.password && (
                <p className="text-red-600 text-xs mt-2">{errors?.password}</p>
              )}
            </div>

            {/* image uploading*/}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-hdline-0 font-ios ">
                Select Picture:
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  onProfileImageChange(event);
                  console.log("File input changed:", event.target.files[0]); // Check the file
                }}
                className="inline-block text-sm text-gray-500 border border-btton-0 rounded-md
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-btton-0 file:text-bttext-0
              
                
                transition duration-150 ease-in-out"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-5 rounded-lg text-white font-semibold transition-colors duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-btton-0 hover:bg-violet-600 "
              }`}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {message && (
              <p className="text-slate-600 text-center mt-4">{message}</p>
            )}
            <div className="text-base font-ios text-scdry-0 font-medium">
              Already have an account?
              <button
                onClick={() => router.push("/login")}
                  className="ml-2 mt-2 text-[20px] text-btton-0  font-medium font-ios hover:underline"
              >
                Log in.
              </button>
            </div>
          </form>
        </div>{" "}
        {/* Right side - Sign Up Form */}
        <div className=" relative w-1/2 p-10 flex flex-col justify-center items-center">
          <svg
            width="300"
            height="300"
            viewBox="0 0 1024 1024"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <circle cx="512" cy="512" r="500" fill="#16161a" />
            <path
              d="M512 272c66.3 0 120 53.7 120 120s-53.7 120-120 120-120-53.7-120-120 53.7-120 120-120zm0 352c110.5 0 200 89.5 200 200H312c0-110.5 89.5-200 200-200z"
              fill="#3B82F6"
            />
            <path
              d="M512 456v64h64v32h-64v64h-32v-64h-64v-32h64v-64h32z"
              fill="#1E3A8A"
            />
          </svg>

          <div className="relative font-ios font-semibold text-center">
            <h2 className="text-5xl text-hdline-0 font-bold mx-10">
              Create your Account <span className="text-btton-0">!</span>
            </h2>
            <p className="mx-2  text-scdry-0 mt-5 text-lg font-ios">
              Sign up now to access exclusive features, manage bookings, view
              invoices, and much more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupView;
