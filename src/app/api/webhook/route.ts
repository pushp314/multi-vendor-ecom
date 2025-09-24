import { NextApiRequest, NextApiResponse } from 'next';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  const shasum = crypto.createHmac('sha256', secret);
  const body = await req.text();
  shasum.update(body);
  const digest = shasum.digest('hex');

  if (digest !== req.headers.get('x-razorpay-signature')) {
    return new Response('Invalid signature', { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const order = event.payload.order.entity;
    const { userId, cartId } = order.notes;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (cart) {
      await prisma.order.create({
        data: {
          userId,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
          total: cart.items.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          ),
          status: 'PAID',
          razorpayPaymentId: payment.id,
          razorpayOrderId: order.id,
          razorpaySignature: payment.signature,
        },
      });

      await prisma.cart.delete({ where: { id: cartId } });
    }
  }

  return new Response(null, { status: 200 });
}
