import { useEffect, useState, useRef } from "react";
import {
  getAuth,
  updatePassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../frontend/lib/firebase"; // Your Firestore instance
import Header2 from "../../frontend/pages/component/header2"; // Assuming you have a Header component
import { useRouter } from "next/router";
import Image from "next/image"; // For rendering the eye icons

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const router = useRouter();
  const [user, setUser] = useState(null);
  const passwordInputRef = useRef(null); // Create a ref for the password input

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserDetails(userSnapshot.data());
            setFormData(userSnapshot.data());
          }
        } catch (err) {
          console.error("Error fetching user details:", err);
        }
      } else {
        router.push("/emlogin");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Set focus on the password input after the component mounts
  useEffect(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, []);

  // Password validation function
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
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      // Update password in Firebase Authentication
      await updatePassword(currentUser, newPassword);

      // Update password in Firestore users collection
      const userDocRef = doc(db, "users", currentUser.uid); // Assuming "users" is your collection name
      await updateDoc(userDocRef, { password: newPassword });

      setMessage("Password updated successfully!");
      setNewPassword("");
      signOut(auth)
        .then(() => {
          setMessage(
            "Password updated successfully! Redirecting you to login..."
          );
          router.push("/login");
        })
        .catch((error) => {
          setMessage(`Error logging out: ${error.message}`);
        });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility state
  };

  return (
    <>
      <Header2 isReadOnly={true} />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 mt-4 w-96">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Reset Your Password
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Please enter your new password below:
          </p>

          <div className="relative w-full">
            <input
              ref={passwordInputRef} // Attach the ref to the input element
              type={showPassword ? "text" : "password"} // Toggle between text and password types
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="button"
              className="absolute right-3 top-3"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
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
                message.includes("Error") ? "text-red-500" : "text-slate-500"
              }`}
            >
              {message}
            </p>
          )}

          <button
            onClick={handlePasswordReset}
            className="w-full bg-rose-500 text-white py-3 rounded hover:bg-rose-600 transition duration-200"
          >
            Reset Password
          </button>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
