import { prisma } from "@/lib/utils";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProductCard from "@/components/shared/product-card";
import { Star } from "lucide-react";
import ReviewForm from "@/components/reviews/review-form";
import ReviewList from "@/components/reviews/review-list";
import AddToCartButton from "./add-to-cart-button";
import {ProductImageCarousel} from "@/components/shared/product-image-carousel";

async function getProductData(id: string, userId?: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      vendor: {
        select: {
          storeName: true,
        },
      },
      reviews: {
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      AND: [
        { categoryId: product.categoryId },
        { id: { not: product.id } },
      ],
    },
    take: 4,
    include: {
      vendor: {
        select: {
          storeName: true,
        },
      },
    },
  });

  let hasPurchased = false;
  if (userId) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: 'PAID',
        items: { some: { productId: id } },
      },
    });
    hasPurchased = !!order;
  }

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return { product, relatedProducts, hasPurchased, averageRating };
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const { product, relatedProducts, hasPurchased, averageRating } = await getProductData(params.id, session?.user?.id);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <ProductImageCarousel images={product.images} title={product.title} />
          <div className="flex flex-col h-full">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sold by {product.vendor.storeName}</p>
              <h1 className="text-5xl font-extrabold tracking-tight mb-3">{product.title}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < averageRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">({product.reviews.length} reviews)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">{product.description}</p>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-6">
                <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
              </div>
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewList productId={product.id} />
          {session?.user && <ReviewForm productId={product.id} hasPurchased={hasPurchased} />}
        </div>

      </div>

      {relatedProducts.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
