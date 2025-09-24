import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/shared/product-card";
import {ArrowRight} from "lucide-react";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="bg-white dark:bg-gray-950">
      <section className="relative bg-gray-900 text-white">
        <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
              opacity: "0.4",
            }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl">
            Step Up Your Style Game
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl">
            Discover the latest trends in fashion and elevate your wardrobe with our curated collection of clothing and accessories.
          </p>
          <div className="mt-10">
            <Link href="/store">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200">
                Explore the Collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Featured Products</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Check out our handpicked selection of must-have items.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/store">
              <Button variant="outline">
                <span>View All Products</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Exclusive Offer
            </h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Get <span className="font-bold text-indigo-600 dark:text-indigo-400">20% OFF</span> your first order. Use code <span className="font-mono bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">FIRST20</span> at checkout.
            </p>
            <div className="mt-8">
              <Link href="/store">
                <Button size="lg">
                  Shop Now & Save
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Find what you're looking for with our categorized collections.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/store?category=T-Shirts" className="group block">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="T-Shirts" className="w-full h-full object-center object-cover group-hover:opacity-75" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">T-Shirts</h3>
            </Link>
            <Link href="/store?category=Jeans" className="group block">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img src="https://images.unsplash.com/photo-1604176255446-2aa62b31f879?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Jeans" className="w-full h-full object-center object-cover group-hover:opacity-75" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Jeans</h3>
            </Link>
            <Link href="/store?category=Jackets" className="group block">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Jackets" className="w-full h-full object-center object-cover group-hover:opacity-75" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Jackets</h3>
            </Link>
            <Link href="/store?category=Shoes" className="group block">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Shoes" className="w-full h-full object-center object-cover group-hover:opacity-75" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Shoes</h3>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}