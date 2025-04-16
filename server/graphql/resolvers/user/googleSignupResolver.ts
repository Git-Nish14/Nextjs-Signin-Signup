import { Resolver, Mutation, Arg } from "type-graphql";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../../../src/config/db";
import { Token } from "../../../src/models/Token";
import { GraphQLError } from "graphql";

// Create OAuth2 client instance
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Resolver()
export default class GoogleSignupResolver {
  @Mutation(() => Token)
  async googleSignup(@Arg("token") token: string): Promise<Token> {
    // 1. Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error("Invalid Google token.");
    }

    const { email, given_name, family_name } = payload;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // ❌ Throw error if email already registered
    if (existingUser) {
      throw new GraphQLError(
        "An account with this email already exists. Please sign in."
      );
    }

    // 3. Create new user
    const user = await prisma.user.create({
      data: {
        email,
        firstName: given_name || "",
        lastName: family_name || "",
        password: null, // password is null for OAuth users
      },
    });

    // 4. Generate JWT
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return { token: jwtToken };
  }
}
