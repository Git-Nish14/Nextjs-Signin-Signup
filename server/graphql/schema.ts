import "reflect-metadata";
import { buildSchema } from "type-graphql";
import SignupResolver from "./resolvers/user/signup.mutation";
import SigninResolver from "./resolvers/user/signin.mutation";
import UserResolver from "./resolvers/user/user.query";
import UsersResolver from "./resolvers/user/users.query";
import GoogleSignupResolver from "./resolvers/user/googleSignupResolver";
import GoogleSigninResolver from "./resolvers/user/googleSigninResolver";
import GitHubSigninResolver from "./resolvers/user/githubSigninResolver";
import GitHubSignupResolver from "./resolvers/user/githubSignupResolver";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [
      SignupResolver,
      SigninResolver,
      UserResolver,
      UsersResolver,
      GoogleSignupResolver,
      GoogleSigninResolver,
      GitHubSigninResolver,
      GitHubSignupResolver,
    ],
  });
};
