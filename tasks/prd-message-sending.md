# PRD: Implement Message Sending with Apollo Client useMutation

## Introduction/Overview

This feature implements the ability to send new messages in the chat application using Apollo Client's `useMutation` hook. Currently, the chat interface has a text input and send button but lacks the functionality to actually send messages. This feature will complete the basic chat functionality by allowing users to send text messages that appear in the chat and are stored on the server.

## Goals

1. Enable users to send text messages through the existing chat interface
2. Integrate with the existing GraphQL schema and Apollo Client setup
3. Provide immediate visual feedback when messages are sent
4. Maintain consistency with the existing pagination and cache management
5. Handle basic error scenarios gracefully

## User Stories

1. **As a chat user**, I want to type a message and click send so that I can communicate with others
2. **As a chat user**, I want to see my message appear immediately in the chat so that I know it was sent
3. **As a chat user**, I want to see if my message failed to send so that I can try again
4. **As a chat user**, I want the input field to clear after sending so that I can type a new message

## Functional Requirements

1. **Message Input Handling**
   - The system must capture text input from the existing input field
   - The system must validate that the input is not empty before allowing send
   - The system must clear the input field after a successful message send

2. **Message Sending**
   - The system must use Apollo Client's `useMutation` hook to send messages
   - The system must call the `sendMessage` GraphQL mutation with the input text
   - The system must handle the mutation response and update the UI accordingly

3. **Cache Management**
   - The system must add new messages to the Apollo Client cache
   - The system must ensure new messages appear at the top of the chat list
   - The system must maintain compatibility with existing pagination functionality

4. **User Experience**
   - The system must show a loading state while sending messages
   - The system must disable the input field and send button during message send
   - The system must display error messages if message sending fails
   - The system must re-enable the input field after send completion (success or failure)

5. **Error Handling**
   - The system must catch and display GraphQL errors
   - The system must handle network errors gracefully
   - The system must allow users to retry failed message sends

## Non-Goals (Out of Scope)

- File attachments or media sharing
- Message editing or deletion
- Message reactions or emojis
- Offline message queuing
- Message encryption
- User authentication or authorization
- Message threading or replies
- Rich text formatting

## Design Considerations

- Use the existing input field and send button in the chat footer
- Follow the existing component styling patterns
- Maintain the current chat layout and spacing
- Use existing error display components for consistency

## Technical Considerations

- Must integrate with the existing `useChat` hook and chat component
- Must work with the current Apollo Client configuration (HTTP + WebSocket)
- Must handle the `sendMessage` mutation response format
- Must update the Apollo cache without breaking existing pagination
- Should use optimistic updates for immediate UI feedback

## Success Metrics

- Users can successfully send messages and see them appear in the chat
- Message sending completes within 2 seconds under normal conditions
- Error scenarios are handled gracefully without breaking the UI
- No regression in existing pagination functionality
- Cache updates work correctly with new messages

## Open Questions

- Should we implement optimistic updates for immediate UI feedback?
- How should we handle the case where a user sends multiple messages rapidly?
- Should we add any rate limiting to prevent spam?
- How should we handle the case where the WebSocket connection is down?

## Implementation Notes

The implementation should be kept as simple as possible:

- Add state management for the input field
- Implement the `useMutation` hook for `sendMessage`
- Add basic input validation (non-empty check)
- Handle loading and error states
- Update the Apollo cache with new messages
- Clear the input field after successful send

This feature should require minimal changes to the existing codebase and focus only on the core message sending functionality described in the requirements.
