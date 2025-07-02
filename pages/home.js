import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const handleStartClick = () => {
    setLoading(true);
    setTimeout(() => {
      
    }, 1200);
  };

  return (
    <div className="h-dvh bg-bgrnd-0 justify-evenly items-center flex flex-row w-dvw
      xs:flex xs:flex-col xs:min-h-screen xs:w-screen xs:relative xs:bottom-[2px] xs:justify-normal xs:overflow-hidden">
      
      {/* left side */}
      <div className="p-10 font-ios flex flex-col justify-start relative w-1/3 m-10
         xs:items-center  xs:p-0 xs:my-10 xs:w-screen xs:justify-center xs:h-auto">
        <div className="text-center mb-16 xs:m-0">
          <div className="flex justify-center items-center mb-4 xs:m-0">
            <img src="/bookinglogo.svg" alt="bookinglogo" className="xs:h-1/2 xs:w-1/2" />
          </div>
          <h1 className="text-5xl block items-center font-bold text-hdline-0">
            Bookie <br />
            <label className="text-3xl text-scdry-0 xs:text-xl">
              Web Application
            </label>{" "}
            <label className="text-amber-500 scoop relative right-3">.</label>
          </h1>
        </div>
      </div>

      {/* right side */}
      <div className="flex flex-col font-ios text-hdline-0 font-bold w-2/3 justify-end items-center space-y-3 relative
        xs:space-x-1 xs:justify-center xs:my-8">
        <h2 className="text-5xl w-fit mb-10 font-bold xs:text-xl xs:mb-5  xs:w-screen xs:px-4 xs:items-center xs:justify-center xs:flex">
          Manage Your Bookings
          <label className="text-btton-0 font-extrabold ml-2 text-[40px] xs:text-[18px]">
            Efficiently
            <span className="text-fuchsia-600 text-[50px] xs:text-[15px]">.</span>
          </label>
        </h2>

        <div className="text-lg font-semibold text-prgraph-0 font-roboto xs:text-sm xs:w-screen xs:px-2">
          Our bookie app provides an easy and efficient way to manage your:
          <ol className="list-outside items-center text-start flex flex-col space-y-2 pt-2 text-sm font-semibold
            xs:items-start">
            <li className="hover:text-btton-0">Reservations</li>
            <li className="hover:text-btton-0">Track your trips</li>
            <li className="hover:text-btton-0">Plan your adventures!</li>
          </ol>
        </div>

        {/* Button with loading spinner */}
        <div className="flex flex-col space-y-4 top-8 relative w-full px-44 xs:px-0 xs:my-4">
        <Link href = "/Views/homepage">
       <button
            onClick={handleStartClick}
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-3 text-bttext-0 bg-btton-0 rounded-xl text-lg font-bold disabled:opacity-70"
          >  {loading ? "Starting..." : "Start here..."}
            {loading ? (
              <svg
                className="w-5 h-5 animate-spin mr-2 text-bttext-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-50"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-100"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : null}
          
          </button> </Link>  
        </div>
      </div>
    </div>
  );
}
