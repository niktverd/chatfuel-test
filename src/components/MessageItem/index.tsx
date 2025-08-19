import {useMemo} from 'react';
import {Message, MessageSender, MessageStatus} from '../../../__generated__/resolvers-types';
import css from './MessageItem.module.css';
import cn from 'clsx';

export const MessageItem: React.FC<Message> = ({text, sender, status}) => {
    const statusIcon = useMemo(() => {
        switch (status) {
            case MessageStatus.Sending:
                return '✓';
            case MessageStatus.Sent:
                return '✓✓';
            case MessageStatus.Read:
                return '✓✓✓';
            default:
                return null;
        }
    }, [status]);

    return (
        <div className={css.item}>
            <div className={cn(css.message, sender === MessageSender.Admin ? css.out : css.in)}>
                <div className={css.text}>{text}</div>
                <div className={css.status}>{statusIcon}</div>
            </div>
        </div>
    );
};
