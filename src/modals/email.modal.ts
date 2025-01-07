import mongoose from 'mongoose'

const EmailCredentialsSchema = new mongoose.Schema({
  EMAIL_SERVER_USER: String,
  EMAIL_SERVER_PASSWORD: String,
  userId: String,
})

export const EmailCredentialsModel = mongoose.models.EmailCredentials || mongoose.model('EmailCredentials', EmailCredentialsSchema)
