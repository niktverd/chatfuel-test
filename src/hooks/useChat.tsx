import {useState, useCallback} from 'react';
import {useQuery, DocumentNode} from '@apollo/client';
import type {MessageEdge} from '../../__generated__/resolvers-types';

const DEFAULT_PAGE_SIZE = 10;
const PAGINATION_THRESHOLD = 5;

export const useChatHook = (query: DocumentNode) => {
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const {data, loading, error, fetchMore, refetch} = useQuery(query, {
        variables: {
            first: DEFAULT_PAGE_SIZE,
            after: null,
        },
        notifyOnNetworkStatusChange: true,
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

    return {
        messages,
        loading,
        error,
        hasNextPage: pageInfo?.hasNextPage || false,
        hasPreviousPage: pageInfo?.hasPreviousPage || false,
        cursor: pageInfo?.endCursor || null,
        isFetchingMore,
        handleEndReached,
        handleRetry: refetch,
    };
};
