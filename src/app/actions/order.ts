'use server';

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getOrderDetails(orderId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('You must be logged in to view an order.');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order || order.userId !== session.user.id) {
    throw new Error('Order not found or you do not have permission to view it.');
  }

  return order;
}
