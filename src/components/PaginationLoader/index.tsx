import css from './PaginationLoader.module.css';

type PaginationLoaderProps = {
    placeholder?: string;
};

export const PaginationLoader: React.FC<PaginationLoaderProps> = ({
    placeholder = 'Loading more messages...',
}) => (
    <div className={css.container}>
        <div className={css.spinner} />
        <span style={{fontSize: '14px', color: '#666'}}>{placeholder}</span>
    </div>
);
