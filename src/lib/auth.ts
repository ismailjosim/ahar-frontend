import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"
import { sendPasswordResetEmail } from "./email"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      phone: {
        type: "string",

        required: false,
      },

      role: {
        type: "string",

        required: false,

        defaultValue: "customer",

        input: false,
      },

      isActive: {
        type: "boolean",

        required: false,

        defaultValue: true,

        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,

    minPasswordLength: 8,

    maxPasswordLength: 128,

    autoSignIn: true,

    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 120,

    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,

        name: user.name ?? "User",

        resetUrl: url,
        expiresIn: "2 minutes",
      })
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  account: {
    accountLinking: {
      enabled: true,

      trustedProviders: ["google"],
    },
  },

  experimental: {
    joins: true,
  },
})
