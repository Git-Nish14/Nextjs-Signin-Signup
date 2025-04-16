import { Resolver, Mutation, Arg } from "type-graphql";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "../../../src/config/db";
import { Token } from "../../../src/models/Token";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Resolver()
export default class GoogleSigninResolver {
  @Mutation(() => Token)
  async googleSignin(@Arg("token") token: string): Promise<Token> {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error("Invalid Google token.");
    }

    const { email, given_name, family_name } = payload;

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Auto-create user if doesn't exist
      user = await prisma.user.create({
        data: {
          email,
          firstName: given_name || "",
          lastName: family_name || "",
        },
      });
    }

    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return { token: jwtToken };
  }
}
