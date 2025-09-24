'use client';

import { signOut } from 'next-auth/react';

export default function SignOut() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    >
      Sign out
    </button>
  );
}
