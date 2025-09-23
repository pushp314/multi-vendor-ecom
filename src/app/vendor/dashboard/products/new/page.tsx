'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormState } from 'react-dom';
import { addProduct } from '@/app/actions/product';
import { UploadButton } from "@/components/shared/upload-button";

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters long' }),
  description: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  imageUrl: z.string().url({ message: 'Please upload an image' }),
});

export default function NewProductPage() {
  const [state, formAction] = useFormState(addProduct, null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      imageUrl: ''
    },
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setValue('imageUrl', url, { shouldValidate: true });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Add New Product</h1>
        <form action={formAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Classic Tee" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} placeholder="e.g. 29.99" />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" {...register('description')} placeholder="A short description of the product..." />
          </div>
          <div className="space-y-2">
            <Label>Product Image</Label>
            <UploadButton onUploadComplete={handleImageUpload} />
            {imageUrl && (
              <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                <img src={imageUrl} alt="Uploaded product" className="w-full h-full object-cover" />
              </div>
            )}
            <Input type="hidden" {...register('imageUrl')} />
            {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>}
          </div>
          <Button type="submit" className="w-full text-lg">Add Product</Button>
          {state?.message && <p className="text-green-500 text-sm mt-2 text-center">{state.message}</p>}
          {state?.errors && (
            <div className="text-red-500 text-sm mt-2">
              {Object.values(state.errors).flat().map((error, i) => (
                <p key={i} className="text-center">{error as string}</p>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
