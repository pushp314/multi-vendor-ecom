import { fulfillOrder } from "@/app/actions/order";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    notFound();
  }

  try {
    const order = await fulfillOrder(sessionId);

    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">Payment Successful!</h1>
          <p className="mt-2">Thank you for your order. A confirmation email has been sent to you.</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.product.title} (x{item.quantity})</p>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex justify-between font-bold text-lg">
              <p>Total Paid</p>
              <p>${order.total.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-gray-600">Order ID: {order.id}</p>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/store" passHref>
            <Button>Continue Shopping</Button>
          </Link>
          <Link href="/profile/orders" passHref>
            <Button variant="outline" className="ml-4">View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">Error Processing Order</h1>
          <p className="mt-2">There was an issue processing your order. Please contact support.</p>
        </div>
      </div>
    );
  }
}
