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

export async function getVendorOrders() {
    const session = await getServerSession(authOptions);
  
    if (!session?.user?.id) {
      throw new Error('You must be logged in to view orders.');
    }
  
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    });
  
    if (!vendor) {
      throw new Error('You are not a vendor.');
    }
  
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              vendorId: vendor.id,
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    return orders;
  }

  export async function getCustomerOrders() {
    const session = await getServerSession(authOptions);
  
    if (!session?.user?.id) {
      throw new Error('You must be logged in to view your orders.');
    }
  
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    return orders;
  }
  