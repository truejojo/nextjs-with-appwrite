'use client';

import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserI } from '@/types/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserI | null>(null);

  const logout = async () => {
    try {
      const response = await fetch('/api/users/logout', { method: 'GET' });
      const data = await response.json();

      // if (response.ok) {
      console.log(data.message);
      toast.success(data.message);
      router.push('/login');
      // } else {
      //   console.log("Error: " + data.message);
      //   toast.error("Error: " + data.message);
      // }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('Internal Server Error: ' + message);
      toast.error('Internal Server Error: ' + message);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await fetch('/api/users/me', { method: 'GET' });
      const data = await response.json();
      if (response.ok) {
        console.log('User Details: ', data.data);
        toast.success('User Details fetched successfully');
        setUser(data.data);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('Internal Server Error: ' + message);
      toast.error('Internal Server Error: ' + message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p>This is the profile page.</p>
      <p className="border border-amber-500 px-6 py-2">
        {user ? `Welcome, ${user.username}` : 'No user data available'}
      </p>
      <button
        type="button"
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold uppercase py-2 px-6 rounded"
      >
        Logout
      </button>
      <button
        type="button"
        onClick={getUserDetails}
        className="bg-green-500 mt-4 hover:bg-green-700 text-white font-bold uppercase py-2 px-6 rounded"
      >
        Get User Details
      </button>
    </div>
  );
}
