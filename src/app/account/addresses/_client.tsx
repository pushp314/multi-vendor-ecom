'use client';

import { useState, useTransition } from 'react';
import { Address, User } from '@prisma/client';
import { AddressForm } from './_components/AddressForm';
import { AddressCard } from './_components/AddressCard';
import { useRouter } from 'next/navigation';

interface AddressesPageClientProps {
  user: User;
  addresses: Address[];
}

export function AddressesPageClient({ user, addresses: initialAddresses }: AddressesPageClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedAddress(null);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Addresses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialAddresses.map((address) => (
          <AddressCard key={address.id} address={address} onEdit={handleEdit} onSuccess={handleSuccess} />
        ))}
      </div>
      <div className="mt-8">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setSelectedAddress(null);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300"
        >
          {showForm && !selectedAddress ? 'Cancel' : 'Add New Address'}
        </button>
      </div>
      {(showForm || selectedAddress) && (
        <div className="mt-8">
          <AddressForm address={selectedAddress} onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  );
}
