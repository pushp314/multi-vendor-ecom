'use client';

import { useEffect, useState } from 'react';
import { getCart } from '@/app/actions/cart';
import { createCheckoutSession } from '@/app/actions/checkout';
import type { Cart, CartItem, Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

// Define a type for CartItem with the full Product object
interface CartItemWithProduct extends CartItem {
  product: Product;
}

// Define a type for the Cart with the extended CartItem
interface DetailedCart extends Omit<Cart, 'items'> {
  items: CartItemWithProduct[];
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const [cart, setCart] = useState<DetailedCart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart()
      .then(cartData => {
        setCart(cartData as DetailedCart | null);
      })
      .finally(() => setLoading(false));
  }, []);

  const subtotal = cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) ?? 0;
  const shipping = 5.00; // Flat rate for now
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    try {
      const { sessionId } = await createCheckoutSession();
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          toast.error(error.message || 'Failed to redirect to checkout.');
        }
      }
    } catch (error) {
      toast.error('Failed to create checkout session.');
    }
  };

  if (loading) {
    return <div>Loading your order...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div>Your cart is empty. <a href="/store">Go shopping!</a></div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Order Summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Items</h2>
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">{item.product.title} (x{item.quantity})</p>
                  <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                </div>
                <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Shipping</p>
                <p>${shipping.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            {/* Add shipping form here */}
            <p className="text-gray-600">Shipping address form will be here.</p>
          </div>
          <div className="mt-8">
            <Button className="w-full" size="lg" onClick={handleCheckout}>Proceed to Payment</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
