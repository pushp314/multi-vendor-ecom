'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

export default function CartSummary({ subtotal, shipping, total }: CartSummaryProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <p>Subtotal</p>
        <p>${subtotal.toFixed(2)}</p>
      </div>
      <div className="flex justify-between mb-2">
        <p>Shipping</p>
        <p>${shipping.toFixed(2)}</p>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <div className="flex justify-between font-bold text-lg">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
      <Link href="/checkout" passHref>
        <Button className="w-full mt-6">Proceed to Checkout</Button>
      </Link>
    </div>
  );
}
