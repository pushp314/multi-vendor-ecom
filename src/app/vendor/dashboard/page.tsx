import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProductCard from "@/components/shared/product-card";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getVendorProducts() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return [];
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      vendorId: vendor.id,
    },
    include: {
      vendor: {
        select: {
          name: true,
        },
      },
    },
  });

  return products;
}

export default async function VendorDashboardPage() {
  const products = await getVendorProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Products</h1>
        <Button asChild>
          <Link href="/vendor/dashboard/products/new">Add New Product</Link>
        </Button>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
          <p className="text-gray-500 mb-4">You haven't added any products yet. Get started by adding your first one!</p>
          <Button asChild>
            <Link href="/vendor/dashboard/products/new">Add Your First Product</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
