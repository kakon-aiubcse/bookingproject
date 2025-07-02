import { useEffect, useState, useRef } from "react";
import {
  getAuth,
  updatePassword,
  signOut,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

import { useRouter } from "next/router";
import Image from "next/image";
import Header from "./component/header";

const ResetPasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
   const [showPassword2, setShowPassword2] = useState(false);
  const [user, setUser] = useState(null);
  const passwordInputRef = useRef(null);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUser(userSnapshot.data());
            setFormData(userSnapshot.data());
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber.test(password)) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecialChar.test(password)) {
      return "Password must contain at least one special character.";
    }
    return "";
  };

  const handlePasswordReset = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setMessage("You must be logged in to reset your password.");
      return;
    }

    // Validate password
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    // Check: new and confirm match
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password must match.");
      return;
    }

    // Check: new is not same as old
    if (newPassword === oldPassword) {
      setMessage("New password cannot be the same as the old password.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, { password: newPassword });

      setMessage("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      signOut(auth)
        .then(() => {
          setMessage("Password updated successfully! Redirecting to login...");
          router.push("/login");
        })
        .catch((error) => {
          setMessage(`Error logging out: ${error.message}`);
        });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };const togglePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-bgrnd-0">
        <div className="bg-bgrnd-0 shadow-lg rounded-lg p-8 mt-4">
          <h2 className="text-5xl font-ios text-hdline-0 font-semibold text-center mb-6">
            Reset Your Password
          </h2>
          <p className="text-start text-scdry-0 mb-4">
            Please enter your current and new passwords below:
          </p>

          {/* Old Password */}
          <div className="relative w-full">
            {" "}
            <input
              ref={passwordInputRef}
              type={showPassword1 ? "text" : "password"}
              placeholder="Enter current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />{" "}
            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={togglePasswordVisibility1}
            >
              {showPassword1 ? (
                <Image
                  src="/eyeicon.svg"
                  alt="Open eye icon"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/eyeblindicon.svg"
                  alt="Closed eye icon"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>

          {/* New Password */}
          <div className="relative w-full">
            <input
              type={showPassword2 ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={togglePasswordVisibility2}
            >
              {showPassword2 ? (
                <Image
                  src="/eyeicon.svg"
                  alt="Open eye icon"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/eyeblindicon.svg"
                  alt="Closed eye icon"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="relative w-full">
            <input
             type={showPassword2 ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={togglePasswordVisibility2}
            >
              {showPassword2 ? (
                <Image
                  src="/eyeicon.svg"
                  alt="Open eye icon"
                  width={24}
                  height={24}
                />
              ) : (
                <Image
                  src="/eyeblindicon.svg"
                  alt="Closed eye icon"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-center ${
                message.includes("Error") || message.includes("must")
                  ? "text-red-500"
                  : "text-slate-200"
              }`}
            >
              {message}
            </p>
          )}

          <button
            onClick={handlePasswordReset}
            className="w-full bg-btton-0 text-bttext-0 py-3 rounded font-semibold font-ios"
          >
            Reset Password
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
