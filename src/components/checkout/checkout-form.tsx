'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement, AddressElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Payment successful!");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <AddressElement options={{ mode: 'shipping' }} />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
        <PaymentElement />
      </div>
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full" size="lg">
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
}
