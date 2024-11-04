// import NextAuth from 'next-auth'
// import { MongoDBAdapter } from '@auth/mongodb-adapter'
// import clientPromise from '@/lib/mongodb'
// import GoogleProvider from 'next-auth/providers/google'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import bcrypt from 'bcryptjs'
// import { randomBytes } from 'crypto'

// const authOptions = {
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null
//         }

//         const client = await clientPromise
//         const usersCollection = client.db().collection('users')

//         const user = await usersCollection.findOne({ email: credentials.email })

//         if (!user) {
//           return null
//         }

//         const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

//         if (!isPasswordValid) {
//           return null
//         }

//         if (!user.emailVerified) {
//           throw new Error('Email not verified')
//         }

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === 'google') {
//         const client = await clientPromise
//         const usersCollection = client.db().collection('users')

//         const existingUser = await usersCollection.findOne({ email: user.email })

//         if (!existingUser) {
//           const username = await generateUniqueUsername(user.name)
//           await usersCollection.updateOne(
//             { _id: user.id },
//             { 
//               $set: { 
//                 username: username,
//                 emailVerified: new Date(),
//               }
//             },
//             { upsert: true }
//           )
//         }
//       }
//       return true
//     },
//     async session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id
//       }
//       return session
//     },
//   },
//   pages: {
//     signIn: '/auth/signin',
//     signUp: '/auth/signup',
//     verifyRequest: '/auth/verify-request',
//   },
// }

// async function generateUniqueUsername(name) {
//   const baseUsername = name.toLowerCase().replace(/\s+/g, '')
//   let username = baseUsername
//   let suffix = 1

//   const client = await clientPromise
//   const usersCollection = client.db().collection('users')

//   while (await usersCollection.findOne({ username })) {
//     username = `${baseUsername}${suffix}`
//     suffix++
//   }

//   return username
// }

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }

import { handlers } from "@/app/auth"

export const { GET, POST } = handlers