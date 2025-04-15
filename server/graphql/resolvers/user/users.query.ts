import { Resolver, Query } from "type-graphql";
import prisma from "../../../src/config/db";
import { User } from "../../../src/models/User";

@Resolver()
export default class UsersResolver {
  @Query(() => [User])
  async users() {
    return prisma.user.findMany({});
  }
}
