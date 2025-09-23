import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-center px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white md:text-7xl">
          Discover Your Next Favorite Outfit
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 md:text-xl">
          Shop from a curated collection of clothing from the best independent vendors.
        </p>
        <div className="mt-8">
          <Link href="/store">
            <Button size="lg">Shop Now</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}