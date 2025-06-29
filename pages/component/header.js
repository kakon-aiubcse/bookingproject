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
        const publicRoutes = [
          "/",
          "/login",
          "/signup",
          "/contact",
          "/Views/contact",
          "/Views/homepage",
        ];
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
    <header className=" bg-bgrnd-0 text-hdline-0 py-6 px-6 ">
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
          className="hidden xs:absolute xs:left-72 xs:block xs:h-16 xs:w-16 "
          onClick={() => setMenuopen(!menuopen)}
        />
        {!menuopen && (
          <nav
            className="xs:bg-white xs:w-full  xs:flex xs:flex-col xs:space-y-10 xs:text-black xs:top-28 xs:right-0  xs:h-dvh xs:fixed xs:z-50
           relative flex font-semibold flex-row  space-y-0 space-x-10 "
          >
            <Link href="/Views/homepage">
              <span
                className={`${ 
                  pathname === "/Views/homepage"
                    ? "border-b border-btton-0 text-gray-300"
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
                  pathname === "/bookie"
                    ? "border-b border-btton-0 text-gray-300"
                    : ""
                }`}
                onClick={handleBookingsClick}
              >
                Bookings
              </button>
              {isBookingsDropdownOpen && (
                <div
                  className="absolute left-0 sm:left-[-10px] top-full mt-1 w-32 sm:w-36 bg-transparent text-hdline-0 rounded-lg shadow-lg z-10"
                  ref={bookingsDropdownRef}
                >
                  <div className="block px-3 py-1 bg-bgrnd-0 text-hdline-0 hover:text-btton-0 cursor-pointer text-sm">
                    <Link href="/bookings">Create Manual</Link>
                  </div>

                  <div className="block px-3 py-1 bg-bgrnd-0 text-hdline-0 hover:text-btton-0 cursor-pointer text-sm">
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
                  pathname === "/invoice"
                    ? "border-b border-btton-0 text-gray-300"
                    : ""
                }`}
                onClick={handleInvoicesClick}
              >
                Invoices
              </button>
              {isInvoicesDropdownOpen && (
                <div
                  className="absolute left-0 sm:left-[-10px] top-full mt-1 w-32 sm:w-40 bg-transparent text-hdline-0 rounded-lg shadow-lg z-10"
                  ref={invoicesDropdownRef}
                >
                  <div className="block px-3 py-1 bg-bgrnd-0 text-hdline-0 cursor-pointer text-sm hover:text-btton-0 ">
                    <Link href="/invoiceform">Create an Invoice</Link>
                  </div>
                  <div className="block px-3 py-1 bg-bgrnd-0 text-hdline-0 cursor-pointer text-sm hover:text-btton-0">
                    <Link href="/updateinvoice">Show Invoices</Link>
                  </div>
                  <div className="block px-3 py-1 bg-bgrnd-0 text-hdline-0 cursor-pointer text-sm hover:text-btton-0">
                    <Link href="/invoiceHistory">Invoice History</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/Views/contact">
              <span
                className={`${
                  pathname === "/Views/contact"
                    ? "border-b border-btton-0 text-gray-300"
                    : ""
                }`}
              >
                Contact
              </span>
            </Link>
          </nav>
        )}

        {userData  && (
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
                <div className="block px-3 py-1  text-hdline- bg-bgrnd-0 hover:text-btton-0 cursor-pointer text-sm">
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
