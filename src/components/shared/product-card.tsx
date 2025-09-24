'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/app/actions/product";
import { motion } from "framer-motion";
import { ShoppingCart, Edit, Trash2, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    description: string | null;
    vendor: {
      id: string;
      storeName: string;
    };
    reviews?: {
      rating: number;
    }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const pathname = usePathname();
  const isVendorView = pathname.startsWith("/vendor");

  const deleteProductWithId = deleteProduct.bind(null, product.id);

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="border rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 flex flex-col"
    >
      <Link href={`/store/product/${product.id}`} className="flex flex-col flex-grow">
        <div className="relative w-full h-64">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
            <h3 className="font-semibold text-lg truncate">{product.title}</h3>
            <Link href={`/vendor/${product.vendor.id}`}>
              <p className="text-sm hover:underline">by {product.vendor.storeName}</p>
            </Link>
          </div>
        </div>
        <div className="p-4 flex-grow">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-10 overflow-hidden">
            {product.description}
          </p>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < averageRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
              ))}
            </div>
            {product.reviews && product.reviews.length > 0 && (
              <span className="ml-2 text-xs text-gray-500">({product.reviews.length})</span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4 border-t mt-auto">
        <div className="flex justify-between items-center">
          <p className="font-bold text-xl">${product.price.toFixed(2)}</p>
          {!isVendorView && (
            <Button size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      {isVendorView && (
        <div className="p-4 border-t flex gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/vendor/dashboard/products/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Link>
          </Button>
          <form action={deleteProductWithId} className="w-full">
            <Button variant="destructive" className="w-full" type="submit">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
