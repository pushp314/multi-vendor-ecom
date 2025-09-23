'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const vendorSchema = z.object({
  name: z.string().min(3, { message: 'Vendor name must be at least 3 characters long' }),
  description: z.string().optional(),
});

export async function registerVendor(prevState: any, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      errors: { auth: ['You must be logged in to register as a vendor'] },
    };
  }

  const validatedFields = vendorSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const vendor = await prisma.vendor.create({
      data: {
        name: validatedFields.data.name,
        description: validatedFields.data.description,
        userId: session.user.id,
      },
    });

    return { message: `Vendor '${vendor.name}' registered successfully!` };
  } catch (error) {
    return {
      errors: { db: ['Failed to register vendor'] },
    };
  }
}
