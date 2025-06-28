"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter,  usePathname } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore"; 

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

  

  const db = getFirestore(); // Initialize Firestore

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
    } else {
      
      const publicRoutes = ["/", "/login" , "/signup", "/contact", "/Views/contact"];
      if (!publicRoutes.includes(pathname)) {
        push("/login");
      }
    }
  });

  return () => unsubscribe();
}, [push, pathname, db]);



  
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
    router.push("/bookie");
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
    <header className=" bg-bgrnd-0 text-hdline-0 py-4 px-4 sm:py-6 sm:px-6">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 text-xl sm:text-2xl cursor-pointer">
          <Link href="/">
            <div className="flex items-center">
              <img
                src="/bookinglogo.svg"
                alt="bookinglogo"
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
              <span className="ml-2 text-2xl font-bold">
                Bookie
                <span className="font-extrabold text-amber-500">.</span>
              </span>
            </div>
          </Link>
        </div>

        <nav className="relative flex font-semibold flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-10">
          <Link href="/Views/homepage">
            <span
              className={`${
                pathname === "/Views/homepage"
                  ? "border-b border-slate-200 text-gray-300"
                  : ""
              }`}
            >
              Homepage
            </span>
          </Link>

          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("bookings")}
            onMouseLeave={() => handleMouseLeave("bookings")}
          >
            <button
              className={`hover:text-gray-300 ${
                pathname.startsWith("/bookie")
                  ? "border-b border-slate-200 text-gray-300"
                  : ""
              }`}
              onClick={handleBookingsClick}
            >
              Bookings
            </button>
            {isBookingsDropdownOpen && (
              <div
                className="absolute left-0 sm:left-[-10px] top-full mt-1 w-32 sm:w-36 bg-slate-100 text-black rounded-lg shadow-lg z-10"
                ref={bookingsDropdownRef}
              >
                <div className="block px-3 py-1 bg-slate-100 text-black cursor-pointer text-sm">
                  <Link href="/bookings">Create Manual</Link>
                </div>

                <div className="block px-3 py-1 bg-slate-100 text-black cursor-pointer text-sm">
                  <Link href="/bookie">Show Bookings</Link>
                </div>
              </div>
            )}
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("invoices")}
            onMouseLeave={() => handleMouseLeave("invoices")}
          >
            <button
              className={`hover:text-gray-300 ${
                pathname.startsWith("/invoice")
                  ? "border-b border-slate-200 text-gray-300"
                  : ""
              }`}
              onClick={handleInvoicesClick}
            >
              Invoices
            </button>
            {isInvoicesDropdownOpen && (
              <div
                className="absolute left-0 sm:left-[-10px] top-full mt-1 w-32 sm:w-40 bg-slate-100 text-black rounded-lg shadow-lg z-10"
                ref={invoicesDropdownRef}
              >
                <div className="block px-3 py-1 hover:bg-slate-100 text-black cursor-pointer text-sm">
                  <Link href="/invoiceform">Create an Invoice</Link>
                </div>
                <div className="block px-3 py-1 hover:bg-slate-100 text-black cursor-pointer text-sm">
                  <Link href="/updateinvoice">Show Invoices</Link>
                </div>
                <div className="block px-3 py-1 hover:bg-slate-100 text-black cursor-pointer text-sm">
                  <Link href="/invoiceHistory">Invoice History</Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/Views/contact">
            <span
              className={`${
                pathname === "/Views/contact"
                  ? "border-b border-slate-200 text-gray-300"
                  : ""
              }`}
            >
              Contact
            </span>
          </Link>
        </nav>

        {userData && (
          <div
            className="relative flex items-center space-x-2 mt-4 sm:mt-0"
            onMouseEnter={handleMouseEnterUser}
            onMouseLeave={handleMouseLeaveUser}
          >
            <Link href="/Views/profile">
              <div className="flex items-center space-x-2">
                <img
                  src={userData.pic}
                  alt="User Icon"
                  className="w-8 h-8 rounded-3xl"
                />
                <span className="text-sm text-slate-200 sm:text-base font-medium">
                  {userData.name}
                </span>
              </div>
            </Link>
            {isUserDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-slate-100 text-white rounded-lg shadow-lg z-10">
                <div className="block px-3 py-1 hover:bg-slate-100 text-black cursor-pointer text-sm">
                  <Link href="/Views/profile">Edit profile</Link>
                </div>
                <div className="block px-3 py-1 hover:bg-slate-100 text-black cursor-pointer text-sm">
                  <Link href="/Views/feedback">Feedbacks</Link>
                </div>
                <div className="block px-3 py-1 hover:bg-slate-100 text-black cursor-pointer text-sm">
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
