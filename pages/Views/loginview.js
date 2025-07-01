import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../component/header";

const LoginView = ({
  handleSubmit,
  handleChange,
  email,
  password,
  loading,
  message,
  toggleShowPassword,
  showPassword,
}) => {
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="relative flex flex-col  w-screen pb-32 justify-center items-center bg-bgrnd-0 h-dvh xs:pb-2 xs:min-h-screen
       xs:top-0 ">
        <div className="relative  w-full bg-bgrnd-0   flex flex-row xs:flex xs:flex-col xs:w-screen xs:min-h-screen">
          {/* Left Side */}
          <div className=" p-10 w-1/2 text-hdline-0  font-bold flex  flex-col justify-center items-center relative 
          xs:p-0 xs:w-screen xs:justify-normal xs:bottom-6">
            <svg
              width="300"
              height="300"
              viewBox="0 0 1024 1024"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto xs:m-2 xs:h-20 xs:w-20"
            >
              <circle cx="512" cy="512" r="500" fill="#16161a" />
              <path
                d="M512 272c66.3 0 120 53.7 120 120s-53.7 120-120 120-120-53.7-120-120 53.7-120 120-120zm0 352c110.5 0 200 89.5 200 200H312c0-110.5 89.5-200 200-200z"
                fill="#3B82F6"
              />
              <path d="M472 496h-64v32h64v64l96-80-96-80v64z" fill="#1E3A8A" />
            </svg>

            <h2
              className="text-5xl font-ios text-slate-300
             font-bold mb-8
             xs:text-xl xs:m-0"
            >
              Welcome Back<span className="text-btton-0">!</span>
            </h2>
            <p className=" text-scdry-0 font-ios  text-lg xs:text-xs   ">
              Log in to access your dashboard, manage your bookings, and more.
            </p>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-1/2 px-24 flex flex-col justify-center relative xs:w-screen xs:px-0 xs:top-2">
            <h2 className="text-4xl font-semibold font-ios text-bttext-0 mb-5 text-center xs:text-3xl xs:mb-0">
              User Login.
            </h2>
            <h3 className="mt-2 text-base font-light text-gray-400 xs:text-[9px] xs:m-1 xs:p-1 xs:items-center xs:justify-center">
              Start exploring by logging into your dashboard:
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4 xs:space-y-2 xs:px-2 xs:my-4">
              <div className="relative">
                <img
                  src="/emailicon.svg"
                  alt="Email Icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600"
                />
              </div>

              <div className="relative">
                <img
                  src="/passwordicon.svg"
                  alt="Password Icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-slate-600"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  <img
                    src={showPassword ? "/eyeicon.svg" : "/eyeblindicon.svg"}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    className="w-5 h-5"
                  />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  href="/Views/forgetpassword"
                  className="text-btton-0 text-sm hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-5 rounded-lg text-bttext-0 font-ios font-semibold transition-colors duration-300 ${
                  loading
                    ? "bg-btton-0 cursor-not-allowed"
                    : "bg-btton-0 hover:bg-violet-700"
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>

              {message && (
                <p className="text-red-600 text-center mt-4">{message}</p>
              )}
              <div className="text-sm text-white  z-10">
                Don't have an account?
                <button className="ml-2 mt-10 text-[20px] text-btton-0  font-semibold hover:underline">
                  <a href="../signup">Sign up.</a>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginView;
