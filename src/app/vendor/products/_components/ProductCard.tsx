'use client';

import { useState } from 'react';
import { Product } from '@prisma/client';
import { deleteProduct } from '@/app/actions/product';
import { ProductForm } from './ProductForm';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(product.id);
      if (result.error) {
        alert(result.error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {isEditing ? (
        <ProductForm product={product} onSuccess={() => setIsEditing(false)} />
      ) : (
        <div>
          <h3 className="text-xl font-bold mb-2">{product.name}</h3>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button onClick={() => setIsEditing(true)} className="text-blue-500 hover:text-blue-600 font-semibold">Edit</button>
            <button onClick={handleDelete} className="text-red-500 hover:text-red-600 font-semibold">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
