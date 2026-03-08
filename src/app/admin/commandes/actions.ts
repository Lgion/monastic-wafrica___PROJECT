'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(formData: FormData) {
  const orderId = formData.get('orderId') as string
  const status = formData.get('status') as string

  if (!orderId || !status) return { error: 'Missing parameters' }

  try {
    await prisma.order.update({ where: { id: orderId }, data: { status } })
    revalidatePath('/admin/commandes')
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return { error: 'Failed to update order status' }
  }
}
