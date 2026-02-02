import { gql } from "@apollo/client"

export const GET_FEEDS = gql`
  query GetFeeds {
    allFeeds {
      id
      user
      description
      workout
      stats
      time
  }
}
`