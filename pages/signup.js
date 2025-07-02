import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Header from "./component/header";
import SignupView from "./Views/signupview";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
 
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser && router.pathname !== "/Views/homepage") {
        router.push("/Views/homepage");
      }

      if (!currentUser && router.pathname !== "/signup") {
        router.push("/signup");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const validate = () => {
    const errors = {};
    const { name = "", email = "", mobile = "", password = "" } = formData;

    // Validate Name
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = "Name must contain only letters and spaces";
    } else if (name.replace(/\s+/g, "").length < 3) {
      // Check for at least 3 letters
      errors.name = "Name must contain at least 3 letters";
    }

    // Validate Email
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[a-zA-Z\d._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.email = "Email must be in the format something12@domain.com";
    }

    if (!mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{7,12}$/.test(mobile)) {
      errors.mobile = "Mobile number must be between 7 and 12 digits";
    }

    // Validate Password
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6 || password.length > 16) {
      errors.password = "Password must be between 6 and 16 characters long";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/\d/.test(password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password = "Password must contain at least one special character";
    }

    // Validation logic...

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file); // Store the selected file
      console.log("Selected file:", file.name); // Log the selected file name
    } else {
      console.log("No file selected");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Profile image state before upload:", profileImage); // Log the state

    if (!profileImage) {
      console.log("No profile image selected");
      setMessage("Please select a profile image.");
      return; // Exit if no image is selected
    }

    setLoading(true);
    const { email = "", password = "", name = "", mobile = "" } = formData;

    let imageURL = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const storage = getStorage();
      const imageRef = ref(storage, `profileImages/${user.uid}`);
      await uploadBytes(imageRef, profileImage);
      imageURL = await getDownloadURL(imageRef);

      const userDoc = doc(db, "users", user.uid);
      const userData = {
        uid: user.uid,
        name,
        email,
        mobile,
        pic: imageURL,
        password,
        createdAt: new Date().toISOString(),
      };

      await setDoc(userDoc, userData);
      setMessage("Created new User");
      router.push("/login");
    } catch (error) {
      console.error("Error creating user or uploading image:", error.message);
      setMessage("Error creating user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <>
      <Header />
      <div className="overflow-hidden  xs:bg-bgrnd-0 xs:relative xs:mt-[-5px] ">
        <SignupView
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          onProfileImageChange={onProfileImageChange} // Ensure this is passed
          message={message}
          errors={errors}
          formData={formData}
          loading={loading}
          toggleShowPassword={toggleShowPassword}
          showPassword={showPassword}
          setLoading= {setLoading}
        />
        {profileImage && <p>Selected file: {profileImage.name}</p>}{" "}
        {/* Feedback on file selection */}
      </div>
    </>
  );
}
