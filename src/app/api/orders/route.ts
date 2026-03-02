import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CartItem, PaymentMethod } from '@/lib/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerName, customerPhone, customerEmail, address, district, paymentMethod, items, total } = body

    // Create order with items
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerEmail,
        address,
        district,
        city: 'Abidjan',
        total,
        paymentMethod: paymentMethod as PaymentMethod,
        items: {
          create: (items as CartItem[]).map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Update stock
    for (const item of items as CartItem[]) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
