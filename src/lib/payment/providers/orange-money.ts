import { PaymentInitiateRequest, PaymentInitiateResponse, PaymentProviderInterface, PaymentStatusResponse } from '../types';

export class OrangeMoneyService implements PaymentProviderInterface {
  private isDev = process.env.NODE_ENV === 'development';

  async initiate(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    console.log(`[OrangeMoney] Initiating payment for ${request.amount} FCFA to ${request.phoneNumber}`);

    if (this.isDev) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        transactionId: `om_${Math.random().toString(36).substr(2, 9)}`,
        requiresOtp: true,
        message: "Veuillez entrer le code OTP reçu sur votre mobile."
      };
    }

    // Real API integration would go here
    // Connect to Orange Developer API
    throw new Error('Not implemented for production: Configure ORANGE_MONEY_CLIENT_ID');
  }

  async validateOtp(transactionId: string, otp: string): Promise<{ success: boolean; status: 'SUCCESS' | 'FAILED' }> {
    console.log(`[OrangeMoney] Validating OTP ${otp} for transaction ${transactionId}`);

    if (this.isDev) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Simulation: "1234" is the success code
      if (otp === '1234') {
        return { success: true, status: 'SUCCESS' };
      }
      return { success: false, status: 'FAILED' };
    }

    throw new Error('Not implemented');
  }

  async checkStatus(transactionId: string): Promise<PaymentStatusResponse> {
    if (this.isDev) {
      return {
        status: 'SUCCESS',
        transactionId,
        orderId: 'mock_order'
      };
    }
    throw new Error('Not implemented');
  }
}
