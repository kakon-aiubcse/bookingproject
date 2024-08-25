import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';  
import { signInWithEmailAndPassword } from 'firebase/auth';  

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);  // Add loading state

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');  // Reset the message state before submission
    setLoading(true); // Set loading state to true
    try {
      await signInWithEmailAndPassword(auth, email, password);  // Use auth here
      console.log("Login successful");
      router.push("/bookings");
    } catch (error) {
      // Log the entire error object for debugging
      console.error('Login error:', error);
      // Extract and display more detailed error message
      let errorMessage = 'An unknown error occurred. Please try again.';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials provided.';
      }
      setMessage(errorMessage);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
    <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-lg shadow-2xl border border-gray-300">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-gray-900">Login</h1>
      {message && (
        <p className="text-red-600 text-center mb-4 sm:mb-6 text-sm">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm sm:text-base"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm sm:text-base font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm sm:text-base"
          />
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-white bg-blue-700 rounded-lg text-base sm:text-lg font-bold hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-white bg-gray-700 rounded-lg text-base sm:text-lg font-bold hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-600 transition duration-200"
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  </div>
  
  
  );
}
