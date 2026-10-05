# Task List: Implement Message Sending with Apollo Client useMutation

## Relevant Files

- `src/chat.tsx` - Contains the main Chat component with input field and send button
- `src/hooks/useChat.tsx` - Existing hook for message fetching and pagination
- `src/graphql/client.ts` - Apollo Client configuration
- `src/graphql/schema.graphql` - GraphQL schema definition
- `__generated__/resolvers-types.ts` - Generated TypeScript types for GraphQL operations

## Tasks

- [x] 1.0 Set up GraphQL mutation and Apollo Client integration
  - [x] 1.1 Create SEND_MESSAGE_MUTATION GraphQL document in chat.tsx
  - [x] 1.2 Import useMutation hook from @apollo/client
  - [x] 1.3 Set up mutation hook with proper error handling

- [x] 2.0 Implement message input state management and validation
  - [x] 2.1 Add useState hook for input text value
  - [x] 2.2 Add onChange handler for input field
  - [x] 2.3 Implement input validation (non-empty check)
  - [x] 2.4 Add disabled state for send button when input is empty

- [x] 3.0 Add message sending functionality with useMutation hook
  - [x] 3.1 Implement handleSendMessage function
  - [x] 3.2 Call sendMessage mutation with input text
  - [x] 3.3 Handle mutation response and errors
  - [x] 3.4 Clear input field after successful send

- [x] 4.0 Implement Apollo cache updates for new messages
  - [x] 4.1 Add optimistic response to mutation
  - [x] 4.2 Update cache to include new message at the top
  - [x] 4.3 Ensure compatibility with existing pagination
  - [x] 4.4 Handle cache update errors gracefully

- [x] 5.0 Add loading states, error handling, and user experience improvements
  - [x] 5.1 Add loading state during message send
  - [x] 5.2 Disable input and send button during send operation
  - [x] 5.3 Display error messages for failed sends
  - [x] 5.4 Add retry functionality for failed messages
