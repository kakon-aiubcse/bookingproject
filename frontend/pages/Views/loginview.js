import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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
    <div
      className="relative flex flex-col overflow-hidden  justify-center items-center"
      style={{
        minHeight: "100vh", // This will ensure the page height fills the full viewport
        backgroundImage: "url('/loginpic.jpg')",
        backgroundSize: "cover", // Ensures the image covers all sides
        backgroundPosition: "center", // Keeps the image centered
      }}
    >
      {/* Blurry background */}
      <div
        className="absolute 
 inset-0 bg-black/30 backdrop-blur-3xl"
      ></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mb-24 h-[548px] w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Welcome Text */}
        <div
          className="md:w-1/2 p-10 text-black font-bold flex h-[548px] flex-col justify-center items-center bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/loginpic.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <h2 className="text-4xl text-white font-bold mb-16 z-10">
            Welcome Back<span className="text-red-500">!</span>
          </h2>
          <p className="mb-6 text-white  text-lg z-10">
            Log in to access your dashboard, manage your bookings, and more.
          </p>
          <p className="text-xs text-white  z-10">
            Don't have an account?
            <button
              onClick={() => router.push("/signup")}
              className="ml-2 mt-10 text-[20px] text-rose-500 bg-slate-900 underline font-semibold hover:underline hover:text-slate-300"
            >
              Register Here.
            </button>
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center relative z-10">
          <h2 className="text-2xl font-semibold text-slate-800 mb-5 text-center">
            User Login.
          </h2>
          <h3 className="mt-2 text-sm font-light text-gray-400">
            Start exploring by logging into your dashboard:
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
                className="text-rose-300 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-5 rounded-lg text-white font-semibold transition-colors duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-slate-500"
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {message && (
              <p className="text-red-600 text-center mt-4">{message}</p>
            )}

            <div className="text-center mt-4 text-gray-600">Or login with</div>
            <div className="flex justify-center space-x-4 mt-2">
              <button className="flex items-center border-b border-slate-100 px-4 py-2 rounded-lg hover:bg-slate-500 hover:text-slate-100 transition">
                <img
                  src="/facebookicon.svg"
                  alt="Facebook"
                  className="w-5 h-5 mr-2"
                />
                Facebook
              </button>
              <button className="flex items-center border-b border-slate-100 px-4 py-2 rounded-lg hover:bg-slate-500 hover:text-slate-100 transition">
                <img
                  src="/googleicon.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
