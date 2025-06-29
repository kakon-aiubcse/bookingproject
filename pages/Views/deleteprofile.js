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
    <div className="flex justify-center">
      {!showDeleteForm ? (
        <button
          onClick={() => setShowDeleteForm(true)}
          className="py-3 px-4 w-[150px] rounded-md text-red-500 bg-bgrnd-0 border border-btton-0 hover:bg-red-700 hover:text-slate-200 hover:border hover:border-btton-0"
        >
          Delete Profile
        </button>
      ) : (
        <div>
          <p className="text-hdline-0 mb-4">
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
            className="border p-2 rounded-lg border-btton-0 ring focus:ring-violet-500 mb-4 w-full"
            disabled={deleting} // Disable input while deleting
          />
          <button
            onClick={handleSubmit}
            disabled={deleting} // Disable button while deleting
            className="py-2 px-4 rounded-md text-bttext-0 bg-btton-0 hover:bg-violet-700"
          >
            {deleting ? "Deleting..." : "Confirm Deletion"}
          </button>
          <button
            onClick={() => setShowDeleteForm(false)}
            className="py-2 px-4 rounded-md text-red-500 bg-bgrnd-0 ml-4"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default DeleteProfile;
