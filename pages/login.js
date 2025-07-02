import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword , onAuthStateChanged} from "firebase/auth";
import LoginView from "./Views/loginview";


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);

    if (currentUser && router.pathname !== "/Views/homepage") {
      router.push("/Views/homepage");
    }

    if (!currentUser && router.pathname !== "/login") {
      router.push("/login");
    }
  });

  return () => unsubscribe();
}, [router]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(event.target.value);
    
  };

  const handleSubmit = async (event) => {
    event.preventDefault(event);
    setMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/Views/homepage");
    } catch (error) {
      let errorMessage = "Wrong Email/Password. Please try again.";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage =
            "Invalid email format. Please enter a valid email address.";
          break;
        case "auth/user-not-found":
          errorMessage =
            "No user found with this email. Please check your email address or sign up.";
          break;
        case "auth/wrong-password":
          errorMessage =
            "Incorrect password. Please check your password and try again.";
          break;
        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection and try again.";
          break;
        default:
          if (error.response && error.response.status === 400) {
            errorMessage =
              error.response.data.message ||
              "Bad request. Please check your input.";
          }
          break;
      }
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
  
      <div className=" overflow-hidden h-dvh  xs:bg-bgrnd-0  xs:h-auto ">
        <LoginView
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          email={email}
          password={password}
          loading={loading}
          message={message}
          toggleShowPassword={toggleShowPassword}
          showPassword={showPassword}
          setLoading = {setLoading}
        />
      </div>
    </>
  );
}
