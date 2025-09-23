import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

async function getUserOrders() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true,
    },
  });

  return orders;
}

export default async function MyOrdersPage() {
  const orders = await getUserOrders();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500">You haven't placed any orders yet.</p>
          <Link href="/store" passHref>
            <Button className="mt-4">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold">Order #{order.id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className={`text-sm font-medium ${order.status === 'PAID' ? 'text-green-500' : 'text-yellow-500'}`}>
                    Status: {order.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.items.length} items</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <Link href={`/profile/orders/${order.id}`} passHref>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
