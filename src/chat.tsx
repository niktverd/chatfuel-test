import React, {Fragment} from 'react';
import {gql} from '@apollo/client';
import {ItemContent, Virtuoso} from 'react-virtuoso';
import cn from 'clsx';

import type {Message} from '../__generated__/resolvers-types';

import {LoadingSpinner, ErrorDisplay, PaginationLoader, MessageItem} from './components';
import {useChatHook} from './hooks/useChat';

import css from './chat.module.css';

const MESSAGES_QUERY = gql`
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

const getItem: ItemContent<Message, unknown> = (_, data) => {
    return <MessageItem {...data} />;
};

export const Chat: React.FC = () => {
    const {messages, loading, error, isFetchingMore, handleEndReached, handleRetry} =
        useChatHook(MESSAGES_QUERY);

    if (loading && !isFetchingMore) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay error={error} onRetry={handleRetry} />;
    }

    return (
        <Fragment>
            <div className={cn(css.root)}>
                <div className={css.container}>
                    <Virtuoso
                        className={css.list}
                        data={messages}
                        itemContent={getItem}
                        endReached={handleEndReached}
                        overscan={5}
                        components={{
                            Footer: () => (isFetchingMore ? <PaginationLoader /> : null),
                        }}
                    />
                </div>
                <div className={css.footer}>
                    <input type="text" className={css.textInput} placeholder="Message text" />
                    <button>Send</button>
                </div>
            </div>
        </Fragment>
    );
};
