import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'app';
import ErrorBoundary from 'error_boundary';

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

