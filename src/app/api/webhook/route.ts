import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { buffer } from "micro";
import { prisma } from "@/lib/utils";

export async function POST(req: Request) {
  const rawBody = await buffer(req.body);
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { userId, cartId } = paymentIntent.metadata;

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    });

    if (cart) {
      const order = await prisma.order.create({
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
          status: "PAID",
        },
      });

      await prisma.cart.delete({ where: { id: cartId } });
    }
  }

  return new Response(null, { status: 200 });
}
