import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-gray-900 dark:text-gray-50">
                    Discover Your Next Favorite Thing
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Shop our curated collection of unique and high-quality products from around the world.
                  </p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  <form className="flex space-x-2">
                    <Input
                      className="max-w-lg flex-1 bg-white dark:bg-gray-950"
                      placeholder="Enter your email"
                      type="email"
                    />
                    <Button className="bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900" type="submit">
                      Sign Up
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sign up to get notified when we launch.
                    <Link className="underline underline-offset-2 ml-1" href="#">
                      Terms & Conditions
                    </Link>
                  </p>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                height="550"
                src="/placeholder.svg"
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  New Arrivals
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900 dark:text-gray-50">
                  Check out our latest products
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We're constantly adding new and exciting items to our collection. Here are some of our favorites.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <img
                  alt="Product"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  height="310"
                  src="/placeholder.svg"
                  width="550"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Product Name</h3>
                <p className="text-gray-500 dark:text-gray-400">A brief description of the product.</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-50">$99.99</p>
              </div>
              <div className="grid gap-1">
                <img
                  alt="Product"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  height="310"
                  src="/placeholder.svg"
                  width="550"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Product Name</h3>
                <p className="text-gray-500 dark:text-gray-400">A brief description of the product.</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-50">$99.99</p>
              </div>
              <div className="grid gap-1">
                <img
                  alt="Product"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                  height="310"
                  src="/placeholder.svg"
                  width="550"
                />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Product Name</h3>
                <p className="text-gray-500 dark:text-gray-400">A brief description of the product.</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-50">$99.99</p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="#"
              >
                View All
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-gray-900 dark:text-gray-50">
                Shop by Category
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Browse our wide selection of categories to find exactly what you're looking for.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1">
                <Link className="flex flex-col items-center" href="#">
                  <img
                    alt="Category"
                    className="rounded-full aspect-square overflow-hidden object-cover object-center sm:w-full"
                    height="200"
                    src="/placeholder.svg"
                    width="200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mt-4">Category Name</h3>
                </Link>
              </div>
              <div className="grid gap-1">
                <Link className="flex flex-col items-center" href="#">
                  <img
                    alt="Category"
                    className="rounded-full aspect-square overflow-hidden object-cover object-center sm:w-full"
                    height="200"
                    src="/placeholder.svg"
                    width="200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mt-4">Category Name</h3>
                </Link>
              </div>
              <div className="grid gap-1">
                <Link className="flex flex-col items-center" href="#">
                  <img
                    alt="Category"
                    className="rounded-full aspect-square overflow-hidden object-cover object-center sm:w-full"
                    height="200"
                    src="/placeholder.svg"
                    width="200"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mt-4">Category Name</h3>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
