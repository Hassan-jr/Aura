'use server'

import { connect } from '@/db'
import { Product } from '@/modals/product.modal'

export async function addProduct(data: {
  title: string
  price: number
  description: string
  maxDiscountRate: number
  bargainingPower: number,
  userId: String,
}) {
  try {
    await connect()
    const product = new Product(data)
    await product.save()
    return { success: true, message: 'Product added successfully' }
  } catch (error) {
    console.error('Failed to add product:', error)
    return { success: false, message: 'Failed to add product' }
  }
}

