'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { addressSchema } from '@/lib/schemas/address';
import { getCurrentUser } from '@/lib/session';

export async function createAddress(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: 'You must be logged in to create an address.',
    };
  }

  const validatedFields = addressSchema.safeParse({
    line1: formData.get('line1'),
    line2: formData.get('line2'),
    city: formData.get('city'),
    state: formData.get('state'),
    country: formData.get('country'),
    postalCode: formData.get('postalCode'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await db.address.create({
      data: {
        userId: user.id,
        ...validatedFields.data,
      },
    });

    revalidatePath('/account/addresses'); // Revalidate the addresses page
    return {
      message: 'Address created successfully.',
    };
  } catch (error) {
    console.error('Failed to create address:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function updateAddress(addressId: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: 'You must be logged in to update an address.',
    };
  }

  const validatedFields = addressSchema.safeParse({
    line1: formData.get('line1'),
    line2: formData.get('line2'),
    city: formData.get('city'),
    state: formData.get('state'),
    country: formData.get('country'),
    postalCode: formData.get('postalCode'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== user.id) {
      return {
        error: 'Address not found or you do not have permission to update it.',
      };
    }

    await db.address.update({
      where: { id: addressId },
      data: validatedFields.data,
    });

    revalidatePath('/account/addresses');
    return {
      message: 'Address updated successfully.',
    };
  } catch (error) {
    console.error('Failed to update address:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function deleteAddress(addressId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      error: 'You must be logged in to delete an address.',
    };
  }

  try {
    const address = await db.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== user.id) {
      return {
        error: 'Address not found or you do not have permission to delete it.',
      };
    }

    await db.address.delete({ where: { id: addressId } });

    revalidatePath('/account/addresses');
    return {
      message: 'Address deleted successfully.',
    };
  } catch (error) {
    console.error('Failed to delete address:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
