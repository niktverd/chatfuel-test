import { gql } from '@apollo/client';

// Fragment for Message entity fields
export const MESSAGE_FIELDS_FRAGMENT = gql`
  fragment MessageFields on Message {
    id
    text
    status
    updatedAt
    sender
  }
`;

// Fragment for MessageEdge fields (pagination edges)
export const MESSAGE_EDGE_FIELDS_FRAGMENT = gql`
  fragment MessageEdgeFields on MessageEdge {
    cursor
    node {
      ...MessageFields
    }
  }
  ${MESSAGE_FIELDS_FRAGMENT}
`;

// Fragment for PageInfo fields (pagination metadata)
export const PAGE_INFO_FIELDS_FRAGMENT = gql`
  fragment PageInfoFields on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`; 