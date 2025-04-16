import { Resolver, Mutation, Arg } from "type-graphql";
import prisma from "../../../src/config/db";
import jwt from "jsonwebtoken";
import { Token } from "../../../src/models/Token";
import { GraphQLError } from "graphql";

@Resolver()
export default class GithubSigninResolver {
  @Mutation(() => Token)
  async githubSignin(
    @Arg("email") email: string,
    @Arg("name") name: string // still passed but not used here
  ): Promise<Token> {
    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new GraphQLError(
        "No account found with this email. Please sign up first."
      );
    }

    // 2. Create token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return { token };
  }
}
