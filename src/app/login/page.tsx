'use client';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();

      console.log('Login successful', data);
      toast.success('Login successful');

      router.push('/profile');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.log('Login failed', message);

      toast.error('Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? 'Loading...' : 'Login Page'}</h1>
      <hr />
      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        type="email"
        id="email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="your email..."
      />
      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
        type="password"
        id="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="your password..."
      />
      <button
        type="button"
        className={`px-6 py-2 ${buttonDisabled ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded-lg`}
        onClick={onLogin}
        disabled={buttonDisabled}
      >
        {buttonDisabled ? 'No login' : 'Login'}
      </button>
      <Link href="/signup" className="mt-4 text-blue-500 underline">
        Do not have an account? Sign Up
      </Link>
    </div>
  );
}
