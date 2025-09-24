import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { ProductForm } from './_components/ProductForm';
import { ProductCard } from './_components/ProductCard';

export default async function VendorProductsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'VENDOR') {
    return <div>You are not authorized to view this page.</div>;
  }

  const products = await db.product.findMany({ where: { vendorId: user.id } });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Products</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        <ProductForm onSuccess={() => {}} />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Product List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
