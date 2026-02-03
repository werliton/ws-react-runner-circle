import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    User(id: $id) {
      id
      name
      username
      email
      phone
      city
      state
      bio
    }
  }
`;
