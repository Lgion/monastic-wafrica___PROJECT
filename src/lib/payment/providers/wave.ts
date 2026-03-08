import { PaymentInitiateRequest, PaymentInitiateResponse, PaymentProviderInterface, PaymentStatusResponse } from '../types';

export class WaveService implements PaymentProviderInterface {
  private isDev = process.env.NODE_ENV === 'development';

  async initiate(request: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
    console.log(`[Wave] Initiating payment for ${request.amount} FCFA`);

    if (this.isDev) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        success: true,
        transactionId: `wv_${Math.random().toString(36).substr(2, 9)}`,
        paymentUrl: `https://wave.com/pay/mock_${Math.random().toString(36).substr(2, 5)}`,
        message: "Redirection vers l'application Wave..."
      };
    }

    throw new Error('Not implemented for production: Configure WAVE_API_KEY');
  }

  async checkStatus(transactionId: string): Promise<PaymentStatusResponse> {
    if (this.isDev) {
      // Simulation: success after 5 seconds
      return {
        status: 'SUCCESS',
        transactionId,
        orderId: 'mock_order'
      };
    }
    throw new Error('Not implemented');
  }
}
