'use client';

import { useTransition } from 'react';
import { updateCartItemQuantity, removeCartItem } from '@/app/actions/cart';
import { toast } from 'sonner';
import type { CartItem, Product } from '@prisma/client';
import Image from 'next/image';

interface CartItemWithProduct extends CartItem {
  product: Product;
}

interface CartItemCardProps {
  item: CartItemWithProduct;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (newQuantity: number) => {
    startTransition(() => {
      updateCartItemQuantity(item.id, newQuantity)
        .then(() => toast.success('Cart updated'))
        .catch((err) => toast.error(err.message));
    });
  };

  const handleRemove = () => {
    startTransition(() => {
      removeCartItem(item.id)
        .then(() => toast.success('Item removed from cart'))
        .catch((err) => toast.error(err.message));
    });
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Image src={item.product.images[0]} alt={item.product.name} width={100} height={100} className="rounded-md object-cover" />
      <div className="flex-grow">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor={`quantity-${item.id}`} className="text-sm">Qty:</label>
          <input
            id={`quantity-${item.id}`}
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            className="w-16 p-1 border rounded-md"
            disabled={isPending}
          />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
        <button onClick={handleRemove} className="text-red-500 hover:underline text-sm" disabled={isPending}>
          Remove
        </button>
      </div>
    </div>
  );
}
