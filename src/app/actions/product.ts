'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { productSchema } from '@/lib/schemas/product';
import { getCurrentUser } from '@/lib/session';

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'VENDOR') {
    return {
      error: 'You must be a vendor to create a product.',
    };
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    images: formData.getAll('images'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.product.create({
      data: {
        vendorId: user.id,
        ...validatedFields.data,
      },
    });

    revalidatePath('/vendor/products'); // Revalidate the products page
    return {
      message: 'Product created successfully.',
    };
  } catch (error) {
    console.error('Failed to create product:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'VENDOR') {
    return {
      error: 'You must be a vendor to update a product.',
    };
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    images: formData.getAll('images'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.vendorId !== user.id) {
      return {
        error: 'Product not found or you do not have permission to update it.',
      };
    }

    await db.product.update({
      where: { id: productId },
      data: validatedFields.data,
    });

    revalidatePath('/vendor/products');
    return {
      message: 'Product updated successfully.',
    };
  } catch (error) {
    console.error('Failed to update product:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function deleteProduct(productId: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'VENDOR') {
    return {
      error: 'You must be a vendor to delete a product.',
    };
  }

  try {
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.vendorId !== user.id) {
      return {
        error: 'Product not found or you do not have permission to delete it.',
      };
    }

    await db.product.delete({ where: { id: productId } });

    revalidatePath('/vendor/products');
    return {
      message: 'Product deleted successfully.',
    };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
