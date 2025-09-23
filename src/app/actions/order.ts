'use server';

import { getServerSession } from 'next-auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function fulfillOrder(sessionId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('You must be logged in to fulfill an order.');
  }

  try {
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items.data.price.product'],
    });

    if (stripeSession.payment_status !== 'paid') {
      throw new Error('Payment was not successful.');
    }

    const userId = stripeSession.metadata?.userId;
    const cartId = stripeSession.metadata?.cartId;

    if (!userId || !cartId) {
      throw new Error('Missing metadata from Stripe session.');
    }

    const existingOrder = await prisma.order.findFirst({
      where: { stripeSessionId: stripeSession.id },
    });

    if (existingOrder) {
      return existingOrder;
    }

    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: { include: { product: true } } },
    });

    if (!cart) {
        throw new Error('Cart not found');
    }

    const total = stripeSession.amount_total ? stripeSession.amount_total / 100 : 0;

    const newOrder = await prisma.order.create({
      data: {
        userId,
        stripeSessionId: stripeSession.id,
        total,
        status: 'PAID',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Clear the user's cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return newOrder;

  } catch (error) {
    console.error('Error fulfilling order:', error);
    throw new Error('Failed to fulfill order.');
  }
}
