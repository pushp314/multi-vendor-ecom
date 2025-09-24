'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function Home() {
  const { data: session } = useSession();
  const products = await prisma.product.findMany();

  return (
    <div>
      <div className="flex justify-end mb-4">
        {session ? (
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => signIn('google')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Sign in with Google
          </button>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      {products.length === 0 ? (
        <p>No products found. Please check back later.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-4">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-full h-64 object-cover mb-4 rounded-md"
                />
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-500">${product.price.toFixed(2)}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
