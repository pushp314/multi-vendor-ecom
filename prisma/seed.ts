import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Delete all existing data
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create a vendor user
  const vendor = await prisma.user.create({
    data: {
      name: 'Test Vendor',
      email: 'vendor@test.com',
      role: 'VENDOR',
    },
  });

  // Create some products
  const products = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 99.99,
      images: ['/images/headphones.jpg'],
      vendorId: vendor.id,
    },
    {
      name: 'Smartwatch',
      description: 'A stylish smartwatch with a variety of health and fitness features.',
      price: 199.99,
      images: ['/images/smartwatch.jpg'],
      vendorId: vendor.id,
    },
    {
      name: 'Portable Speaker',
      description: 'A compact and powerful portable speaker with Bluetooth connectivity.',
      price: 49.99,
      images: ['/images/speaker.jpg'],
      vendorId: vendor.id,
    },
    {
      name: 'Laptop Backpack',
      description: 'A durable and spacious backpack with a dedicated laptop compartment.',
      price: 79.99,
      images: ['/images/backpack.jpg'],
      vendorId: vendor.id,
    },
    {
      name: 'Coffee Maker',
      description: 'A programmable coffee maker with a built-in grinder.',
      price: 129.99,
      images: ['/images/coffee-maker.jpg'],
      vendorId: vendor.id,
    },
    {
      name: 'Electric Toothbrush',
      description: 'A smart electric toothbrush with multiple brushing modes.',
      price: 69.99,
      images: ['/images/toothbrush.jpg'],
      vendorId: vendor.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
