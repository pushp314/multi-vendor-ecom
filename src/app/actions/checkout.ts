'use server';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import crypto from 'crypto';

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

export async function verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('You must be logged in to verify a payment.');
  }

  const userId = session.user.id;
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest !== razorpay_signature) {
    throw new Error('Invalid signature');
  }

  const order = await razorpay.orders.fetch(razorpay_order_id);

  if (!order) {
    throw new Error('Razorpay order not found');
  }

  if (order.notes?.userId !== userId) {
    throw new Error('Order does not belong to the current user');
  }

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

  if (!cart) {
    throw new Error('Cart not found');
  }

  const newOrder = await prisma.order.create({
    data: {
      userId,
      total: order.amount / 100,
      status: 'PAID',
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  await prisma.cart.delete({
    where: { id: cart.id },
  });

  return { orderId: newOrder.id };
}
