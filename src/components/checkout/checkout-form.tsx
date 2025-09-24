'use client';

import { useState, FormEvent } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CheckoutFormProps {
  clientSecret: string;
}

export default function CheckoutForm({ clientSecret }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      setMessage(error.message || 'An unexpected error occurred.');
      toast.error(error.message || 'An unexpected error occurred.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Payment successful!');
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <Button disabled={isProcessing || !stripe || !elements} id="submit" className="w-full mt-4">
        <span id="button-text">
          {isProcessing ? "Processing ... " : "Pay now"}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className="text-red-500 mt-2">{message}</div>}
    </form>
  );
}
