'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const category = formData.get('category') as string
  const monasteryId = formData.get('monasteryId') as string
  const featured = formData.get('featured') === 'on'

  if (!name || !price || !category || !monasteryId) return { error: 'Champs requis manquants' }

  try {
    await prisma.product.create({
      data: { name, description, price, stock, category, monasteryId, featured, images: '/products/placeholder.jpg' }
    })
    revalidatePath('/admin/produits')
    revalidatePath('/boutique')
    redirect('/admin/produits')
  } catch (error) {
    console.error('Error creating product:', error)
    return { error: 'Erreur lors de la création du produit' }
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseInt(formData.get('price') as string)
  const stock = parseInt(formData.get('stock') as string)
  const category = formData.get('category') as string
  const monasteryId = formData.get('monasteryId') as string
  const featured = formData.get('featured') === 'on'

  if (!name || !price || !category || !monasteryId) return { error: 'Champs requis manquants' }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { name, description, price, stock, category, monasteryId, featured }
    })
    revalidatePath('/admin/produits')
    revalidatePath('/boutique')
    revalidatePath(`/produit/${productId}`)
    redirect('/admin/produits')
  } catch (error) {
    console.error('Error updating product:', error)
    return { error: 'Erreur lors de la mise à jour du produit' }
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({ where: { id: productId } })
    revalidatePath('/admin/produits')
    revalidatePath('/boutique')
    redirect('/admin/produits')
  } catch (error) {
    console.error('Error deleting product:', error)
    return { error: 'Erreur lors de la suppression du produit' }
  }
}
