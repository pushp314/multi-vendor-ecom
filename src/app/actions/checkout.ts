'use server';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function createRazorpayOrder() {
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

  const options = {
    amount: Math.round(total * 100), // amount in the smallest currency unit
    currency: "USD",
    receipt: `receipt_order_${new Date().getTime()}`,
    notes: {
      userId,
      cartId: cart.id,
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    if (!order) {
        throw new Error("Could not create Razorpay order");
    }
    return { order };
  } catch (error) {
    console.error(error);
    throw new Error('Could not create Razorpay order');
  }
}
