import {gql} from '@apollo/client';

export const MESSAGES_QUERY = gql`
    query GetMessages($first: Int, $after: MessagesCursor) {
        messages(first: $first, after: $after) {
            edges {
                node {
                    id
                    text
                    status
                    updatedAt
                    sender
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
            }
        }
    }
`;

export const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($text: String!) {
        sendMessage(text: $text) {
            id
            text
            status
            updatedAt
            sender
        }
    }
`;
