import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase'; // Adjust the import path as necessary
import { doc, getDoc } from 'firebase/firestore';
import Header from './component/header';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Fetch user details from Firestore
          const userDoc = doc(db, 'users', currentUser.uid); // Adjust collection name as necessary
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUserDetails(userSnapshot.data());
          } else {
            setError('User details not found');
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
          setError('Error fetching user details');
        } finally {
          setLoading(false);
        }
      } else {
        // Redirect to login page if not authenticated
        router.push('/login');
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div><Header/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-lg shadow-2xl border border-gray-300">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 sm:mb-8 text-center text-gray-900">Profile</h1>
        <div className="space-y-4">
          {userDetails && (
            <>
              <div>
                <span className="font-semibold text-gray-700">Name:</span> {userDetails.name || 'N/A'}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Email:</span> {userDetails.email || 'N/A'}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Phone:</span> {userDetails.mobile || 'N/A'}
              </div>
              {/* Add more user details as needed */}
            </>
          )}
        </div>
        
      </div>
    </div></div>
  );
};

export default ProfilePage;
