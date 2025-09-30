import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentails", //Unique identifier for the provider.
      name: "Credentials", // display name (shown on default NextAuth UI)
      //NextAuth will automatically generate a login form using the fields you define in credentials.
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // When the user submits, those fields get passed into your authorize function.
      //credentials becomes an object containing the email and password submitted by the user.
      async authorize(credentails: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentails.email },
              { username: credentails.email },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentails.password,
            user.password
          );
          //Inside authorize(), you return a user object if login succeeds:
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("incorrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      //this user came from return
      if (user) {
        token._id = user._id?.toString();
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
  },
  //instead of showing the default NextAuth login page, it will redirect users to your custom /sign-in page.
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
