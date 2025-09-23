'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters long' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  imageUrl: z.string().url({ message: 'Please upload an image' }),
});

export async function addProduct(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      errors: { auth: ['You must be logged in to add a product'] },
    };
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    imageUrl: formData.get('imageUrl'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    });

    if (!vendor) {
      return {
        errors: { vendor: ['You must be a registered vendor to add a product'] },
      };
    }

    const product = await prisma.product.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        price: validatedFields.data.price,
        vendorId: vendor.id,
        imageUrl: validatedFields.data.imageUrl,
      },
    });

    revalidatePath('/vendor/dashboard');
    revalidatePath('/store');

    return { message: `Product '${product.name}' added successfully!` };
  } catch (error) {
    return {
      errors: { db: ['Failed to add product'] },
    };
  }
}

export async function deleteProduct(productId: string) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      errors: { auth: ['You must be logged in to delete a product'] },
    };
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: session.user.id },
    });

    if (!vendor) {
      return {
        errors: { vendor: ['You are not a registered vendor'] },
      };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.vendorId !== vendor.id) {
      return {
        errors: { auth: ["You are not authorized to delete this product"] },
      };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/vendor/dashboard');
    revalidatePath('/store');

    return { message: `Product '${product.name}' deleted successfully!` };

  } catch (error) {
    return {
      errors: { db: ['Failed to delete product'] },
    };
  }
}
