## Relevant Files

- `src/graphql/client.ts` - To configure Apollo Client to handle GraphQL subscriptions over WebSockets.
- `src/graphql/documents.ts` - To define the new GraphQL subscription query.
- `src/hooks/useChat.tsx` - To integrate the subscription logic and update the cache with real-time data.

### Notes

- The `graphql-ws` library is required for subscriptions; it is already listed as a dependency.
- The server runs the subscription endpoint on the same URL as the main GraphQL endpoint (`ws://localhost:4000/graphql`).

## Tasks

- [x] 1.0 Configure Apollo Client for Subscriptions
  - [x] 1.1 In `src/graphql/client.ts`, import necessary utilities from `@apollo/client` (`split`, `GraphQLWsLink`).
  - [x] 1.2 Create a `GraphQLWsLink` instance to handle the WebSocket connection for subscriptions.
  - [x] 1.3 Use the `split` function to direct operations to the correct link: subscriptions go to the `GraphQLWsLink`, while queries and mutations go to the existing `HttpLink`.
  - [x] 1.4 Update the `ApolloClient` constructor to use the new split link.
- [x] 2.0 Define the GraphQL Subscription Query
  - [x] 2.1 In `src/graphql/documents.ts`, create a new exported constant named `MESSAGE_UPDATED_SUBSCRIPTION`.
  - [x] 2.2 Define the subscription query to listen for `messageUpdated` and retrieve all fields of the `Message` type.
- [x] 3.0 Integrate Subscription into `useChat` Hook
  - [x] 3.1 In `src/hooks/useChat.tsx`, import the `useSubscription` hook from `@apollo/client` and the `MESSAGE_UPDATED_SUBSCRIPTION`.
  - [x] 3.2 Call the `useSubscription` hook to listen for message updates.
  - [x] 3.3 Use the `onData` callback provided by the `useSubscription` hook to handle incoming data.
- [x] 4.0 Update Cache with Subscription Data
  - [x] 4.1 Inside the `onData` callback, get the new message data from the subscription result.
  - [x] 4.2 Use `cache.modify` to update the `messages` field in the Apollo Client cache.
  - [x] 4.3 Check if the message received from the subscription already exists in the cache by its `id`.
  - [x] 4.4 If the message is new, add it to the end of the `edges` array in the cache.
  - [x] 4.5 If the message is an update to an existing message, no further action is needed as `cache.modify` will have updated it automatically if the `id` fields match.
- [x] 5.0 Handle Race Conditions with Delayed Mutations
  - [x] 5.1 In the `update` function of the `useMutation` hook (for `sendMessage`), before modifying the cache, compare the `updatedAt` timestamp of the mutation response with the timestamp of the message already in the cache (if it exists).
  - [x] 5.2 Only update the cache with the mutation response if its `updatedAt` timestamp is newer than the one in the cache.
