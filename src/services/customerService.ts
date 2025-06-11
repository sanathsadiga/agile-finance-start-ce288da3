
import { api } from './api';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const customerService = {
  getCustomersByBusinessId: async (businessId: number): Promise<Customer[]> => {
    return await api.get<Customer[]>(`/api/v1/customers/business/${businessId}`);
  },
};
