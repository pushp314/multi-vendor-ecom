'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { registerVendor } from '@/app/actions/vendor';

const vendorSchema = z.object({
  name: z.string().min(3, { message: 'Vendor name must be at least 3 characters long' }),
  description: z.string().optional(),
});

export default function VendorRegistrationPage() {
  const [state, formAction] = useFormState(registerVendor, null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(vendorSchema),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-bold mb-8">Register as a Vendor</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="name">Vendor Name</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...register('description')} />
        </div>
        <Button type="submit">Register</Button>
        {state?.message && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
        {state?.errors && (
          <div className="text-red-500 text-sm mt-2">
            {Object.values(state.errors).flat().map((error, i) => (
              <p key={i}>{error as string}</p>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
