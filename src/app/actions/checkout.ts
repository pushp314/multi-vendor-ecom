'use server';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function createPaymentIntent() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const userId = session.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error('Your cart is empty.');
  }

  const subtotal = cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = 5.00; // Flat rate
  const total = subtotal + shipping;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: 'usd',
    metadata: { userId, cartId: cart.id },
  });

  return { clientSecret: paymentIntent.client_secret };
}
