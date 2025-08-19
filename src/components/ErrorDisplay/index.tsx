import css from './ErrorDisplay.module.css';

export const ErrorDisplay: React.FC<{error: Error; onRetry: () => void}> = ({error, onRetry}) => (
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
                    textAlign: 'center',
                }}
            >
                <div style={{fontSize: '24px', color: '#e74c3c', marginBottom: '8px'}}>⚠️</div>
                <div
                    style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        marginBottom: '8px',
                    }}
                >
                    Error Loading Messages
                </div>
                <div
                    style={{
                        fontSize: '14px',
                        color: '#7f8c8d',
                        marginBottom: '16px',
                        maxWidth: '400px',
                    }}
                >
                    {error.message}
                </div>
                <button
                    onClick={onRetry}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#2980b9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#3498db';
                    }}
                >
                    Try Again
                </button>
            </div>
        </div>
    </div>
);
