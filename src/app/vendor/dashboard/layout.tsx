import Link from "next/link";

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Vendor Dashboard</h2>
          <nav className="flex flex-col space-y-2">
            <Link href="/vendor/dashboard">Products</Link>
            <Link href="/vendor/dashboard/orders">Orders</Link>
            <Link href="/vendor/dashboard/settings">Settings</Link>
          </nav>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
