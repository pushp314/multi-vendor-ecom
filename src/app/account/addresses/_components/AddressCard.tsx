'use client';

import { Address } from '@prisma/client';
import { deleteAddress } from '@/app/actions/address';

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onSuccess: () => void;
}

export function AddressCard({ address, onEdit, onSuccess }: AddressCardProps) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this address?')) {
      const result = await deleteAddress(address.id);
      if (result.error) {
        alert(result.error);
      } else {
        onSuccess();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      <p>{address.city}, {address.state} {address.postalCode}</p>
      <p>{address.country}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={() => onEdit(address)} className="text-blue-500 hover:text-blue-600 font-semibold">Edit</button>
        <button onClick={handleDelete} className="text-red-500 hover:text-red-600 font-semibold">Delete</button>
      </div>
    </div>
  );
}
