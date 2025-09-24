import ProductCard from "@/components/shared/product-card";
import { prisma } from "@/lib/prisma";
import ProductFilters from "@/components/shared/product-filters";

async function getProducts(query, category, sortBy) {
  const where = {};

  if (query) {
    where.title = {
      contains: query,
      mode: "insensitive",
    };
  }

  if (category) {
    where.categoryId = category;
  }

  let orderBy = {};
  if (sortBy === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sortBy === "price-desc") {
    orderBy = { price: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      vendor: {
        select: {
          id: true,
          storeName: true,
        }
      }
    }
  });

  return products;
}

async function getCategories() {
  const categories = await prisma.category.findMany();
  return categories;
}

export default async function StorePage({ searchParams }) {
  const { q, category, sort } = searchParams;
  const products = await getProducts(q, category, sort);
  const categories = await getCategories();

  return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Explore Our Collection
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Find the perfect pieces to elevate your style.
          </p>
        </div>

        <ProductFilters categories={categories} searchParams={searchParams} />

        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
              ))}
            </div>
        ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
              <p className="text-gray-500">
                We couldn't find any products matching your criteria. Try adjusting your filters.
              </p>
            </div>
        )}
      </div>
  );
}
