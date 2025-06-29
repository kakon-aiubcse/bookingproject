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
      <div className="flex flex-col items-center justify-center min-h-screen bg-bgrnd-0 font-ios">
        <div className="bg-bgrnd-0 w-screen items-center justify-center p-6">
          <h1 className="text-xl font-semibold text-center text-hdline-0 mb-4">
            Are you sure you want to log out?
          </h1>
          <p className="text-sm text-center text-scdry-0 mb-6">
            You will need to log in again to access your account.
          </p>

         
        </div>
         <div className="flex flex-row w-[50%]  space-x-4 justify-center items-center">
            <button
              onClick={handleLogout}
              className="w-1/2 bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition duration-200 text-sm md:text-base shadow-md"
            >
              Logout
            </button>
            <button
              onClick={() => router.back()}
              className="w-1/2 bg-btton-0 text-bttext-0 py-2 rounded-lg "
            >
              Cancel
            </button>
          </div>
      </div>
    </>
  );
};

export default LogoutPage;
