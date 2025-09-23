'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500),
  productId: z.string(),
});

export async function submitReview(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, message: 'You must be logged in to submit a review.' };
  }

  const parsed = reviewSchema.safeParse({
    rating: formData.get('rating'),
    title: formData.get('title'),
    comment: formData.get('comment'),
    productId: formData.get('productId'),
  });

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.', errors: parsed.error.flatten().fieldErrors };
  }

  const { productId, rating, title, comment } = parsed.data;
  const userId = session.user.id;

  try {
    // Check if the user has purchased this product
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId,
        status: 'PAID', // Or DELIVERED, depending on your business logic
        items: {
          some: {
            productId,
          },
        },
      },
    });

    if (!hasPurchased) {
      return { success: false, message: 'You can only review products you have purchased.' };
    }

    // Check if the user has already reviewed this product
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingReview) {
      return { success: false, message: 'You have already reviewed this product.' };
    }

    await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        title,
        comment,
      },
    });

    revalidatePath(`/store/product/${productId}`);
    return { success: true, message: 'Thank you for your review!' };

  } catch (error) {
    console.error('Error submitting review:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
