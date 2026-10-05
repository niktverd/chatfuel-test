import {gql} from '@apollo/client';
import { MESSAGE_FIELDS_FRAGMENT, MESSAGE_EDGE_FIELDS_FRAGMENT, PAGE_INFO_FIELDS_FRAGMENT } from './fragments';

export const MESSAGES_QUERY = gql`
    query GetMessages($first: Int, $after: MessagesCursor) {
        messages(first: $first, after: $after) {
            edges {
                ...MessageEdgeFields
            }
            pageInfo {
                ...PageInfoFields
            }
        }
    }
    ${MESSAGE_EDGE_FIELDS_FRAGMENT}
    ${PAGE_INFO_FIELDS_FRAGMENT}
`;

export const SEND_MESSAGE_MUTATION = gql`
    mutation SendMessage($text: String!) {
        sendMessage(text: $text) {
            ...MessageFields
        }
    }
    ${MESSAGE_FIELDS_FRAGMENT}
`;

export const MESSAGE_UPDATED_SUBSCRIPTION = gql`
    subscription OnMessageUpdated {
        messageUpdated {
            ...MessageFields
        }
    }
    ${MESSAGE_FIELDS_FRAGMENT}
`;
