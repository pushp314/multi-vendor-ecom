import { getCurrentUser } from '@/lib/session';
import { db } from '@/lib/db';
import { AddressesPageClient } from './_client';

export default async function AddressesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    // Handle unauthenticated user, maybe redirect or show a message
    return <div>Please log in to view your addresses.</div>;
  }

  const addresses = await db.address.findMany({ where: { userId: user.id } });

  return <AddressesPageClient user={user} addresses={addresses} />;
}
