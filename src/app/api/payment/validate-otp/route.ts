import { NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, otp, provider } = body;

    if (!transactionId || !otp || !provider) {
      return NextResponse.json({ success: false, message: "Informations manquantes" }, { status: 400 });
    }

    const paymentService = getPaymentProvider(provider);

    if (paymentService.validateOtp) {
      const result = await paymentService.validateOtp(transactionId, otp);

      if (result.success) {
        // Find the transaction/order association and update status
        // For simplicity in this demo, we'll assume the client handles the order update or we use a search
        // In a real app, transactionId would be linked to orderId in a separate table
      }

      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, message: "OTP non supporté par ce provider" }, { status: 400 });
  } catch (error: any) {
    console.error('[PaymentValidateOTP] Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
