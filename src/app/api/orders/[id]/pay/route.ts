import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const order = await prisma.order.update({
            where: { id },
            data: {
                paymentStatus: 'PAID',
                status: 'PAID' // Or COMPLETED depending on business logic
            }
        });

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('[OrderPay] Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
