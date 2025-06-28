import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className=" h-dvh bg-bgrnd-0 justify-evenly items-center flex flex-row w-dvw">
        {/* left side */}
        <div className=" p-10 font-ios flex flex-col justify-start relative w-1/3 m-10">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-4">
              <img src="/bookinglogo.svg" alt="bookinglogo" className="" />
            </div>
            <h1 className="text-5xl block  items-center font-bold text-hdline-0">
              Bookie <br />
              <label className="text-3xl text-scdry-0 ">
                Web Application
              </label>{" "}
              <label className="text-amber-500 scoop relative right-3">.</label>
            </h1>
          </div>
        </div>
        {/* {right side} */}
        <div className="flex flex-col font-ios  text-hdline-0 font-bold w-2/3 justify-end items-center space-y-3 relative">
          <h2 className="text-5xl w-fit mb-10 font-bold">
            Manage Your Bookings
            <label className="text-btton-0 font-extrabold ml-2 text-[40px]">
              Efficiently
              <span className="text-fuchsia-600 text-[50px]">.</span>
            </label>
          </h2>
          <div className=" text-lg font-semibold text-prgraph-0 font-roboto">
            Our bookie app provides an easy and efficient way to manage your:
            <ol className="list-outside items-center text-start flex flex-col space-y-2 pt-2  text-sm font-semibold">
              <li className=" hover:text-btton-0">
                Reservations
              </li>
              <li className=" hover:text-btton-0">
                Track your trips
              </li>
              <li className=" hover:text-btton-0">
                Plan your adventures!
              </li>
            </ol>
          </div>

          
          <div className="flex flex-col space-y-4 top-8 relative w-full px-44 ">
            <Link href="/login" className="">
              <button className="w-full space-y-6 text-center px-4 py-3 text-bttext-0 bg-btton-0 rounded-xl text-lg font-bold">
                Start here...
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
