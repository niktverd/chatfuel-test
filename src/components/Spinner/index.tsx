import css from './Spinner.module.css';

export const LoadingSpinner: React.FC = () => (
    <div className={css.root}>
        <div className={css.container}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                ></div>
                <div style={{fontSize: '16px', color: '#666'}}>Loading messages...</div>
            </div>
        </div>
    </div>
);
