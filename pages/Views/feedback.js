import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { auth, db } from "../../lib/firebase"; // Import Firebase services
import Header from "../component/header";
import Spinner from "../component/spinner";
  

const Feedback = () => {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
 const [loading, setLoading] = useState(true)
      useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500); 
        return () => clearTimeout(timer);
      }, []);
    
     
  // Fetch messages from Firestore
  const fetchMessages = async () => {
    try {
      console.log("Fetching messages from Firestore...");
      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("name"),
        limit(5) // Limit the number of messages
      );

      const querySnapshot = await getDocs(messagesQuery);
      console.log("QuerySnapshot:", querySnapshot);

      if (!querySnapshot.empty) {
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Messages List:", messagesList);
        setMessages(messagesList);
      } else {
        console.log("No messages found");
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setErrorMessage("Error fetching messages. Please try again.");
    }
  };

  // Check if the user is authenticated and fetch data on load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchMessages(); // Fetch messages when user is authenticated
      } else {
        setIsLoggedIn(false);
        router.push("/login"); // Redirect to login if user is not logged in
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleNext = () => {
    if (currentIndex < messages.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };
  const handleDelete = async () => {
    const messageToDelete = messages[currentIndex];
    try {
      // Delete the message from Firestore
      await deleteDoc(doc(db, "messages", messageToDelete.id));

      // Update the local state to remove the deleted message
      const updatedMessages = messages.filter(
        (_, index) => index !== currentIndex
      );
      setMessages(updatedMessages);

      // Adjust the currentIndex to prevent out-of-bound issues
      if (currentIndex >= updatedMessages.length) {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      setErrorMessage("Error deleting the message. Please try again.");
    }
  };
   if (loading) {
        return <Spinner />;
      }

  return (
    <>
      <Header />
      <div className="flex flex-col  items-center justify-center bg-bgrnd-0 min-h-screen xs:relative xs:top-[-19px]">
        <h1 className="text-center font-ios text-hdline-0 text-3xl font-bold mb-4">
          User Feedbacks.
        </h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {messages.length > 0 && (
          <div className="flex h-[200px] justify-center text-center bg-bgrnd-0 text-bttext-0 shadow-md rounded-lg p-6 max-w-2xl  w-full mb-4">
            {/* Identity Section */}
            <div className="flex-1 text-center ">
              <h2 className="text-lg font-semibold">Identity</h2>
              <h3 className="text-slate-200 m-3 relative top-3 ">
                {messages[currentIndex].name}
              </h3>
              <p className="text-slate-400 m-1">
                {messages[currentIndex].email}
              </p>
            </div>
            {/* Feedback Section */}
            <div className="flex-1 text-center">
              <h4 className="text-lg font-semibold">Feedback</h4>
              <p className="text-teal-400 mt-10 ">
                {messages[currentIndex].message}
              </p>
            </div>
            <div className="xs:hidden">
              <button
                onClick={handleDelete}
                disabled={messages.length === 0}
                className="px-4 py-2 ml-2 mt-14 text-white bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
        {messages.length == 0 && (
          <div>
            <span className="text-2xl text-scdry-0 font-ios">
              {" "}
              No Feedback found.
            </span>
          </div>
        )}
        <div className="mt-4 xs:flex xs:flex-row xs:space-x-2 xs:justify-evenly">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`w-28 h-10 px-4 py-2 mr-2 text-bttext-0 bg-btton-0 rounded xs:px-2 ${
              currentIndex === 0
                ? "opacity-50 cursor-not-allowed text-red-500 bg-transparent"
                : ""
            }`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= messages.length - 1}
            className={`w-28 h-10 px-4 py-2 text-bttext-0 bg-btton-0 rounded xs:px-2 ${
              currentIndex >= messages.length - 1
                ? "opacity-50 cursor-not-allowed text-red-500 bg-transparent"
                : ""
            }`}
          >
            Next
          </button>

          <button
            onClick={handleDelete}
            disabled={messages.length === 0}
            className="w-28 h-10 px-4 py-2 ml-2 mt-14 text-white bg-red-500 rounded hidden xs:block xs:relative xs:bottom-14"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default Feedback;
