import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/router";
import Header from "../component/header";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import Link from "next/link";

const ForgotPassword = () => {
  const router = useRouter();
  const db = getFirestore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create a ref for the email input
  const emailInputRef = useRef(null);

  useEffect(() => {
    // Focus the input when the component mounts
    emailInputRef.current?.focus();
  }, []);

  const handleChange = (value) => {
    setEmail(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Reset any previous messages
    setIsSubmitting(true); // Set loading state

    const trimmedEmail = email.trim(); // Trim input email

    try {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", trimmedEmail)
      );
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        setMessage(
          <span className="text-rose-700 font-mono font-semibold text-center mt-4">
            No account found. Search again!!
          </span>
        ); // No match found
        setIsSubmitting(false); // Reset loading state
        return;
      }

      const actionCodeSettings = {
        url: "http://localhost:7000/resetpass",
      };
      await sendPasswordResetEmail(auth, trimmedEmail, actionCodeSettings);

      setMessage(
        <h1>
          <span className="text-hdline-0 font-ios text-2xl w-screen text-[15px] font-semibold text-center mt-2">
            Reset password link has been sent.
            <a
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className=" px-3 text-btton-0 font-semibold "
            >
              Check here!
            </a>
          </span>
          <h2 className="text-red-500 text-xs font-mono text-center mt-4">
            *only if valid Email Address.
          </h2>
          <h3>
            <Link href="/login" className="text-btton-0 underline">
              login?
            </Link>
          </h3>
        </h1>
      );
      setEmail(""); // Clear the input field after sending the email
    } catch (error) {
      console.error(error);
      let errorMessage;

      if (error.code === "auth/invalid-email") {
        errorMessage =
          "Invalid email format. Please enter a valid email address.";
      } else {
        errorMessage = "An error occurred. Please try again.";
      }
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <>
      <Header />
      
        <div className="relative flex flex-col bg-bgrnd-0 min-h-screen w-screen justify-center items-center">
          <div className="relative max-w-6xl mb-24 w-full shadow-lg rounded-lg overflow-hidden flex flex-row">
            {/* Left Side - Welcome Text */}
            <div className="bg-bgrnd-0 p-10 w-1/2 font-bold flex  flex-col justify-center items-center relative">
              <h2 className="text-4xl text-hdline-0 font-bold mb-4">
                Reset Password{" "}
                <span className="font-extrabold text-violet-500"> ! </span>
              </h2>
              <p className=" text-scdry-0 text-lg">
                Enter your email address to receive a password reset link..
              </p>
            </div>

            {/* Right Side - Reset Form */}
            <div className=" p-10 w-1/2  bg-bgrnd-0 flex flex-col justify-center relative">
              <h2 className="text-3xl text-hdline-0 font-semibold  mb-5 text-center">
                Forgot Password?
              </h2>
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
                    onChange={(e) => handleChange(e.target.value)}
                    ref={emailInputRef} // Use ref here
                    required
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-lg px-10 py-3 focus:outline-none focus:ring-2 focus:ring-violet-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full py-2 bg-btton-0 text-bttext-0 font-ios font-semibold rounded-lg"
                >
                  {isSubmitting ? "Sending..." : "Find"}
                </button>

                {message && (
                  <p className="text-hdline-0 font-mono font-semibold text-center mt-4">
                    {message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

    </>
  );
};

export default ForgotPassword;
