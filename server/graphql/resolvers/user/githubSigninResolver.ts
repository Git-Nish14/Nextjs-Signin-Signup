import { Resolver, Mutation, Arg } from "type-graphql";
import axios from "axios";
import jwt from "jsonwebtoken";
import prisma from "../../../src/config/db";
import { Token } from "../../../src/models/Token";
import { GraphQLError } from "graphql";

@Resolver()
export default class GitHubSigninResolver {
  @Mutation(() => Token)
  async githubSignin(@Arg("code") code: string): Promise<Token> {
    try {
      const tokenRes = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      const accessToken = tokenRes.data.access_token;

      if (!accessToken) {
        throw new GraphQLError("Failed to get access token.");
      }

      const userRes = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const emailRes = await axios.get("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const email = emailRes.data.find(
        (e: any) => e.primary && e.verified
      )?.email;

      if (!email) {
        throw new GraphQLError("Email not available from GitHub.");
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        throw new GraphQLError("No account found. Please sign up first.");
      }

      const jwtToken = jwt.sign(
        { userId: existingUser.id },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );

      return { token: jwtToken };
    } catch (error: any) {
      throw new GraphQLError(error.message || "GitHub Signin failed.");
    }
  }
}
