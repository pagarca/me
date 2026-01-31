import React from 'react';

const LoadingScreen = () => {
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
                zIndex: 9999
            }
        },
        React.createElement('div', {
            style: {
                fontSize: '2rem',
                marginBottom: '1rem',
                animation: 'blink 1s step-end infinite'
            }
        }, 'LOADING'),
        React.createElement('div', {
            style: {
                width: '200px',
                height: '4px',
                backgroundColor: '#222',
                borderRadius: '2px',
                overflow: 'hidden'
            }
        }, React.createElement('div', {
            style: {
                width: '50%',
                height: '100%',
                backgroundColor: '#4cd137',
                animation: 'loading 1.5s ease-in-out infinite',
                boxShadow: '0 0 10px rgba(76, 209, 55, 0.5)'
            }
        })),
        React.createElement('p', {
            style: {
                marginTop: '1rem',
                opacity: 0.7,
                fontSize: '1rem'
            }
        }, 'Initializing 3D environment...')
    );
};

export default LoadingScreen;
