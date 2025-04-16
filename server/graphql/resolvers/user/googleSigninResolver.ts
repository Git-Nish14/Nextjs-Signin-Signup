import { Resolver, Mutation, Arg } from "type-graphql";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../../../src/config/db";
import { Token } from "../../../src/models/Token";
import { GraphQLError } from "graphql";

// Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Resolver()
export default class GoogleSigninResolver {
  @Mutation(() => Token)
  async googleSignin(@Arg("token") token: string): Promise<Token> {
    // 1. Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error("Invalid Google token.");
    }

    const { email } = payload;

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ❌ User not registered
    if (!user) {
      throw new GraphQLError(
        "No account found with this email. Please sign up first."
      );
    }

    // 3. Generate token
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return { token: jwtToken };
  }
}
