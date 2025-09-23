'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getCart() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  return cart;
}

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error('You must be logged in to add items to the cart.');
  }

  const userId = session.user.id;

  try {
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    revalidatePath('/store');
    revalidatePath('/cart');

    return { success: true, message: 'Item added to cart' };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, message: 'Failed to add item to cart' };
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    return removeCartItem(itemId);
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  revalidatePath('/cart');
}

export async function removeCartItem(itemId: string) {
  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  revalidatePath('/cart');
}
