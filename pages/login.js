import React, { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import Header2 from "./component/header2";
import LoginView from "./Views/loginview";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      <Header2 />
      <div className=" overflow-hidden h-dvh">
        <LoginView
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          email={email}
          password={password}
          loading={loading}
          message={message}
          toggleShowPassword={toggleShowPassword}
          showPassword={showPassword}
        />
      </div>
    </>
  );
}
