import { gql } from "@apollo/client";

export const GET_FEEDS = gql`
  query GetFeeds {
    allFeeds {
      id
      user
      description
      stats
      time
    }
  }
`;

export const GET_FEED_BY_CATEGORY = gql`
  query GetFeedByCategory($category: String!) {
    allFeeds(filter: { category: $category }) {
      id
      user
      description
      stats
      time
    }
  }
`;
