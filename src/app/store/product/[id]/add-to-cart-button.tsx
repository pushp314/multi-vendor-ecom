'use client';

import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { addToCart } from '@/app/actions/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useTransition } from 'react';

export default function AddToCartButton({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    if (!session?.user) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }
    startTransition(async () => {
      const result = await addToCart(productId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button size="lg" className="w-full text-lg" onClick={handleAddToCart} disabled={isPending}>
      {isPending ? (
        'Adding...'
      ) : (
        <>
          <ShoppingCart className="h-6 w-6 mr-3" /> Add to Cart
        </>
      )}
    </Button>
  );
}
