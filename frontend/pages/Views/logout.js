import React from "react";
import { useRouter } from "next/router";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import Header from "../component/header";

const LogoutPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to the homepage or login page after successful logout
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-slate-200 to-slate-300 text-black">
        <div className="bg-white max-w-sm w-full p-6 rounded-lg shadow-lg">
          <h1 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-4">
            Are you sure you want to log out?
          </h1>
          <p className="text-sm text-center text-gray-600 mb-6">
            You will need to log in again to access your account.
          </p>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleLogout}
              className="w-1/2 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition duration-200 text-sm md:text-base shadow-md"
            >
              Logout
            </button>
            <button
              onClick={() => router.back()}
              className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition duration-200 text-sm md:text-base shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutPage;
