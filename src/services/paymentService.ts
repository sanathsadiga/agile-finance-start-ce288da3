
import { api } from './api';

export interface RazorpayOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    contact: string;
  };
  key: string;
}

export interface PaymentConfirmRequest {
  paymentId: string;
  orderId: string;
  signature: string;
  publicId: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const paymentService = {
  // Create Razorpay order
  createOrder: async (publicId: string): Promise<RazorpayOrderResponse> => {
    return api.post<RazorpayOrderResponse>('/api/payments/create-order', { publicId });
  },

  // Confirm payment after Razorpay success
  confirmPayment: async (paymentData: PaymentConfirmRequest): Promise<void> => {
    return api.post<void>('/api/payments/confirm', paymentData);
  },
};
