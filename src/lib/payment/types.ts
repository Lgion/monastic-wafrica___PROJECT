export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';

export type PaymentProvider = 'ORANGE_MONEY' | 'WAVE' | 'MTN_MONEY';

export interface PaymentInitiateRequest {
  amount: number;
  phoneNumber: string;
  provider: PaymentProvider;
  orderId: string;
  customerName?: string;
  customerEmail?: string;
}

export interface PaymentInitiateResponse {
  success: boolean;
  transactionId: string;
  paymentUrl?: string; // For Wave/Redirect-based
  requiresOtp?: boolean; // For Orange Money
  message?: string;
}

export interface PaymentStatusResponse {
  status: PaymentStatus;
  transactionId: string;
  orderId: string;
}

export interface PaymentProviderInterface {
  initiate(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse>;
  validateOtp?(transactionId: string, otp: string): Promise<{ success: boolean; status: PaymentStatus }>;
  checkStatus(transactionId: string): Promise<PaymentStatusResponse>;
}
