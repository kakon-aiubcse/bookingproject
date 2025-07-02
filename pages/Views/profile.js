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
    <div className=" overflow-hidden bg-bgrnd-0 xs:min-h-screen">
      <Header />
      <div className="relative flex flex-col overflow-hidden  justify-center items-center min-h-screen x ">
        <h1 className="text-3xl p-5 m-5 font-ios flex flex-col items-center justify-center font-extrabold text-hdline-0">
          Profile details.
        </h1>
        <div className=" w-screen  min-h-screen  flex flex-row xs:flex xs:flex-col xs:items-center xs:justify-center ">
          {/* 1st side: User picture and Delete button */}
          <div className="w-1/3  h-screen flex flex-col items-end justify-start   p-3 m-3 xs:w-screen xs:h-auto xs:items-center xs:justify-center">
            {/* Profile Picture */}
            <div
              className="relative w-40 h-44 rounded-md bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${userDetails.pic || "/usericon.svg"})`,
              }} // Fallback to default icon
            >
             
            </div>
          </div>

          {/* 2nd side: User profile details and edit form */}
          <div className="w-1/3  h-screen flex flex-col items-start justify-start p-3 m-3 xs:w-screen xs:h-auto xs:items-center xs:justify-center">
            <div className=" space-y-6">
              {userDetails && (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-semibold text-scdry-0 w-1/3 text-left">
                      Email:
                    </label>
                    <span
                      className={`text-bttext-0   ${
                        editMode ? "text-red-500" : ""
                      }`}
                    >
                      {editMode ? formData.email : userDetails.email || "N/A"}
                    </span>
                  </div>

                  {/* <div className="flex items-center justify-between gap-4" >
                    <label className="font-semibold text-scdry-0 w-1/3 text-left" aria-disabled>
                      Password:
                    </label>

                    {editMode ? (
                      <div className="flex items-center w-2/3">
                        <span className="text-red-500 truncate">
                          {formData.password}
                        </span>
                      </div>
                    ) : (
                      <span className="text-bttext-0 w-2/3 truncate">
                        {userDetails.password || "N/A"}
                      </span>
                    )}
                  </div> */}

                  {/* Name Field */}
                  <div className="flex items-center justify-between gap-4">
                    <label className="font-semibold text-scdry-0 w-1/3 text-left">
                      Name:
                    </label>
                    {editMode ? (
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-violet-500 p-2 w-2/3 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 transition"
                      />
                    ) : (
                      <span className="text-bttext-0 w-2/3 truncate">
                        {userDetails.name || "N/A"}
                      </span>
                    )}
                  </div>

                 

                  {/* Phone Field */}
                  <div className="flex items-center justify-between gap-4 ">
                    <label className="font-semibold text-scdry-0 w-1/3 text-left">
                      Phone:
                    </label>
                    {editMode ? (
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="border border-violet-500 p-2 w-2/3 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600 transition"
                      />
                    ) : (
                      <span className="text-bttext-0 w-2/3 truncate">
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
                <div className="flex items-center mt-4 relative right-24 space-x-4">
                  <span className="text-sm font-medium text-scdry-0 xs:text-xs xs:relative xs:left-[40px]">
                    Change Profile Picture:
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      onProfileImageChange(event);
                      console.log("File input changed:", event.target.files[0]); // Check the file
                    }}
                    className="inline-block text-sm text-bttext-0 border border-violet-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-btton-0 file:text-bttext-0
                    hover:file:bg-btton-0 hover:file:text-bttext-0
                    focus:outline-none focus:ring-2 focus:ring-btton-0 focus:ring-opacity-50
                    transition duration-150 ease-in-out xs:relative xs:left-[40px]"
                  />
                </div>
              )}
            </div>
          </div>
          {/* 3rd side: User profile details and edit form */}
          <div className="w-1/3 h-screen flex flex-col space-y-5 items-start justify-start p-3 m-3 xs:w-screen xs:h-auto xs:items-center xs:justify-center">
            {/* Action Buttons */}
         <div className="flex xs:order-3 ">
              <Link href="/resetpass">
              <button className="bg-bgrnd-0 border border-btton-0 text-bttext-0  py-3 px-4 rounded-md  transition duration-200">
                Reset Password
              </button>
            </Link>
            </div>
           
               <div className="flex xs:order-1 ">
              {editMode ? (
                <div className="flex space-x-6">
                  <button
                    onClick={handleUpdate}
                    className="bg-btton-0  text-bttext-0 py-2 px-6 rounded-md hover:bg-violet-600 transition duration-200 xs:px-2 xs:mb-3"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className=" text-red-500 py-2 px-6 rounded-md hover:text-red-800 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="bg-btton-0 w-[150px] text-bttext-0 py-3 px-4 rounded-md  transition duration-200 xs:mb-3"
                  >
                    Edit Profile
                  </button>
                  {/* Delete Profile Button */}
                </>
              )}
            </div>
             <div className="flex xs:order-3 ">
              <DeleteProfile
                showDeleteForm={showDeleteForm}
                handleDeleteProfile={handleDeleteProfile}
                reAuthError={reAuthError}
                deleting={deleting}
                setShowDeleteForm={setShowDeleteForm}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
