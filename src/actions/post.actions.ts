'use server'

import { connect } from '@/db'
import { Post } from '@/modals/post.modal'
import { uploadToR2 } from '@/lib/r2'

export async function createPost(formData: FormData) {
  try {
    await connect()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const hashtags = (formData.get('hashtags') as string).split(',').map(tag => tag.trim())
    const images = formData.getAll('images') as File[]
    const userId = formData.get('userId') as string
    const productId = formData.get('productId') as string

    // Upload images to Cloudflare R2
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const path = `CSC416/${userId}/posts/${image.name}`
        return await uploadToR2(image, path)
      })
    )

    // Create new post in MongoDB
    const newPost = new Post({
      title,
      description,
      hashtags,
      images: imageUrls,
      userId,
      productId
    })

    await newPost.save()

    return { success: true, message: 'Post created successfully' }
  } catch (error) {
    console.error('Failed to create post:', error)
    return { success: false, message: 'Failed to create post' }
  }
}

