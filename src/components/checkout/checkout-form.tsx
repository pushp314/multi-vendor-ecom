'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createRazorpayOrder } from '@/app/actions/checkout';
import { useRouter } from 'next/navigation';

// Function to load a script dynamically
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadRazorpay = async () => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Razorpay SDK failed to load. Are you online?');
      } else {
        setIsScriptLoaded(true);
      }
    };
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      toast.info('Payment gateway is loading. Please wait a moment.');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createRazorpayOrder();
      const { order } = result;

      if (!order) {
        toast.error('Could not create a payment order. Please try again.');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Awesome Store',
        description: 'Thank you for your purchase',
        order_id: order.id,
        handler: function (response: any) {
          // The webhook will handle the order fulfillment,
          // so here we just show a success message and redirect.
          toast.success('Payment successful!');
          // You can send response to your server to verify payment signature if needed
          // For this implementation, we rely on webhooks for fulfillment.
          router.push(`/checkout/success?order_id=${order.id}`);
        },
        prefill: {
          // You can prefill customer details here if you have them
          // name: 'Test User',
          // email: 'test.user@example.com',
          // contact: '9999999999'
        },
        notes: {
          address: 'Your Corporate Address'
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
            ondismiss: function(){
                toast.info('Payment was cancelled.');
                setIsProcessing(false);
            }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Ready to Checkout?</h2>
        <p className="text-gray-600 mb-4">
          Click the button below to proceed with your payment. You will be redirected to our secure payment partner, Razorpay.
        </p>
      </div>
      <Button onClick={handlePayment} disabled={isProcessing || !isScriptLoaded} className="w-full" size="lg">
        {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
      </Button>
    </div>
  );
}
