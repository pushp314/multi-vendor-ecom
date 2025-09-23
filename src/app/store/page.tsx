import ProductCard from "@/components/shared/product-card";
import { prisma } from "@/lib/prisma";

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      vendor: {
        select: {
          storeName: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        }
      }
    },
  });
  return products;
}

export default async function StorePage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
