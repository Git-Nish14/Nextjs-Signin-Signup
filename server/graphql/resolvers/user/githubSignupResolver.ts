import { Resolver, Mutation, Arg } from "type-graphql";
import axios from "axios";
import jwt from "jsonwebtoken";
import prisma from "../../../src/config/db";
import { Token } from "../../../src/models/Token";
import { GraphQLError } from "graphql";

@Resolver()
export default class GitHubSignupResolver {
  @Mutation(() => Token)
  async githubSignup(@Arg("code") code: string): Promise<Token> {
    try {
      // 1. Exchange code for access token
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
        throw new GraphQLError("Failed to retrieve access token.");
      }

      // 2. Fetch GitHub user profile
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

      const primaryEmail = emailRes.data.find((e: any) => e.primary)?.email;

      if (!primaryEmail) {
        throw new GraphQLError("Email not available from GitHub.");
      }

      // 3. Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: primaryEmail },
      });

      if (existingUser) {
        throw new GraphQLError(
          "An account with this email already exists. Please sign in."
        );
      }

      // 4. Create new user
      const name = userRes.data.name || userRes.data.login;
      const [firstName, ...rest] = name.split(" ");
      const lastName = rest.join(" ");

      const user = await prisma.user.create({
        data: {
          email: primaryEmail,
          firstName: firstName || "GitHub",
          lastName: lastName || "",
          password: null,
        },
      });

      // 5. Generate JWT
      const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      return { token: jwtToken };
    } catch (error: any) {
      throw new GraphQLError(error.message || "GitHub signup failed");
    }
  }
}
