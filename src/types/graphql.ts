// TypeScript interfaces for GraphQL operations and entities
// Based on schema.graphql

export enum MessageStatus {
  Sending = 'Sending',
  Sent = 'Sent',
  Read = 'Read',
}

export enum MessageSender {
  Admin = 'Admin',
  User = 'User',
}

// Scalar type for cursor
export type MessagesCursor = string;

export interface Message {
  __typename?: 'Message';
  id: string;
  text: string;
  status: MessageStatus;
  updatedAt: string;
  sender: MessageSender;
}

export interface MessageEdge {
  __typename?: 'MessageEdge';
  node: Message;
  cursor: MessagesCursor;
}

export interface MessagePageInfo {
  __typename?: 'MessagePageInfo';
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: MessagesCursor | null;
  endCursor?: MessagesCursor | null;
}

export interface MessagePage {
  __typename?: 'MessagePage';
  edges: MessageEdge[];
  pageInfo: MessagePageInfo;
}

// GraphQL Operation Variables
export interface GetMessagesVariables {
  first?: number | null;
  after?: MessagesCursor | null;
  before?: MessagesCursor | null;
}

export interface SendMessageVariables {
  text: string;
}

// GraphQL Operation Results
export interface GetMessagesData {
  messages: MessagePage;
}

export interface SendMessageData {
  sendMessage: Message;
}

export interface MessageUpdatedData {
  messageUpdated: Message;
}

export interface MessageAddedData {
  messageAdded: Message;
}

// Apollo Client specific types
export interface ApolloCacheContext {
  cache: import('@apollo/client').ApolloCache<Record<string, unknown>>;
  client: import('@apollo/client').ApolloClient<Record<string, unknown>>;
}

export interface ApolloOperationContext {
  operation: import('@apollo/client').Operation;
  variables: Record<string, unknown>;
}

// Enhanced operation interfaces with proper typing
export interface GraphQLOperation<TData = unknown, TVariables = Record<string, unknown>> {
  data?: TData;
  loading: boolean;
  error?: import('@apollo/client').ApolloError;
  variables: TVariables;
}

export interface GraphQLQuery<TData = unknown, TVariables = Record<string, unknown>> extends GraphQLOperation<TData, TVariables> {
  refetch: (variables?: Partial<TVariables>) => Promise<import('@apollo/client').ApolloQueryResult<TData>>;
  fetchMore: (options: {
    variables?: Partial<TVariables>;
    updateQuery?: (previousQueryResult: TData, options: { fetchMoreResult: TData; variables: TVariables }) => TData;
  }) => Promise<import('@apollo/client').ApolloQueryResult<TData>>;
  networkStatus: import('@apollo/client').NetworkStatus;
}

export interface GraphQLMutation<TData = unknown, TVariables = Record<string, unknown>> extends GraphQLOperation<TData, TVariables> {
  mutate: (options?: {
    variables?: TVariables;
    optimisticResponse?: TData;
    update?: (cache: import('@apollo/client').ApolloCache<Record<string, unknown>>, result: { data?: TData }, options: { variables?: TVariables }) => void;
    onCompleted?: (data: TData, clientOptions?: { client: import('@apollo/client').ApolloClient<Record<string, unknown>> }) => void;
    onError?: (error: import('@apollo/client').ApolloError, clientOptions?: { client: import('@apollo/client').ApolloClient<Record<string, unknown>> }) => void;
  }) => Promise<import('@apollo/client').ApolloQueryResult<TData>>;
}

export interface GraphQLSubscription<TData = unknown, TVariables = Record<string, unknown>> extends GraphQLOperation<TData, TVariables> {
  onData: (options: {
    data: { data?: TData };
    client: import('@apollo/client').ApolloClient<Record<string, unknown>>;
  }) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
}

// Specific typed operation interfaces
export type GetMessagesQuery = GraphQLQuery<GetMessagesData, GetMessagesVariables>;
export type SendMessageMutation = GraphQLMutation<SendMessageData, SendMessageVariables>;
export type MessageUpdatedSubscription = GraphQLSubscription<MessageUpdatedData, Record<string, never>>;
export type MessageAddedSubscription = GraphQLSubscription<MessageAddedData, Record<string, never>>;

// Cache update function types
export type CacheUpdateFunction<TData = unknown, TVariables = Record<string, unknown>> = (
  cache: import('@apollo/client').ApolloCache<Record<string, unknown>>,
  result: { data?: TData },
  options: { variables?: TVariables }
) => void;

// Optimistic response types
export type OptimisticResponseFunction<TData = unknown, TVariables = Record<string, unknown>> = (variables: TVariables) => TData;

// Enhanced Apollo Client Cache and Context Interfaces
export interface ApolloCacheConfig {
  typePolicies: {
    Query: {
      fields: {
        messages: {
          keyArgs: false;
          merge: (existing: MessagePage | undefined, incoming: MessagePage, options: { args: GetMessagesVariables }) => MessagePage;
        };
      };
    };
    Message: {
      keyFields: ['id'];
      fields: {
        status: {
          merge: (existing: MessageStatus, incoming: MessageStatus) => MessageStatus;
        };
        updatedAt: {
          merge: (existing: string, incoming: string) => incoming;
        };
      };
    };
    MessageEdge: {
      keyFields: ['cursor'];
    };
    MessagePageInfo: {
      keyFields: false;
    };
  };
}

export interface ApolloClientConfig {
  uri: string;
  wsUri?: string;
  cache: ApolloCacheConfig;
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all' | 'none' | 'ignore';
      notifyOnNetworkStatusChange: boolean;
      fetchPolicy: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
    };
    query: {
      errorPolicy: 'all' | 'none' | 'ignore';
      fetchPolicy: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
    };
    mutate: {
      errorPolicy: 'all' | 'none' | 'ignore';
    };
  };
  links: ApolloLinkConfig[];
}

export interface ApolloLinkConfig {
  name: string;
  link: import('@apollo/client').ApolloLink;
  options?: Record<string, unknown>;
}

export interface ApolloErrorPolicy {
  errorPolicy: 'all' | 'none' | 'ignore';
  onError?: (error: import('@apollo/client').ApolloError) => void;
}

export interface ApolloCachePolicy {
  fetchPolicy: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
  nextFetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
}

export interface ApolloNetworkPolicy {
  notifyOnNetworkStatusChange: boolean;
  pollInterval: number;
}

export interface ApolloContextValue {
  client: import('@apollo/client').ApolloClient<Record<string, unknown>>;
  cache: import('@apollo/client').ApolloCache<Record<string, unknown>>;
  loading: boolean;
  error?: import('@apollo/client').ApolloError;
}

export interface ApolloProviderContext {
  client: import('@apollo/client').ApolloClient<Record<string, unknown>>;
  children: React.ReactNode;
}

export interface ApolloHookContext<TData = unknown, TVariables = Record<string, unknown>> {
  data?: TData;
  loading: boolean;
  error?: import('@apollo/client').ApolloError;
  variables: TVariables;
  refetch: (variables?: Partial<TVariables>) => Promise<import('@apollo/client').ApolloQueryResult<TData>>;
  networkStatus: import('@apollo/client').NetworkStatus;
}

export interface ApolloMutationContext<TData = unknown, TVariables = Record<string, unknown>> {
  mutate: (options?: {
    variables?: TVariables;
    optimisticResponse?: TData;
    update?: CacheUpdateFunction<TData, TVariables>;
    onCompleted?: (data: TData, clientOptions?: { client: import('@apollo/client').ApolloClient<Record<string, unknown>> }) => void;
    onError?: (error: import('@apollo/client').ApolloError, clientOptions?: { client: import('@apollo/client').ApolloClient<Record<string, unknown>> }) => void;
  }) => Promise<import('@apollo/client').ApolloQueryResult<TData>>;
  loading: boolean;
  error?: import('@apollo/client').ApolloError;
}

export interface ApolloSubscriptionContext<TData = unknown, TVariables = Record<string, unknown>> {
  onData: (options: {
    data: { data?: TData };
    client: import('@apollo/client').ApolloClient<Record<string, unknown>>;
  }) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
  loading: boolean;
  error?: import('@apollo/client').ApolloError;
}

// Cache normalization and identification
export interface CacheFieldPolicy<T = unknown> {
  keyArgs?: false | string[] | ((args: Record<string, unknown>) => string[]);
  read?: (existing: T | undefined, options: { args: Record<string, unknown>; field: import('@apollo/client').FieldPolicy<T> }) => T;
  merge?: (existing: T | undefined, incoming: T, options: { args: Record<string, unknown>; field: import('@apollo/client').FieldPolicy<T> }) => T;
}

export interface CacheTypePolicy {
  keyFields?: false | string[] | ((object: Record<string, unknown>) => string | string[]);
  fields?: Record<string, CacheFieldPolicy<unknown>>;
}

export interface CachePolicies {
  [typename: string]: CacheTypePolicy;
}

// Enhanced cache update utilities
export interface CacheUpdateOptions<TData = unknown, TVariables = Record<string, unknown>> {
  query: import('@apollo/client').DocumentNode;
  variables?: TVariables;
  data: TData;
  merge?: boolean;
}

export interface CacheReadOptions<TData = unknown, TVariables = Record<string, unknown>> {
  query: import('@apollo/client').DocumentNode;
  variables?: TVariables;
  optimistic?: boolean;
}

export interface CacheWriteOptions<TData = unknown, TVariables = Record<string, unknown>> {
  query: import('@apollo/client').DocumentNode;
  variables?: TVariables;
  data: TData;
  broadcast?: boolean;
}

// Relay-style pagination cache helpers
export interface RelayPaginationCacheConfig {
  keyArgs: false | string[] | ((args: Record<string, unknown>) => string[]);
  merge: (existing: MessagePage | undefined, incoming: MessagePage, options: { args: GetMessagesVariables }) => MessagePage;
}

export interface RelayPaginationOptions {
  keyArgs: false | string[] | ((args: Record<string, unknown>) => string[]);
  merge: (existing: unknown, incoming: unknown, options: { args: Record<string, unknown> }) => unknown;
}

// Authentication context
export interface AuthContext {
  token?: string;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
}

export interface ApolloAuthLinkConfig {
  getToken: () => string | null;
  onAuthError: (error: Error) => void;
  refreshToken?: () => Promise<string | null>;
}

// Error handling context
export interface ErrorHandlingContext {
  onGraphQLError: (error: import('@apollo/client').ApolloError) => void;
  onNetworkError: (error: Error) => void;
  onAuthError: (error: Error) => void;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number;
    shouldRetry: (error: Error) => boolean;
  };
}

// Performance monitoring context
export interface PerformanceContext {
  onQueryStart: (operation: import('@apollo/client').Operation) => void;
  onQueryComplete: (operation: import('@apollo/client').Operation, result: import('@apollo/client').ApolloQueryResult<unknown>) => void;
  onMutationStart: (operation: import('@apollo/client').Operation) => void;
  onMutationComplete: (operation: import('@apollo/client').Operation, result: import('@apollo/client').ApolloQueryResult<unknown>) => void;
  onSubscriptionStart: (operation: import('@apollo/client').Operation) => void;
  onSubscriptionComplete: (operation: import('@apollo/client').Operation) => void;
} 