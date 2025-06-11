
import { api } from './api';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const customerService = {
  getCustomersByBusinessId: async (businessId: number): Promise<Customer[]> => {
    return await api.get<Customer[]>(`/api/v1/customers/business/${businessId}`);
  },

  createCustomer: async (userId: number, customerData: CreateCustomerRequest): Promise<Customer> => {
    return await api.post<Customer>(`/api/v1/customers/${userId}`, customerData);
  },
};
