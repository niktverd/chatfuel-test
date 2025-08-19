import {useState, useCallback} from 'react';
import {useQuery, useMutation, DocumentNode} from '@apollo/client';
import {toast} from 'react-hot-toast';
import type {MessageEdge} from '../../__generated__/resolvers-types';
import {MessageSender, MessageStatus} from '../../__generated__/resolvers-types';
import {SEND_MESSAGE_MUTATION} from '../graphql/documents';

const DEFAULT_PAGE_SIZE = 10;
const PAGINATION_THRESHOLD = 5;

export const useChatHook = (query: DocumentNode) => {
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [inputText, setInputText] = useState('');

    const {data, loading, error, fetchMore, refetch} = useQuery(query, {
        variables: {
            first: DEFAULT_PAGE_SIZE,
            after: null,
        },
        notifyOnNetworkStatusChange: true,
    });

    const [sendMessage, {loading: sendingMessage}] = useMutation(SEND_MESSAGE_MUTATION, {
        onError: (error) => {
            toast.error(`Failed to send message: ${error.message}`);
            console.error('Failed to send message:', error);
        },
        onCompleted: (data) => {
            console.log('Message sent successfully:', data);
            setInputText('');
        },
        update: (cache, {data}) => {
            const newMessage = data?.sendMessage;
            if (!newMessage) {
                return;
            }

            cache.modify({
                fields: {
                    messages(existingMessages = {edges: []}) {
                        const newMessageEdge = {
                            __typename: 'MessageEdge',
                            cursor: newMessage.id,
                            node: newMessage,
                        };

                        return {
                            ...existingMessages,
                            edges: [...existingMessages.edges, newMessageEdge],
                        };
                    },
                },
            });
        },
    });

    const messages = data?.messages?.edges?.map((edge: MessageEdge) => edge.node) || [];
    const pageInfo = data?.messages?.pageInfo;

    const loadMoreMessages = useCallback(async () => {
        if (!pageInfo?.hasNextPage || isFetchingMore) {
            return;
        }

        setIsFetchingMore(true);

        try {
            await fetchMore({
                variables: {
                    first: DEFAULT_PAGE_SIZE,
                    after: pageInfo.endCursor,
                },

                updateQuery: (prev, {fetchMoreResult}) => {
                    if (!fetchMoreResult) {
                        return prev;
                    }

                    return {
                        messages: {
                            ...fetchMoreResult.messages,
                            edges: [...prev.messages.edges, ...fetchMoreResult.messages.edges],
                        },
                    };
                },
            });
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            setIsFetchingMore(false);
        }
    }, [fetchMore, pageInfo?.hasNextPage, pageInfo?.endCursor, isFetchingMore]);

    const handleEndReached = useCallback(
        (index: number) => {
            if (
                index >= messages.length - PAGINATION_THRESHOLD &&
                pageInfo?.hasNextPage &&
                !isFetchingMore
            ) {
                loadMoreMessages();
            }
        },
        [messages.length, pageInfo?.hasNextPage, isFetchingMore, loadMoreMessages],
    );

    const handleSendMessage = useCallback(async () => {
        if (inputText.trim().length === 0) {
            return;
        }

        try {
            await sendMessage({
                variables: {text: inputText.trim()},
                optimisticResponse: {
                    sendMessage: {
                        __typename: 'Message',
                        id: `optimistic-${Date.now()}`,
                        text: inputText.trim(),
                        status: MessageStatus.Sending,
                        updatedAt: new Date().toISOString(),
                        sender: MessageSender.Admin,
                    },
                },
            });
        } catch (error) {
            console.error('Error in handleSendMessage:', error);
        }
    }, [inputText, sendMessage]);

    return {
        messages,
        loading,
        error,
        isFetchingMore,
        handleEndReached,
        handleRetry: refetch,
        inputText,
        setInputText,
        handleSendMessage,
        sendingMessage,
    };
};
