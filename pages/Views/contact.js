import React, { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Header from "../component/header";


const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
 
  const nameInputRef = useRef(null); 



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      setSuccessMessage("Your message has been sent successfully!");
      setErrorMessage("");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setErrorMessage("Error sending message. Please try again.");
      setSuccessMessage("");
      console.error("Error adding document: ", error);
    }
  };

  return (
    <>
    <Header/>
    
      <div className="flex bg-gradient-to-tr from-slate-100 to-slate-100 h-[589px] overflow-hidden p-20">
        {/* First Div (Image and Words) */}
        <div className="relative w-1/2 h-full flex flex-col items-center justify-center bg-gray-100 border border-gray-300 rounded-lg">
          {/* Image Section */}
          <div className="relative w-full h-1/2">
            <img
              src="/contact.png"
              alt="Background"
              className="object-cover w-full h-full rounded-t-lg"
            />
          </div>
          {/* Text Section */}
          <div className="relative w-full h-1/2 flex flex-col justify-center items-center bg-orange-600 text-slate-100 p-6 rounded-b-lg">
            <h2 className="text-2xl font-semibold">Manage Your Bookings</h2>
            <p className="mt-2 text-center">
              Effortlessly track, manage, and organize all your bookings and
              invoices in one place.
            </p>
          </div>
        </div>
        {/* Second Div (Contact Form) */}
        <div className="relative w-1/2 h-full flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="max-w-md w-full p-8">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Contact Us
            </h1>
            {successMessage && (
              <div className="mb-4 text-green-600 text-center">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 text-red-600 text-center">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  ref={nameInputRef} // Attach the ref
                  placeholder="Enter your name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your Email"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Share your feedback with us"
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rose-500 text-white py-2 rounded-md hover:bg-slate-600 hover:text-rose-500 transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
