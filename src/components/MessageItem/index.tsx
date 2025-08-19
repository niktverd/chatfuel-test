import {Message, MessageSender} from '../../../__generated__/resolvers-types';
import css from './MessageItem.module.css';
import cn from 'clsx';

export const MessageItem: React.FC<Message> = ({text, sender}) => {
    return (
        <div className={css.item}>
            <div className={cn(css.message, sender === MessageSender.Admin ? css.out : css.in)}>
                {text}
            </div>
        </div>
    );
};
