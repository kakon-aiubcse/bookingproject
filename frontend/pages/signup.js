import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, name, mobile } = formData;

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        mobile,
      });

      console.log("Sign Up successful");
      router.push("/"); // Redirect to home or another page
    } catch (error) {
      setMessage(error.message);
      console.error('Sign Up error:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 p-4">
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-2xl border border-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-base font-semibold text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-base font-semibold text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>
        <div>
          <label htmlFor="mobile" className="block text-base font-semibold text-gray-700">
            Mobile
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-base font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 text-white bg-blue-600 rounded-lg text-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-200"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-6 py-3 text-white bg-gray-600 rounded-lg text-lg font-bold hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-500 transition duration-200"
          >
            Go Back
          </button>
        </div>
      </form>
      {message && <p className="mt-4 text-center text-red-600 text-sm">{message}</p>}
    </div>
  </div>
  


  );
}
