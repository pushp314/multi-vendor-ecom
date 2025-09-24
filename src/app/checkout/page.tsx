'use client';

import { useEffect, useState } from 'react';
import { getCart } from '@/app/actions/cart';
import { createPaymentIntent } from '@/app/actions/checkout';
import type { Cart, CartItem, Product } from '@prisma/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/checkout/checkout-form';

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
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    getCart()
      .then(async (cartData) => {
        setCart(cartData as DetailedCart | null);
        if (cartData && cartData.items.length > 0) {
          const { clientSecret } = await createPaymentIntent();
          setClientSecret(clientSecret);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const subtotal = cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) ?? 0;
  const shipping = 5.00; // Flat rate for now
  const total = subtotal + shipping;

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return <div className="container mx-auto px-4 py-12 text-center">Your cart is empty. <a href="/store" className="text-blue-500 hover:underline">Go shopping!</a></div>;
  }

  const appearance = {
    theme: 'stripe',
  };

  const options: any = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">{item.product.name} (x{item.quantity})</p>
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
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}
