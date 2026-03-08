import { NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, phoneNumber, provider, orderId } = body;

    if (!amount || !provider || !orderId) {
      return NextResponse.json({ success: false, message: "Informations manquantes" }, { status: 400 });
    }

    const paymentService = getPaymentProvider(provider);
    const result = await paymentService.initiate({
      amount,
      phoneNumber,
      provider,
      orderId
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[PaymentInitiate] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
