'use server';

import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/app/actions/checkout';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing Razorpay payment information' }, { status: 400 });
  }

  try {
    const { orderId } = await verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    return NextResponse.json({ orderId });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
