'use client';

import { useEffect, useState } from 'react';
import { getCart } from '@/app/actions/cart';
import type { Cart, CartItem, Product } from '@prisma/client';
import CartItemCard from '@/components/cart/cart-item-card';
import CartSummary from '@/components/cart/cart-summary';
import Link from 'next/link';

// Define a type for CartItem with the full Product object
interface CartItemWithProduct extends CartItem {
  product: Product;
}

// Define a type for the Cart with the extended CartItem
interface DetailedCart extends Omit<Cart, 'items'> {
  items: CartItemWithProduct[];
}

export default function CartPage() {
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
  const shipping = 5.00; // Flat rate
  const total = subtotal + shipping;

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/store" passHref>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">Go Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map(item => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div>
          <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
        </div>
      </div>
    </div>
  );
}
