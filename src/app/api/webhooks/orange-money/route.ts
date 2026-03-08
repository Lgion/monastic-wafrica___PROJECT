import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentId, status, reference } = body

    const order = await prisma.order.findFirst({ where: { id: reference } })
    if (!order) return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })

    if (status === 'SUCCESS') {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAID', status: 'CONFIRMED' }
      })
    } else if (status === 'FAILED') {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'FAILED' } })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
