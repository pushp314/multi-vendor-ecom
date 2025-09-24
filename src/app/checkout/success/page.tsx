import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
      <h1 className="text-3xl font-bold mt-4 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Thank you for your order. We've received your payment and your order is being processed.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/store">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="/dashboard/orders">
          <Button>View Your Orders</Button>
        </Link>
      </div>
    </div>
  );
}
