'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitReview } from '@/app/actions/reviews';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const initialState = { success: false, message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Submitting...' : 'Submit Review'}</Button>;
}

export default function ReviewForm({ productId, hasPurchased }: { productId: string, hasPurchased: boolean }) {
  const [state, formAction] = useFormState(submitReview, initialState);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  if (!hasPurchased) {
    return null; // Or show a message that only purchasers can review
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="productId" value={productId} />
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <input type="hidden" name="rating" value={rating} />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Review Title</label>
          <Input id="title" name="title" placeholder="e.g., Great product!" required />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-1">Your Review</label>
          <Textarea id="comment" name="comment" placeholder="Write your detailed thoughts here..." required />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}
