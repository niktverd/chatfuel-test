import React, {Fragment} from 'react';
import {ItemContent, Virtuoso} from 'react-virtuoso';
import cn from 'clsx';

import type {Message} from '../__generated__/resolvers-types';

import {LoadingSpinner, ErrorDisplay, PaginationLoader, MessageItem} from './components';
import {useChatHook} from './hooks/useChat';

import css from './chat.module.css';
import {MESSAGES_QUERY} from './graphql/documents';

const getItem: ItemContent<Message, unknown> = (_, data) => {
    return <MessageItem {...data} />;
};

export const Chat: React.FC = () => {
    const {
        messages,
        loading,
        error,
        isFetchingMore,
        handleEndReached,
        handleRetry,
        inputText,
        setInputText,
        handleSendMessage,
        sendingMessage,
    } = useChatHook(MESSAGES_QUERY);

    const isInputEmpty = inputText.trim().length === 0;

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
                        followOutput="auto"
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
                    <input
                        type="text"
                        className={css.textInput}
                        placeholder="Message text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={sendingMessage}
                    />
                    <button disabled={isInputEmpty || sendingMessage} onClick={handleSendMessage}>
                        {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </div>
        </Fragment>
    );
};
