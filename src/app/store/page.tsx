import { ProductCard } from "@/components/shared/product-card";
import { prisma } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

async function getProducts(query, category, sortBy) {
  const where = {};

  if (query) {
    where.title = {
      contains: query,
      mode: "insensitive",
    };
  }

  if (category) {
    where.category = category;
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
  });

  return products;
}

export default async function StorePage({ searchParams }) {
  const { q, category, sort } = searchParams;
  const products = await getProducts(q, category, sort);
  const categories = await prisma.product.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

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

        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/3">
            <form>
              <Input
                  type="search"
                  name="q"
                  placeholder="Search products..."
                  defaultValue={q}
                  className="w-full"
              />
            </form>
          </div>
          <div className="flex items-center gap-4">
            <Select name="category" defaultValue={category}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                    <SelectItem key={cat.category} value={cat.category}>
                      {cat.category}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select name="sort" defaultValue={sort}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
