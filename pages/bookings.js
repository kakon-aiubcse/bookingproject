import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BookingsView from "./Views/bookingsView";

const Booking = () => {
  const router = useRouter();
  const { packageId } = router.query;

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    packageName: "",
    name: "",
    passportNumber: "",
    validDate: null,
    netAmount: "",
    paidAmount: "",
    paymentStatus: "N/A",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Check for user authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch package details when packageId changes
  useEffect(() => {
    if (packageId) {
      const packages = [
        { id: 1, name: "Sajek Valley", price: 400 },
        { id: 2, name: "Saint Martin", price: 600 },
        { id: 3, name: "Kaptai Lake", price: 250 },
        { id: 4, name: "Cox Bajar", price: 400, image: "/coxbajar.jpg" },
        { id: 5, name: "Bandarban", price: 180, image: "/bandarban.jpg" },
      ];

      const selected = packages.find((pkg) => pkg.id === parseInt(packageId));
      if (selected) {
        setSelectedPackage(selected);
        setFormData((prevData) => ({
          ...prevData,
          packageName: selected.name,
          netAmount: selected.price,
        }));
      }
    }
  }, [packageId]);

  // Helper functions for validation
  const isValidNumber = (value) => /^[0-9]+(\.[0-9]+)?$/.test(value);
  const isValidName = (value) => /^[A-Za-z\s]{1,24}$/.test(value);
  const isValidPackageName = (value) => /^[A-Za-z\s]{1,24}$/.test(value);
  const isValidPassport = (value) => /^[A-Z0-9]{6,9}$/.test(value);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "netAmount" || name === "paidAmount") && value < 0) return;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "netAmount" || name === "paidAmount") {
        const net = parseFloat(updatedData.netAmount);
        const paid = parseFloat(updatedData.paidAmount);

        if (isNaN(net) || isNaN(paid)) {
          updatedData.paymentStatus = "N/A";
        } else if (net === 0 && paid === 0) {
          updatedData.paymentStatus = "N/A";
        } else if (paid > net) {
          setError("Paid amount cannot exceed net amount.");
          return prevData; // Return previous state to avoid state update
        } else if (paid === net) {
          updatedData.paymentStatus = "Paid";
        } else {
          updatedData.paymentStatus = "Pending";
        }
      }

      return updatedData;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate form fields
    if (!formData.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    if (!isValidName(formData.name)) {
      setError("Name should contain 24 digits only with no characters.");
      setLoading(false);
      return;
    }

    if (!isValidPackageName(formData.packageName)) {
      setError(
        "Package Name should contain 24 digits only with no characters."
      );
      setLoading(false);
      return;
    }

    if (!formData.passportNumber.trim()) {
      setError("Passport number is required.");
      setLoading(false);
      return;
    }

    if (!isValidPassport(formData.passportNumber)) {
      setError("Invalid passport number format. Example: J12345678");
      setLoading(false);
      return;
    }

    if (
      !formData.netAmount ||
      !isValidNumber(formData.netAmount) ||
      parseFloat(formData.netAmount) <= 0
    ) {
      setError("Net amount must be a positive number and cannot be zero.");
      setLoading(false);
      return;
    }

    if (
      !formData.paidAmount ||
      !isValidNumber(formData.paidAmount) ||
      parseFloat(formData.paidAmount) < 0
    ) {
      setError("Paid amount must be a non-negative number.");
      setLoading(false);
      return;
    }

    // Check if paidAmount exceeds netAmount
    if (parseFloat(formData.paidAmount) > parseFloat(formData.netAmount)) {
      setError("Paid amount cannot exceed net amount.");
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        name: formData.name.trim(),
        passportNumber: formData.passportNumber.trim(),
        validDate: Timestamp.fromDate(formData.validDate), // Convert validDate to Timestamp
        netAmount: parseFloat(formData.netAmount),
        paidAmount: parseFloat(formData.paidAmount),
        paymentStatus: formData.paymentStatus,
        createdAt: Timestamp.now(),
        createdBy: user.uid,
        packageName: selectedPackage?.name || formData.packageName,
      };

      await addDoc(collection(db, "bookings"), bookingData);

      setSuccessMessage("Booking created successfully!");
      setFormData({
        packageName: "",
        name: "",
        passportNumber: "",
        validDate: new Date(), // Reset to current date
        netAmount: "",
        paidAmount: "",
        paymentStatus: "N/A",
      });

      setTimeout(() => {
        router.push("/bookie");
      }, 1000);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError(
        "An error occurred while creating the booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingsView classname = "min-h-screen bg-bgrnd-0"
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      successMessage={successMessage}
      error={error}
      formData={formData}
      DatePicker={DatePicker}
      loading={loading}
      setFormData={setFormData}
      minDate={new Date()} // Pass the minDate prop to BookingsView
    />
  );
};

export default Booking;
