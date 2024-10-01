import React, { useState } from "react";

const DeleteProfile = ({
  handleDeleteProfile,
  showDeleteForm,
  reAuthError,
  deleting,
  setShowDeleteForm,
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    handleDeleteProfile(password);
    setPassword(""); // Clear password after submission
  };

  return (
    <div className="flex justify-center mt-6">
      {!showDeleteForm ? (
        <button
          onClick={() => setShowDeleteForm(true)}
          className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-700"
        >
          Delete Profile
        </button>
      ) : (
        <div>
          <p className="text-red-600 mb-4">
            Please re-authenticate to confirm deletion:
          </p>
          {reAuthError && (
            <div className="text-red-600 mb-4" aria-live="assertive">
              {reAuthError}
            </div>
          )}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-4 w-full"
            disabled={deleting} // Disable input while deleting
          />
          <button
            onClick={handleSubmit}
            disabled={deleting} // Disable button while deleting
            className="py-2 px-4 rounded-md text-white bg-red-500 hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Confirm Deletion"}
          </button>
          <button
            onClick={() => setShowDeleteForm(false)}
            className="py-2 px-4 rounded-md text-white bg-gray-500 hover:bg-gray-700 ml-4"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteProfile;
