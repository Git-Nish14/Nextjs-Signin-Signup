import { Resolver, Query, Ctx } from "type-graphql";
import prisma from "../../../src/config/db";
import { User } from "../../../src/models/User";
import { MyContext } from "../../../src/types/context";

@Resolver()
export default class UserResolver {
  @Query(() => User, { nullable: true })
  async user(@Ctx() ctx: MyContext) {
    if (!ctx.userId) {
      throw new Error("Not authenticated");
    }
    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

//om this code is hacked
