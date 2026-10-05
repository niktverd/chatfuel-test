import { ApolloClient, HttpLink, split, InMemoryCache, from } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';
import { persistCache } from 'apollo3-cache-persist';

const PORT = 4000;

// HTTP Link
const httpLink = new HttpLink({
    uri: (operation) => `http://localhost:${PORT}/graphql?op=${operation.operationName}`,
});

// WebSocket Link for subscriptions
const wsLink = new GraphQLWsLink(
    createClient({
        url: `ws://localhost:${PORT}/graphql`,
    }),
);

// Authentication link
const authLink = setContext((_, { headers }) => {
    // Get token from localStorage (adjust as needed for your auth system)
    const token = localStorage.getItem('authToken');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    }

    if (networkError) {
        console.error(`Network error: ${networkError}`);
        // Handle network errors (retry, redirect to login, etc.)
        if ('statusCode' in networkError && networkError.statusCode === 401) {
            // Handle unauthorized access
            localStorage.removeItem('authToken');
            // Could redirect to login page here
        }
    }
});

// Split link - use ws for subscriptions, http for queries/mutations
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink,
);

// Enhanced cache with proper type policies
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                messages: relayStylePagination(['first', 'after']),
            },
        },
        Message: {
            fields: {
                status: {
                    merge: (_, incoming) => incoming,
                },
                updatedAt: {
                    merge: (_, incoming) => incoming,
                },
            },
            keyFields: ['id'],
        },
        MessageEdge: {
            keyFields: ['cursor'],
        },
        MessagePageInfo: {
            keyFields: false,
        },
    },
});

// Initialize cache persistence
const initializeCache = async () => {
    await persistCache({
        cache,
        storage: window.localStorage,
        key: 'apollo-cache-persist',
        maxSize: 1048576, // 1MB
        serialize: true,
    });
};

// Initialize cache persistence
initializeCache().catch(console.error);

export const client = new ApolloClient({
    link: from([errorLink, authLink, splitLink]),
    cache,
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
            notifyOnNetworkStatusChange: true,
        },
        query: {
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});
