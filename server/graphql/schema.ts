import "reflect-metadata";
import { buildSchema } from "type-graphql";
import SignupResolver from "./resolvers/user/signup.mutation";
import SigninResolver from "./resolvers/user/signin.mutation";
import UserResolver from "./resolvers/user/user.query";
import UsersResolver from "./resolvers/user/users.query";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [SignupResolver, SigninResolver, UserResolver, UsersResolver],
  });
};
