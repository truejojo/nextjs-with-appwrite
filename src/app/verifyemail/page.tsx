'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const [token] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return params.get('token') ?? '';
  });
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  async function verifyUserEmailRequest(t: string, signal?: AbortSignal) {
    return fetch('/api/users/verifyemail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: t }),
      signal,
    });
  }

  function extractMessage(data: unknown): string | undefined {
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const m = (data as { message?: unknown }).message;
      return typeof m === 'string' ? m : undefined;
    }
    return undefined;
  }

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    let active = true;

    (async () => {
      try {
        const res = await verifyUserEmailRequest(token, controller.signal);
        if (!active) return;

        if (res.ok) {
          setVerified(true);
          setError('');
        } else {
          let data: unknown = null;
          try {
            data = await res.json();
          } catch {}
          setVerified(false);
          setError(extractMessage(data) ?? 'Verifizierung fehlgeschlagen');
        }
      } catch (err) {
        if (!active) return;
        const msg = err instanceof Error ? err.message : String(err);
        setVerified(false);
        setError(msg);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : 'No token found in URL'}
      </h2>

      {verified && (
        <>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login" className="text-blue-500 underline">
            Login
          </Link>
        </>
      )}

      {error && <h2 className="text-2xl">Error</h2>}
    </div>
  );
}
