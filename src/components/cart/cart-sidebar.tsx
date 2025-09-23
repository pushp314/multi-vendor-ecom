'use client';

import { useEffect, useState, useTransition } from 'react';
import { useCartStore } from '@/store/cart-store';
import { getCart, updateCartItemQuantity, removeCartItem } from '@/app/actions/cart';
import type { Cart, CartItem, Product } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { X, ShoppingBag, Minus, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// Define a type for CartItem with the full Product object
interface CartItemWithProduct extends CartItem {
  product: Product;
}

// Define a type for the Cart with the extended CartItem
interface DetailedCart extends Omit<Cart, 'items'> {
  items: CartItemWithProduct[];
}

export default function CartSidebar() {
  const { isOpen, closeCart } = useCartStore();
  const [cart, setCart] = useState<DetailedCart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const refreshCart = () => {
    setIsLoading(true);
    getCart()
      .then(cartData => {
        setCart(cartData as DetailedCart | null);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      refreshCart();
    }
  }, [isOpen]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    startTransition(async () => {
      await updateCartItemQuantity(itemId, newQuantity);
      refreshCart();
      toast.success('Cart updated');
    });
  };

  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      await removeCartItem(itemId);
      refreshCart();
      toast.success('Item removed from cart');
    });
  };

  const subtotal = cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) ?? 0;
  const isMutating = isLoading || isPending;

  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50 flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <Button variant="ghost" size="icon" onClick={closeCart}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      {isMutating && <Loader2 className="absolute top-1/2 left-1/2 h-8 w-8 animate-spin" />}
      
      <div className={`flex-grow ${isMutating ? 'opacity-50' : ''}`}>
        {isLoading && cart === null ? (
          <div className="flex-grow flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center h-full">
            <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-sm text-gray-500">Add some products to get started.</p>
          </div>
        ) : (
          <div className="overflow-y-auto p-4 h-full">
            {cart.items.map(item => (
              <div key={item.id} className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm">{item.product.title}</h4>
                  <p className="text-xs text-gray-500">${item.product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={isMutating}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} disabled={isMutating}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500" onClick={() => handleRemoveItem(item.id)} disabled={isMutating}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart && cart.items.length > 0 && (
        <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isMutating ? 'opacity-50' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">Subtotal</p>
            <p className="font-semibold">${subtotal.toFixed(2)}</p>
          </div>
          <Link href="/checkout" passHref>
            <Button className="w-full" onClick={closeCart} disabled={isMutating}>Proceed to Checkout</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
