import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { Providers } from './providers';
import { authOptions } from './api/auth/[...nextauth]/route';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next-Gen E-commerce',
  description: 'A modern e-commerce platform built with Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                Next-Gen Store
              </Link>
              <div>
                {session?.user ? (
                  <div className="flex items-center space-x-4">
                    <span>Welcome, {session.user.name}</span>
                    <Link href="/orders">My Orders</Link>
                    <a href="/api/auth/signout">Logout</a>
                  </div>
                ) : (
                  <a href="/api/auth/signin">Login</a>
                )}
              </div>
            </nav>
          </header>
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
