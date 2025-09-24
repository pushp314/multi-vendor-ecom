'use client';

import { useEffect, useState } from 'react';
import { getCustomerOrders } from '@/app/actions/order';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const customerOrders = await getCustomerOrders();
        setOrders(customerOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setLoading(false);
    }

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p>Status: {order.status}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="font-semibold">Items:</h2>
                <ul className="list-disc list-inside space-y-2">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>{item.product.name} - {item.quantity} x ${item.price.toFixed(2)}</span>
                      {order.status === 'COMPLETED' && (
                        <Link href={`/orders/${order.id}/review/${item.product.id}`}>
                          <Button variant="outline" size="sm">Leave a Review</Button>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
