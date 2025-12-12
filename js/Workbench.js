import React, { useState } from 'react';

export default function Workbench({ onSectionSelect, ...props }) {
    // Helper to make an object interactive
    const InteractiveObject = ({ id, children, ...meshProps }) => {
        const [hovered, setHover] = useState(false);
        
        return React.createElement(
            'group',
            {
                ...meshProps,
                onPointerOver: (e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; },
                onPointerOut: (e) => { setHover(false); document.body.style.cursor = 'auto'; },
                onClick: (e) => { e.stopPropagation(); onSectionSelect(id); },
                scale: hovered ? 1.05 : 1,
            },
            children
        );
    };

    return React.createElement(
        'group',
        { ...props },
        // Desk Surface
        React.createElement(
            'mesh',
            { position: [0, 0, 0], castShadow: true, receiveShadow: true },
            React.createElement('boxGeometry', { args: [6, 0.2, 3] }),
            React.createElement('meshStandardMaterial', { color: '#8B4513' })
        ),
        // Desk Legs
        [-2.5, 2.5].map((x) =>
            [-1.2, 1.2].map((z) =>
                React.createElement(
                    'mesh',
                    { position: [x, -1.5, z], key: `leg-${x}-${z}` },
                    React.createElement('cylinderGeometry', { args: [0.1, 0.1, 3] }),
                    React.createElement('meshStandardMaterial', { color: '#333' })
                )
            )
        ),

        // Monitor (CV) - Interactive
        React.createElement(
            InteractiveObject,
            { id: 'monitor', position: [0, 0.6, -1] },
            // Screen
            React.createElement(
                'mesh',
                { position: [0, 0.5, 0] },
                React.createElement('boxGeometry', { args: [2, 1.2, 0.1] }),
                React.createElement('meshStandardMaterial', { color: '#111' })
            ),
            // Stand
            React.createElement(
                'mesh',
                { position: [0, -0.2, 0] },
                React.createElement('cylinderGeometry', { args: [0.1, 0.2, 0.5] }),
                React.createElement('meshStandardMaterial', { color: '#222' })
            ),
             // Screen Glow
             React.createElement(
                'mesh',
                { position: [0, 0.5, 0.06] },
                React.createElement('planeGeometry', { args: [1.8, 1] }),
                React.createElement('meshStandardMaterial', { color: '#00ff00', emissive: '#00ff00', emissiveIntensity: 0.5 })
            )
        ),

        // 3D Printer - Interactive
        React.createElement(
            InteractiveObject,
            { id: 'printer', position: [2, 0.5, 0.5], rotation: [0, -0.5, 0] },
            React.createElement(
                'mesh',
                { position: [0, 0.5, 0] },
                React.createElement('boxGeometry', { args: [1.2, 1.2, 1.2] }),
                React.createElement('meshStandardMaterial', { color: '#ddd', wireframe: true })
            ),
            React.createElement(
                'mesh',
                { position: [0, 0.1, 0] },
                React.createElement('boxGeometry', { args: [1, 0.05, 1] }),
                React.createElement('meshStandardMaterial', { color: '#222' })
            )
        ),

        // Camera (CV) - Interactive
        React.createElement(
            InteractiveObject,
            { id: 'camera', position: [-2, 0.25, 0.5], rotation: [0, 0.5, 0] },
             // Body
             React.createElement(
                'mesh',
                { position: [0, 0, 0] },
                React.createElement('boxGeometry', { args: [0.8, 0.5, 0.3] }),
                React.createElement('meshStandardMaterial', { color: '#222' })
            ),
            // Lens
            React.createElement(
                'mesh',
                { position: [0, 0, 0.2], rotation: [Math.PI/2, 0, 0] },
                 React.createElement('cylinderGeometry', { args: [0.2, 0.2, 0.3] }),
                 React.createElement('meshStandardMaterial', { color: '#111' })
            ),
            // Lens Ring (Silver)
             React.createElement(
                'mesh',
                { position: [0, 0, 0.35], rotation: [Math.PI/2, 0, 0] },
                 React.createElement('torusGeometry', { args: [0.2, 0.02, 16, 32] }),
                 React.createElement('meshStandardMaterial', { color: '#silver' })
            )
        )
    );
}
