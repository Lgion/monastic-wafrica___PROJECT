import { PaymentInitiateRequest, PaymentInitiateResponse, PaymentProviderInterface, PaymentStatusResponse } from '../types';

export class MTNMomoService implements PaymentProviderInterface {
  private isDev = process.env.NODE_ENV === 'development';

  async initiate(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    console.log(`[MTN] Initiating payment for ${request.amount} FCFA to ${request.phoneNumber}`);

    if (this.isDev) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        transactionId: `mtn_${Math.random().toString(36).substr(2, 9)}`,
        requiresOtp: true,
        message: "Veuillez confirmer la transaction sur votre téléphone via le menu *133# ou l'application MTN MoMo."
      };
    }

    throw new Error('Not implemented for production');
  }

  async validateOtp(transactionId: string, otp: string): Promise<{ success: boolean; status: 'SUCCESS' | 'FAILED' }> {
    if (this.isDev) {
      // Simulate confirmation
      return { success: otp === '1234', status: otp === '1234' ? 'SUCCESS' : 'FAILED' };
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
