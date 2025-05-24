export interface User {
  _id: string
  name: string
  email: string
  username: string
  password?: string
  accountType: string
  profileUrl: string
  emailVerified: boolean
  verificationToken?: string
  verificationTokenExpiry?: Date
  image: string
  isGmail: boolean
  accounts?: string[]
  sessions?: string[]
  createdAt: string
  updatedAt: string
}
