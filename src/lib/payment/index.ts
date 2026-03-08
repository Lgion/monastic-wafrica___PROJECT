import { PaymentProvider, PaymentProviderInterface } from './types';
import { OrangeMoneyService } from './providers/orange-money';
import { WaveService } from './providers/wave';
import { MTNMomoService } from './providers/mtn-momo';

export function getPaymentProvider(provider: PaymentProvider): PaymentProviderInterface {
  switch (provider) {
    case 'ORANGE_MONEY':
      return new OrangeMoneyService();
    case 'WAVE':
      return new WaveService();
    case 'MTN_MONEY':
      return new MTNMomoService();
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
}

export * from './types';
