import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { checkout_id, status, reference } = body

    const order = await prisma.order.findFirst({ where: { id: reference } })
    if (!order) return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })

    if (status === 'completed') {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' }
      })
    } else if (status === 'failed' || status === 'cancelled') {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'FAILED' } })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Wave webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
