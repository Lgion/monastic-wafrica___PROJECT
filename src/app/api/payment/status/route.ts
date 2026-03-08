import { NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transactionId');
  const provider = searchParams.get('provider') as any;

  if (!transactionId || !provider) {
    return NextResponse.json({ success: false, message: "Informations manquantes" }, { status: 400 });
  }

  try {
    const paymentService = getPaymentProvider(provider);
    const result = await paymentService.checkStatus(transactionId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[PaymentStatus] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
