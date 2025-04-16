import { Resolver, Mutation, Arg } from "type-graphql";
import prisma from "../../../src/config/db";
import jwt from "jsonwebtoken";
import { Token } from "../../../src/models/Token";
import { GraphQLError } from "graphql";

@Resolver()
export default class GithubSignupResolver {
  @Mutation(() => Token)
  async githubSignup(
    @Arg("email") email: string,
    @Arg("name") name: string
  ): Promise<Token> {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new GraphQLError(
        "An account with this email already exists. Please sign in."
      );
    }

    // 2. Parse name into first & last
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ");

    // 3. Create new user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: null,
      },
    });

    // 4. Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return { token };
  }
}
