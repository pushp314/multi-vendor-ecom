import ProductCard from "@/components/shared/product-card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { name: decodeURIComponent(params.slug) },
    include: {
      products: {
        include: {
          vendor: {
            select: {
              storeName: true,
            }
          }
        }
      }
    }
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">{category.name}</h1>
      </div>
      {category.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {category.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found in this category.</p>
      )}
    </div>
  );
}