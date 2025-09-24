import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside>
          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard/orders" className="font-semibold text-lg hover:text-blue-500">
              My Orders
            </Link>
            {/* Add other dashboard links here */}
          </nav>
        </aside>
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
