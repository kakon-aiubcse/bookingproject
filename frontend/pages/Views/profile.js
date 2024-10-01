import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  getAuth,
  onAuthStateChanged,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import Header from "../../pages/component/header";
import DeleteProfile from "./deleteprofile";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [reAuthError, setReAuthError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

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
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleDeleteProfile = async (password) => {
    if (!password) {
      setReAuthError("Password is required for re-authentication");
      return;
    }

    setDeleting(true);
    setReAuthError(null);
    setError(null);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          password
        );
        await reauthenticateWithCredential(currentUser, credential);

        // Delete user document from Firestore
        const userDoc = doc(db, "users", currentUser.uid);
        await deleteDoc(userDoc);

        // Delete user from Firebase Authentication
        await deleteUser(currentUser);

        // Redirect after deletion
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setReAuthError("Error deleting user profile. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteForm(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage("User is not authenticated.");
        return; // Exit if the user is not authenticated
      }

      let imageURL = formData.pic; // Set the current image URL from formData

      if (profileImage) {
        const storage = getStorage();
        const imageRef = ref(storage, `profileImages/${user.uid}`);

        // Upload the new profile image
        await uploadBytes(imageRef, profileImage);
        imageURL = await getDownloadURL(imageRef); // Update the image URL with the new image
      } else {
        console.log("No new profile image selected. ");
      }

      // Add image URL to formData (whether new or existing)
      const updatedFormData = { ...formData, pic: imageURL };

      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, updatedFormData); // Update Firestore with new data

      setUserDetails(updatedFormData); // Update the state with new data
      setEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("There was an error updating your profile. Please try again.");
    }
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

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  return (
    <div className=" overflow-hidden h-[679px]">
      <Header />
      <div
        className="relative flex flex-col overflow-hidden h-[58px] justify-center items-center min-h-screen  "
        style={{
          minHeight: "100vh",
          backgroundImage: `url(${userDetails.pic || "/usericon.svg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0  bg-black/30 backdrop-blur-3xl"></div>
        <div className="relative z-10  max-w-6xl mb-24 w-full bg-slate-200 shadow-lg rounded-lg  flex flex-col md:flex-row">
          {/* Left side: User picture and Delete button */}
          <div className="w-full  border-r-2 border-black md:w-1/3 flex flex-col items-center space-y-6 p-8 bg-slate-200 rounded-lg">
            {/* Profile Picture */}
            <div
              className="relative w-40 h-40 rounded-full overflow-hidden shadow-md bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${userDetails.pic || "/usericon.svg"})`,
              }} // Fallback to default icon
            >
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-semibold"></span>
              </div>
            </div>

            {/* Delete Profile Button */}
            <div className="mt-4">
              <DeleteProfile
                showDeleteForm={showDeleteForm}
                handleDeleteProfile={handleDeleteProfile}
                reAuthError={reAuthError}
                deleting={deleting}
                setShowDeleteForm={setShowDeleteForm}
              />
            </div>
          </div>

          {/* Right side: User profile details and edit form */}
          <div className="w-full md:w-2/3 p-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
              Profile
            </h1>

            <div className=" space-y-6">
              {userDetails && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-semibold text-gray-600 w-1/3 text-right">
                      Email:
                    </label>
                    <span
                      className={`text-gray-800 w-2/3 truncate ${
                        editMode ? "" : ""
                      }`}
                    >
                      {editMode ? formData.email : userDetails.email || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <label className="font-semibold text-gray-600 w-1/3 text-right">
                      Password:
                    </label>

                    {editMode ? (
                      <div className="flex items-center w-2/3">
                        <span className="text-gray-800 truncate">
                          {formData.password}
                        </span>
                        <Link href="/resetpass">
                          <button className="bg-rose-500 text-white ml-6 py-2 px-6 rounded-md hover:bg-rose-600 transition duration-200">
                            Reset Password?
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <span className="text-gray-800 w-2/3 truncate">
                        {userDetails.password || "N/A"}
                      </span>
                    )}
                  </div>

                  {/* Name Field */}
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-semibold text-gray-600 w-1/3 text-right">
                      Name:
                    </label>
                    {editMode ? (
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-2/3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    ) : (
                      <span className="text-gray-800 w-2/3 truncate">
                        {userDetails.name || "N/A"}
                      </span>
                    )}
                  </div>

                  {/* Email Field */}

                  {/* Phone Field */}
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-semibold text-gray-600 w-1/3 text-right">
                      Phone:
                    </label>
                    {editMode ? (
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 w-2/3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    ) : (
                      <span className="text-gray-800 w-2/3 truncate">
                        {userDetails.mobile || "N/A"}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* Profile Picture Upload */}
            <div className="flex items-center pl-20 ml-4 justify-between gap-4">
              {editMode && (
                <div className="flex items-center mt-4 space-x-4">
                  <span className="text-sm font-medium text-gray-700">
                    Change Profile Picture:
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      onProfileImageChange(event);
                      console.log("File input changed:", event.target.files[0]); // Check the file
                    }}
                    className="inline-block text-sm text-gray-500 border border-slate-300
    file:mr-4 file:py-2 file:px-4
    file:rounded-full file:border-0
    file:text-sm file:font-semibold
    file:bg-white file:text-black
    hover:file:bg-white-600 hover:file:text-black
    focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50
    transition duration-150 ease-in-out"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center">
              {editMode ? (
                <div className="flex space-x-6">
                  <button
                    onClick={handleUpdate}
                    className="bg-slate-800 text-rose-500 py-2 px-6 rounded-md hover:bg-slate-950 transition duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-rose-500 text-white py-2 px-6 rounded-md hover:bg-rose-600 transition duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
