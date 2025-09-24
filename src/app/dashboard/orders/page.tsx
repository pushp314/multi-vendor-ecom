import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/utils';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  return orders;
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const orders = await getOrders(session.user.id);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-500">You haven't placed any orders yet.</p>
          <Link href="/store">
            <Button className="mt-4">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <Link href={`/dashboard/orders/${order.id}`}>
                  <Button variant="outline">View Details</Button>
                </Link>
              </div>
              <div>
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 mb-2">
                    <img src={item.product.images[0]} alt={item.product.title} className="w-16 h-16 rounded-md object-cover" />
                    <div>
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
