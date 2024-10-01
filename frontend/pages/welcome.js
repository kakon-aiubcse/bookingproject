import Link from "next/link";
import Header2 from "./component/header2";

export default function Welcome() {
  return (
    <div>
      <Header2 />
      <div
        className="size-auto relative flex pt-5 pb-5 justify-center"
        style={{
          backgroundImage: "url('/welcomepic.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Softer overlay for subtle blur and semi-transparency over the whole background */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-3xl"></div>

        <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
          {/* Parent Div with Single Background Image Covering Both Divs */}
          <div className="relative flex md:flex-row flex-col h-[548px] bg-[url('/welcomepic.jpg')] bg-cover bg-center">
            {/* Softer overlay for subtle blur and semi-transparency over the whole background */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            {/* Left Side Div with Text Content */}
            <div className="md:w-1/2 p-10 text-white font-bold flex flex-col justify-center items-center relative z-20">
              <h2 className="text-4xl mb-10 font-bold">
                Manage Your Bookings
                <label className="text-slate-300 font-extrabold ml-2 text-[40px]">
                  Efficiently
                  <span className="text-slate-100 text-[50px]">.</span>
                </label>
              </h2>
              <p className="mt-10 text-sm font-semibold font-sans">
                Our bookie app provides an easy and efficient way to manage your
                reservations, track your trips, and plan your adventures!
              </p>

              <div className="flex flex-col items-center mt-5">
                <p className="mt-10 text-base font-serif mb-4 border-b border-slate-400">
                  Follow us on
                </p>
                <div className="flex space-x-4 text-black">
                  <a
                    href="https://www.facebook.com/kakon20/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-slate-500 transition"
                  >
                    <img
                      src="/facebookicon.svg"
                      alt="Facebook"
                      className="w-5 h-5 mr-2"
                    />
                    Facebook
                  </a>
                  <a
                    href="https://www.linkedin.com/in/khairul-islam-kakon-12618222a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 rounded-lg hover:bg-slate-500 transition"
                  >
                    <img
                      src="/linkedin.svg"
                      alt="LinkedIn"
                      className="w-5 h-5 mr-2"
                    />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Vertical Line Divider */}
            <div className="flex items-center justify-center relative z-30">
              <div className="border-l-2 border-white h-[400px]"></div>
            </div>

            {/* Right Side Div with Form */}
            <div className="md:w-1/2 p-10 flex flex-col justify-center relative z-20">
              <div className="text-center mb-16">
                <div className="flex justify-center items-center mb-4">
                  <img
                    src="/bookinglogo.svg"
                    alt="bookinglogo"
                    className="h-10 w-10 sm:h-12 sm:w-12"
                  />
                </div>
                <h1 className="text-5xl  font-bold text-slate-300">
                  Bookie Web App.
                </h1>
              </div>

              <h2 className="text-4xl font-semibold font-sans text-slate-200 mt-5 mb-5 text-center">
                Glad to have you here!
              </h2>

              <p className="mt-10   text-slate-300">
                Please log in or sign up to continue.
              </p>
              <div className="flex flex-col justify-center space-y-4">
                <Link href="/login" className="w-full">
                  <button className="w-full px-4 py-3 sm:px-6 sm:py-4 text-black bg-rose-500 rounded-lg text-base sm:text-lg font-bold hover:bg-slate-500 hover:text-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-500 transition">
                    Start Here...
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
