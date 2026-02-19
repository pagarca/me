import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return React.createElement(
                'div',
                {
                    style: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#111',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontFamily: "'VT323', monospace",
                        color: '#4cd137',
                        zIndex: 9999,
                        padding: '20px',
                        boxSizing: 'border-box'
                    }
                },
                React.createElement('h1', {
                    style: {
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        textShadow: '0 0 10px rgba(76, 209, 55, 0.7)'
                    }
                }, 'SYSTEM ERROR'),
                React.createElement('p', {
                    style: {
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        opacity: 0.9
                    }
                }, 'Something went wrong loading the 3D environment.'),
                React.createElement('button', {
                    onClick: () => window.location.reload(),
                    style: {
                        backgroundColor: 'transparent',
                        color: '#4cd137',
                        border: '2px solid #4cd137',
                        padding: '12px 32px',
                        fontSize: '1.2rem',
                        fontFamily: "'VT323', monospace",
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'all 0.2s'
                    },
                    onMouseOver: (e) => {
                        e.target.style.backgroundColor = '#4cd137';
                        e.target.style.color = '#111';
                    },
                    onMouseOut: (e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = '#4cd137';
                    }
                }, 'Reload Page'),
                React.createElement('div', {
                    style: {
                        marginTop: '2rem',
                        padding: '1rem',
                        backgroundColor: 'rgba(0, 10, 0, 0.5)',
                        border: '1px solid #4cd137',
                        borderRadius: '4px',
                        maxWidth: '600px',
                        width: '100%'
                    }
                },
                    React.createElement('p', {
                        style: {
                            fontSize: '1rem',
                            opacity: 0.7,
                            wordBreak: 'break-word',
                            margin: 0
                        }
                    }, this.state.error && this.state.error.toString())
                )
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
