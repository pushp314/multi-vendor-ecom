import { prisma } from '@/lib/prisma';
import { Star } from 'lucide-react';

async function getReviews(productId: string) {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  return reviews;
}

export default async function ReviewList({ productId }: { productId: string }) {
  const reviews = await getReviews(productId);

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review this product!</p>
      ) : (
        <div className="space-y-8">
          {reviews.map(review => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center mb-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${review.rating > i ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="ml-4 font-semibold">{review.user.name}</p>
              </div>
              <h4 className="font-semibold text-lg mb-1">{review.title}</h4>
              <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
              <p className="text-xs text-gray-500 mt-2">Reviewed on {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
