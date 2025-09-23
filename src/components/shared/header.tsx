'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { getCart } from '@/app/actions/cart';
import { ShoppingBag, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session } = useSession();
  const { openCart } = useCartStore();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    async function fetchCart() {
      const cart = await getCart();
      const count = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
      setCartItemCount(count);
    }

    if (session?.user) {
      fetchCart();
    }
  }, [session]);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          ModernWear
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/store" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Store
          </Link>

          {session?.user.role === 'VENDOR' && (
            <Link href="/vendor/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Dashboard
            </Link>
          )}

          <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
            <ShoppingBag className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Welcome, {session.user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
