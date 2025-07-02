"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Menu } from "lucide-react";

const Header = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const [isBookingsDropdownOpen, setIsBookingsDropdownOpen] = useState(false);
  const [isInvoicesDropdownOpen, setIsInvoicesDropdownOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const bookingsDropdownRef = useRef(null);
  const invoicesDropdownRef = useRef(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [menuopen, setMenuopen] = useState(false);
  const [isXs, setIsXs] = useState(false);

  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } 
    });

    return () => unsubscribe();
  }, [push, pathname, db]);
  useEffect(() => {
    if (menuopen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount (optional)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuopen]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 439px)");
    const update = () => setIsXs(mq.matches);
    update(); // set initially
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleMouseEnter = (dropdownType) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    dropdownType === "bookings"
      ? setIsBookingsDropdownOpen(true)
      : setIsInvoicesDropdownOpen(true);
  };

  const handleMouseLeave = (dropdownType) => {
    const id = setTimeout(() => {
      dropdownType === "bookings"
        ? setIsBookingsDropdownOpen(false)
        : setIsInvoicesDropdownOpen(false);
    }, 200);
    setTimeoutId(id);
  };

  const handleBookingsClick = (e) => {
    e.preventDefault();
    push("/bookie");
  };

  const handleInvoicesClick = (e) => {
    e.preventDefault();
    push("/invoice");
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen((prev) => !prev);
  };
  const handleMouseEnterUser = () => {
    setIsUserDropdownOpen(true);
  };

  const handleMouseLeaveUser = () => {
    setIsUserDropdownOpen(false);
  };

  return (
    <header className=" bg-bgrnd-0 text-hdline-0 py-6 px-6 xs:px-6 xs:overflow-hidden xs:h-[115px]">
      <div className="container mx-auto flex flex-row justify-between items-center xs:items-start xs:flex-col ">
        <div className=" flex items-center space-x-2 text-xl sm:text-2xl cursor-pointer ">
          <Link href="/">
            <div className="flex items-center">
              <img
                src="/bookinglogo.svg"
                alt="bookinglogo"
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="ml-2 text-2xl font-bold">
                Bookie
                <span className="font-extrabold text-btton-0">.</span>
              </span>
            </div>
          </Link>
        </div>
        <Menu
          className="hidden xs:block xs:absolute xs:top-4  xs:left-[315px] xs:h-14 xs:w-14"
          onClick={() => setMenuopen(!menuopen)}
        />

        <nav
          className={`${
            !menuopen ? "xs:hidden" : "flex"
          } xs:bg-bgrnd-0 xs:w-full  xs:flex xs:flex-col xs:space-y-5  xs:pt-[10px] xs:text-hdline-0 xs:top-[99px] xs:right-0  xs:h-dvh xs:fixed xs:z-50
           relative flex font-semibold flex-row  space-y-0 space-x-10 `}
        >
          <div className="xs:border-b xs:border-btton-0 xs:w-[320px] relative xs:relative xs:left-10 xs:py-2">
            {" "}
            <Link href="/Views/homepage">
              <span
                className={`${
                  pathname === "/Views/homepage"
                    ? "border-b border-btton-0 text-gray-300  xs:relative xs:border-none xs:text-btton-0  "
                    : ""
                }`}
              >
                Homepage
              </span>
            </Link>
          </div>

          <div
            className="relative  xs:border-b xs:border-btton-0 xs:w-[320px] xs:py-2"
            onMouseEnter={() => handleMouseEnter("bookings")}
            onMouseLeave={() => handleMouseLeave("bookings")}
          >
            <button
              className={`hover:text-btton-0 ${
                pathname === "/bookie" ||
                pathname === "/bookings" ||
                (menuopen && isBookingsDropdownOpen)
                  ? "border-b w-auto h-auto border-btton-0 text-gray-300 xs:border-none xs:text-btton-0"
                  : ""
              }`}
              onClick={!menuopen ? handleBookingsClick : undefined}
            >
              Bookings
            </button>

            {isBookingsDropdownOpen && (
              <div
                className="absolute left-0 sm:left-[-10px] top-full mt-1 w-32 sm:w-36 bg-transparent text-hdline-0 rounded-lg shadow-lg z-10
                 xs:relative xs:left-[100px] xs:top-[-35px] xs:shadow-none xs:z-0 xs:text-btton-0"
                ref={bookingsDropdownRef}
              >
                <div className="block xs:w-[150px] px-3 py-1 bg-bgrnd-0 text-hdline-0  cursor-pointer text-sm xs:border-b xs:border-violet-600">
                  <Link
                    href="/bookings"
                    className={`hover:text-btton-0 ${
                      pathname === "/bookings" ? "text-btton-0" : ""
                    }`}
                  >
                    Create Manual
                  </Link>
                </div>

                <div className="block xs:w-[150px] px-3 py-1 bg-bgrnd-0 text-hdline-0 hover:text-btton-0 cursor-pointer text-sm xs:border-b xs:border-violet-600">
                  <Link
                    href="/bookie"
                    className={`hover:text-btton-0 ${
                      pathname === "/bookie" ? "text-btton-0" : ""
                    }`}
                  >
                    Show Bookings
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative  xs:border-b xs:border-btton-0 xs:w-[320px] xs:py-2"
            onMouseEnter={() => handleMouseEnter("invoices")}
            onMouseLeave={() => handleMouseLeave("invoices")}
          >
            <button
              className={`hover:text-btton-0 ${
                pathname === "/invoice" ||
                pathname === "/invoiceform" ||
                pathname === "/updateinvoice" ||
                pathname === "/invoiceHistory" ||
                (menuopen && isInvoicesDropdownOpen)
                  ? "border-b border-btton-0 text-gray-300 xs:border-none xs:text-btton-0"
                  : ""
              }`}
              onClick={!menuopen ? handleInvoicesClick : undefined}
            >
              Invoices
            </button>
            {isInvoicesDropdownOpen && (
              <div
                className="absolute left-0 sm:left-[-10px] top-full mt-1 w-32 sm:w-40 bg-transparent text-hdline-0 rounded-lg shadow-lg z-10
                   xs:relative xs:left-[100px] xs:top-[-50px] xs:shadow-none xs:z-0 "
                ref={invoicesDropdownRef}
              >
                <div className="block  xs:w-[150px] px-3 py-1 bg-bgrnd-0 text-hdline-0 cursor-pointer text-sm hover:text-btton-0 xs:border-b xs:border-violet-600">
                  <Link
                    href="/invoiceform"
                    className={`hover:text-btton-0 ${
                      pathname === "/invoiceform" ? "text-btton-0" : ""
                    }`}
                  >
                    Create an Invoice
                  </Link>
                </div>
                <div className="block  xs:w-[150px] px-3 py-1 bg-bgrnd-0 text-hdline-0 cursor-pointer text-sm hover:text-btton-0 xs:border-b xs:border-violet-600">
                  <Link
                    href="/updateinvoice"
                    className={`hover:text-btton-0 ${
                      pathname === "/updateinvoice" ? "text-btton-0" : ""
                    }`}
                  >
                    Show Invoices
                  </Link>
                </div>
                <div className="block  xs:w-[150px] px-3 py-1 bg-bgrnd-0 text-hdline-0 cursor-pointer text-sm hover:text-btton-0 xs:border-b xs:border-violet-600">
                  <Link
                    href="/invoiceHistory"
                    className={`hover:text-btton-0 ${
                      pathname === "/invoiceHistory" ? "text-btton-0" : ""
                    }`}
                  >
                    Invoice History
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative xs:border-b xs:border-btton-0 xs:w-[320px] xs:py-2">
            {" "}
            <Link href="/Views/contact">
              <span
                className={` ${
                  pathname === "/Views/contact"
                    ? "border-b border-btton-0 text-gray-300 xs:border-none xs:text-btton-0"
                    : ""
                }`}
              >
                Contact
              </span>
            </Link>
          </div>
          
            {" "}
            {user && (<div className=" xs:border-b xs:border-btton-0 xs:w-[320px] hidden xs:block xs:py-2">
              <Link href="/Views/profile">
                <span
                  className={`${
                    pathname === "/Views/profile"
                      ? "border-b border-btton-0 text-gray-300 xs:border-none xs:text-btton-0"
                      : ""
                  }`}
                >
                  Edit Profile
                </span>
              </Link> </div>
            )}
         
         
            {user && ( <div className="xs:border-b xs:border-btton-0 xs:w-[320px] hidden xs:block xs:py-2">
              <Link href="/Views/feedback">
                <span
                  className={` ${
                    pathname === "/Views/feedback"
                      ? "border-b border-btton-0 text-gray-300 xs:border-none xs:text-btton-0"
                      : ""
                  }`}
                >
                  Feedbacks
                </span>
              </Link> </div>
            )}
         
          <div className="hidden xs:block xs:py-2 ">
            {" "}
            {user && (
              <Link href="/Views/logout">
                <span
                  className={` ${
                    pathname === "/Views/logout"
                      ? "border-b border-btton-0 text-red-500 xs:border-none xs:text-text-500"
                      : "text-red-500"
                  }`}
                >
                  Logout
                </span>
              </Link>
            )}
          </div>
           {!userData && <>
        <div className=" relative xs:flex hidden flex-row">
          <button className="bg-btton-0 text-bttext-0 m-2 p-1 rounded-md hover:bg-bgrnd-0 hover:text-slate-100 xs:px-5">
           <Link href="/login">
            Sign In</Link>
          </button>
          <button className="bg-btton-0 text-bttext-0 m-2 p-1 rounded-md hover:bg-bgrnd-0 hover:text-slate-100 xs:px-5">
            <Link href= "/signup">
            Sign Up</Link>
          </button>
        </div>
        </>}
        </nav>
        {!userData && <>
        <div className="flex relative xs:hidden flex-row">
          <button className="bg-btton-0 text-bttext-0 m-2 p-1 rounded-md hover:bg-bgrnd-0 hover:text-slate-100">
           <Link href="/login">
            Sign In</Link>
          </button>
          <button className="bg-btton-0 text-bttext-0 m-2 p-1 rounded-md hover:bg-bgrnd-0 hover:text-slate-100">
            <Link href= "/signup">
            Sign Up</Link>
          </button>
        </div>
        </>}

        {userData && (
          <div
            className="relative flex items-center space-x-2 mt-0 xs:flex xs:flex-col xs:top-2 "
            onMouseEnter={handleMouseEnterUser}
            onMouseLeave={handleMouseLeaveUser}
          >
            <div className="flex items-center space-x-2">
              <img
                src={userData.pic}
                alt="User Icon"
                className="w-8 h-8 rounded-3xl"
              />
              <span className="text-sm text-btton-0 sm:text-base font-medium">
                {userData.name}
              </span>
            </div>

            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-transparent text-hdline-0 rounded-lg shadow-lg z-10">
                <div className="block px-3 py-1  text-hdline- bg-bgrnd-0 hover:text-btton-0 cursor-pointer text-sm">
                  <Link href="/Views/profile">Edit profile</Link>
                </div>
                <div className="block px-3 py-1  text-hdline- bg-bgrnd-0 hover:text-btton-0 cursor-pointer text-sm">
                  <Link href="/Views/feedback">Feedbacks</Link>
                </div>
                <div className="block px-3 py-1  text-hdline- bg-bgrnd-0 text-red-500 cursor-pointer text-sm">
                  <a href="/Views/logout">Log out!</a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
