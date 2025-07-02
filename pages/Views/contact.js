import React, {  useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

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
    <div className="xs:min-h-screen xs:bg-bgrnd-0">
       <Header />

      <div className="flex bg-bgrnd-0 h-dvh w-full overflow-hidden p-20 xs:flex xs:flex-col xs:pt-10 xs:h-auto xs:items-center xs:justify-center xs:space-y-2">
        {/* First Div (Image and Words) */}
        <div className="relative w-1/2 h-full flex flex-col items-center justify-center xs:w-screen ">
          {/* Image Section */}
          <div className="relative w-full h-1/2 items-center justify-end flex flex-col bottom-8 xs:bottom-0">
            <img
              src="/contact.png.png"
              alt="Background"
              className="  rounded-t-lg"
            />
          </div>
          {/* Text Section */}
          <div className="relative w-full h-1/2 flex flex-col justify-start items-center bg-bgrnd-0 text-hdline-0 p-6 rounded-b-lg">
            <h2 className="text-3xl font-semibold font-ios xs:text-xl ">
             Need help with your Bookings<label className="text-btton-0">?</label>
            </h2>
            <p className="mt-2 text-center text-prgraph-0 xs:text-sm">
             Contact us for any questions — we’ll help you manage your bookings easily.
            </p>
          </div>
        </div>
        {/* Second Div (Contact Form) */}
        <div className="relative w-1/2 font-ios h-full flex items-center justify-center bg-bgrnd-0 text-scdry-0  rounded-lg shadow-lg
        xs:w-screen xs:h-auto xs:p-2 ">
          <div className=" p-10 w-full  space-y-10 xs:space-y-3 xs:p-2">
            <h1 className="text-4xl font-bold text-center mb-6 text-hdline-0 xs:text-2xl">
              Contact us
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  ref={nameInputRef} // Attach the ref
                  placeholder="Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border  rounded-md  focus:ring-2 focus:ring-btton-0"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full p-2 border  rounded-md  focus:ring-2 focus:ring-btton-0"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Text"
                  rows="4"
                  className="w-full p-2 border  rounded-md  focus:ring-2 focus:ring-btton-0"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-btton-0 text-white py-2 rounded-md font-ios  "
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
     
    </>
  );
};

export default ContactPage;
