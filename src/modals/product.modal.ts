import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this product.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  userId: {
    type: String,
    required: [true, 'You Should be Logged in to Add Products'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
    min: [0, 'Price must be a positive number'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
  },
  maxDiscountRate: {
    type: Number,
    required: [true, 'Please provide a maximum discount rate for this product.'],
    min: [0, 'Discount rate must be between 0 and 100'],
    max: [100, 'Discount rate must be between 0 and 100'],
  },
  bargainingPower: {
    type: Number,
    required: [true, 'Please provide a bargaining power for this product.'],
    min: [0, 'Bargaining power must be between 0 and 1'],
    max: [1, 'Bargaining power must be between 0 and 1'],
  },
}, {
  timestamps: true,
})

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

