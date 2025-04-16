import { gql } from "@apollo/client";

export const SIGNIN = gql`
  mutation signin($password: String!, $email: String!) {
    signin(password: $password, email: $email) {
      token
    }
  }
`;

export const SIGNUP = gql`
  mutation signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
    }
  }
`;

export const SIGNUP_WITH_GOOGLE = gql`
  mutation GoogleSignup($token: String!) {
    googleSignup(token: $token) {
      token
    }
  }
`;

export const SIGNIN_WITH_GOOGLE = gql`
  mutation GoogleSignin($token: String!) {
    googleSignin(token: $token) {
      token
    }
  }
`;
