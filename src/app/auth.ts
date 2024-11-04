import NextAuth, { CredentialsSignin } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import User from "@/modals/user.modal";
import bcrypt from "bcryptjs";
import { connect } from "@/db"; // Import the mongoose connect function

class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // if (!credentials?.email || !credentials?.password) return null;
        if (!credentials?.email || !credentials?.password) {
          throw new CustomError("ProvideEmailAndPassword");
        }

        try {
          await connect(); // Ensure mongoose connection is established

          const user = await User.findOne({ email: credentials.email });
          // if (!user) return null;
          if (!user) {
            throw new CustomError("CredentialsSignin");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          // if (!isPasswordValid) return null;
          if (!isPasswordValid) {
            throw new CustomError("CredentialsSignin:");
          }

          // if (!user.emailVerified) {
          //   throw new Error("Email not verified");
          // }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
          };
        } catch (error) {
          // console.log("Cacht Error:", error);
          const errorMessage = error?.message || error?.type || error;
          throw new CustomError(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          await connect(); // Ensure mongoose connection is established
          const existingUser = await User.findOne({ email: profile?.email });
          if (existingUser) {
            user.id = existingUser._id.toString();
            // user.username = existingUser.username;
          } else {
            const newUser = await User.create({
              name: profile?.name,
              email: profile?.email,
              username: (profile?.email as string).split("@")[0],
              emailVerified: true,
              image: profile?.picture,
              isGmail: true,
            });
            user.id = newUser._id.toString();
            // user.username = newUser.username;
          }
        }
        return true;
      } catch (error) {
        const errorMessage = error?.message || error?.type || error;
        throw new CustomError(errorMessage);
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    // signOut: '/auth/signout',
    // error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
