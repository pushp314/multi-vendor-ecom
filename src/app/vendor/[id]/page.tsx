import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductCard from "@/components/shared/product-card";

export default async function VendorPage({ params }: { params: { id: string } }) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: params.id },
    include: {
      products: {
        include: {
          vendor: {
            select: {
              id: true,
              storeName: true,
            }
          }
        }
      }
    }
  });

  if (!vendor) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center mb-12">
        {vendor.logo && (
          <img src={vendor.logo} alt={vendor.storeName} className="w-32 h-32 rounded-full mb-4 object-cover" />
        )}
        <h1 className="text-4xl font-bold">{vendor.storeName}</h1>
        {vendor.description && <p className="mt-2 text-lg text-gray-600 max-w-2xl">{vendor.description}</p>}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Products from {vendor.storeName}</h2>
        {vendor.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {vendor.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found from this vendor.</p>
        )}
      </div>
    </div>
  );
}
