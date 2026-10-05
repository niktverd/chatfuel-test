# PRD: Real-Time Message Updates with GraphQL Subscriptions

## Introduction/Overview

This document outlines the requirements for implementing real-time message functionality using GraphQL subscriptions. The goal is to enhance the chat application by allowing users to receive new messages and updates to existing messages instantly, without needing to refresh the page. This feature is critical for creating a fluid and engaging conversational experience.

## Goals

1.  Implement a GraphQL subscription to receive real-time updates for chat messages.
2.  Ensure new messages received via subscription are added to the chat view instantly.
3.  Ensure existing messages are updated in the chat view when an update is received via subscription (e.g., status change).
4.  Handle potential race conditions where a delayed mutation response might be older than an update received via subscription.

## User Stories

1.  **As a user,** I want to see new messages from other participants appear in my chat window in real-time so that I can have a natural and uninterrupted conversation.
2.  **As a user,** I want to see the status of my sent messages update automatically (e.g., from "sending" to "sent") so that I have clear feedback on the message delivery.

## Functional Requirements

1.  The application must connect to the GraphQL server's subscription endpoint.
2.  The system must subscribe to notifications for new and updated messages.
3.  When a **new message** notification is received, the message must be added to the end of the chat list in the Apollo Client cache.
4.  When a **message update** notification is received, the corresponding message in the Apollo Client cache must be updated with the new data.
5.  The system must check the `updatedAt` timestamp of incoming subscription data against the existing data in the cache to prevent overwriting newer data with older data from a delayed mutation response.

## Non-Goals (Out of Scope)

- Displaying a "user is typing..." indicator.
- Adding special visual indicators or animations for newly arrived messages.
- Implementing a mechanism to fetch messages missed during a temporary subscription disconnection.

## Technical Considerations

- The implementation will use Apollo Client's subscription capabilities. This will likely involve updating the `ApolloLink` chain to handle subscriptions over WebSockets.
- The logic for handling incoming subscription data will need to be added to the `useChat` hook to keep the component layer clean.
- Care must be taken to merge incoming subscription data correctly into the Apollo Client cache without disrupting existing pagination logic.

## Success Metrics

- New messages from the server appear in the chat UI within 1 second of being sent.
- Updates to message statuses are reflected in the UI in real-time.
- The application correctly handles delayed mutation responses, ensuring the UI always displays the freshest message data.

## Open Questions

- None at this time. The scope is well-defined by the project's `README.md`.
