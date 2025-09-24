'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { Product } from '@prisma/client';
import { createProduct, updateProduct } from '@/app/actions/product';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [state, formAction] = useFormState(product ? updateProduct.bind(null, product.id) : createProduct, null);

  useEffect(() => {
    if (state?.message) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input type="text" id="name" name="name" defaultValue={product?.name} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        {state?.errors?.name && <p className="text-sm text-red-500 mt-1">{state.errors.name.join(', ')}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" defaultValue={product?.description} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        {state?.errors?.description && <p className="text-sm text-red-500 mt-1">{state.errors.description.join(', ')}</p>}
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" id="price" name="price" defaultValue={product?.price} step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        {state?.errors?.price && <p className="text-sm text-red-500 mt-1">{state.errors.price.join(', ')}</p>}
      </div>
      {/* Add image upload field here in the future */}
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">{product ? 'Update Product' : 'Create Product'}</button>
      </div>
      {state?.error && <p className="text-sm text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
