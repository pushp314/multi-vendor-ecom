'use client';

import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { Address } from '@prisma/client';
import { createAddress, updateAddress } from '@/app/actions/address';

interface AddressFormProps {
  address: Address | null;
  onSuccess: () => void;
}

export function AddressForm({ address, onSuccess }: AddressFormProps) {
  const [state, formAction] = useFormState(address ? updateAddress.bind(null, address.id) : createAddress, null);

  useEffect(() => {
    if (state?.message) {
      onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="line1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
        <input type="text" id="line1" name="line1" defaultValue={address?.line1} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        {state?.errors?.line1 && <p className="text-sm text-red-500 mt-1">{state.errors.line1.join(', ')}</p>}
      </div>
      <div>
        <label htmlFor="line2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
        <input type="text" id="line2" name="line2" defaultValue={address?.line2 || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input type="text" id="city" name="city" defaultValue={address?.city} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {state?.errors?.city && <p className="text-sm text-red-500 mt-1">{state.errors.city.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
          <input type="text" id="state" name="state" defaultValue={address?.state} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {state?.errors?.state && <p className="text-sm text-red-500 mt-1">{state.errors.state.join(', ')}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input type="text" id="postalCode" name="postalCode" defaultValue={address?.postalCode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {state?.errors?.postalCode && <p className="text-sm text-red-500 mt-1">{state.errors.postalCode.join(', ')}</p>}
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <input type="text" id="country" name="country" defaultValue={address?.country} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          {state?.errors?.country && <p className="text-sm text-red-500 mt-1">{state.errors.country.join(', ')}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300">{address ? 'Update Address' : 'Create Address'}</button>
      </div>
      {state?.error && <p className="text-sm text-red-500 mt-2">{state.error}</p>}
    </form>
  );
}
