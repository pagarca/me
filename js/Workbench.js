import React, { useState, useMemo } from 'react';
import { Shape } from 'three';

export default function Workbench({ onSectionSelect, isNightMode, onToggleLight, ...props }) {
    // Helper to make an object interactive
    const InteractiveObject = ({ id, children, onClick: customClick, ...meshProps }) => {
        const [hovered, setHover] = useState(false);

        return React.createElement(
            'group',
            {
                ...meshProps,
                onPointerOver: (e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; },
                onPointerOut: (e) => { setHover(false); document.body.style.cursor = 'auto'; },
                onClick: (e) => { 
                    e.stopPropagation(); 
                    if (customClick) customClick();
                    else onSectionSelect(id); 
                },
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
                { position: [0, 0.8, 0] },
                React.createElement('boxGeometry', { args: [3, 1.8, 0.1] }), // Bigger (was 2, 1.2)
                React.createElement('meshStandardMaterial', { color: '#111' })
            ),
            // Stand
            React.createElement(
                'mesh',
                { position: [0, -0.2, 0] },
                React.createElement('cylinderGeometry', { args: [0.1, 0.2, 0.4] }),
                React.createElement('meshStandardMaterial', { color: '#222' })
            ),
            // Screen Glow
            React.createElement(
                'mesh',
                { position: [0, 0.8, 0.06] },
                React.createElement('planeGeometry', { args: [2.8, 1.6] }), // Bigger (was 1.8, 1)
                React.createElement('meshStandardMaterial', { color: '#00ff00', emissive: '#00ff00', emissiveIntensity: 0.5 })
            ),
            // Keyboard (Child of Monitor Group)
            React.createElement(
                'group',
                { position: [0, -0.5, 0.7] }, // Relative to Monitor Group [0, 0.6, -1] -> Global [0, 0.1, -0.3]
                // Chassis
                React.createElement(
                    'mesh',
                    { position: [0, 0.02, 0] },
                    React.createElement('boxGeometry', { args: [1.4, 0.05, 0.5] }),
                    React.createElement('meshStandardMaterial', { color: '#2d3436' })
                ),
                // Keys Block
                React.createElement(
                    'mesh',
                    { position: [0, 0.06, 0] },
                    React.createElement('boxGeometry', { args: [1.3, 0.02, 0.4] }),
                    React.createElement('meshStandardMaterial', { color: '#000000' })
                )
            )
        ),

        // 3D Printer - Interactive
        React.createElement(
            InteractiveObject,
            { id: 'printer', position: [2, 0.2, 0.5], rotation: [0, -0.5, 0] },
            // Bed (Base)
            React.createElement(
                'mesh',
                { position: [0, 0.1, 0] },
                React.createElement('boxGeometry', { args: [1, 0.1, 1] }),
                React.createElement('meshStandardMaterial', { color: '#222' })
            ),
            // Gantry Frame (Left Pillar)
            React.createElement(
                'mesh',
                { position: [-0.4, 0.6, 0] },
                React.createElement('boxGeometry', { args: [0.1, 1, 0.1] }),
                React.createElement('meshStandardMaterial', { color: '#333' })
            ),
            // Gantry Frame (Right Pillar)
            React.createElement(
                'mesh',
                { position: [0.4, 0.6, 0] },
                React.createElement('boxGeometry', { args: [0.1, 1, 0.1] }),
                React.createElement('meshStandardMaterial', { color: '#333' })
            ),
            // Gantry Frame (Top Bar)
            React.createElement(
                'mesh',
                { position: [0, 1.1, 0] },
                React.createElement('boxGeometry', { args: [1, 0.1, 0.1] }),
                React.createElement('meshStandardMaterial', { color: '#333' })
            ),
            // Printed Object (Little Pyramid/Cone)
            React.createElement(
                'mesh',
                { position: [0, 0.3, 0] },
                React.createElement('coneGeometry', { args: [0.2, 0.4, 4] }), // A little pyramid
                React.createElement('meshStandardMaterial', { color: '#00ffff' }) // Cyan color
            )
        ),

        // Camera (CV) - Interactive
        React.createElement(
            InteractiveObject,
            { id: 'camera', position: [-2.2, 0.5, -0.5], rotation: [0, 0.5, 0] }, // Moved to -3
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
                { position: [0, 0, 0.2], rotation: [Math.PI / 2, 0, 0] },
                React.createElement('cylinderGeometry', { args: [0.2, 0.2, 0.2] }),
                React.createElement('meshStandardMaterial', { color: '#111' })
            ),
            // Lens Ring (Silver)
            React.createElement(
                'mesh',
                { position: [0, 0, 0.3], rotation: [0, 0, 0] },
                React.createElement('torusGeometry', { args: [0.2, 0.02, 16, 32] }),
                React.createElement('meshStandardMaterial', { color: '#silver' })
            ),
            // Viewfinder (Extruded Trapezoid)
            (() => {
                const shape = useMemo(() => {
                    const s = new Shape();
                    s.moveTo(-0.15, 0);
                    s.lineTo(0.15, 0);
                    s.lineTo(0.1, 0.15);
                    s.lineTo(-0.1, 0.15);
                    s.lineTo(-0.15, 0);
                    return s;
                }, []);

                const extrudeSettings = { depth: 0.3, bevelEnabled: false };

                return React.createElement(
                    'mesh',
                    { position: [0, 0.25, -0.15], rotation: [0, 0, 0] },
                    React.createElement('extrudeGeometry', { args: [shape, extrudeSettings] }),
                    React.createElement('meshStandardMaterial', { color: '#181818' })
                );
            })()
        ),

        // Coffee Cup (Essential)
        React.createElement(
            InteractiveObject,
            { id: 'coffee', position: [-1, 0.1, 0.8] },
            // Cup Body
            React.createElement(
                'mesh',
                { position: [0, 0.15, 0] },
                React.createElement('cylinderGeometry', { args: [0.15, 0.12, 0.3] }),
                React.createElement('meshStandardMaterial', { color: '#ffffff' })
            ),
            // Coffee Liquid
            React.createElement(
                'mesh',
                { position: [0, 0.28, 0], rotation: [-Math.PI / 2, 0, 0] },
                React.createElement('circleGeometry', { args: [0.13] }),
                React.createElement('meshStandardMaterial', { color: '#3e2723' }) // Dark Coffee
            ),
            // Handle
            React.createElement(
                'mesh',
                { position: [-0.15, 0.15, 0], rotation: [0, 0, 0] },
                React.createElement('torusGeometry', { args: [0.08, 0.02, 8, 16] }), // Full ring
                React.createElement('meshStandardMaterial', { color: '#ffffff' })
            )
        ),

        // Desk Lamp
        React.createElement(
            InteractiveObject,
            { 
                id: 'lamp', 
                position: [2.5, 0.1, -1.0], 
                rotation: [0, 2.2, 0], // Face towards monitor/keyboard
                onClick: onToggleLight 
            },
            React.createElement(
                'group',
                { scale: [1.3, 1.3, 1.3] }, // 30% Bigger
                // Base
                React.createElement(
                    'mesh',
                    { position: [0, 0.05, 0] },
                    React.createElement('cylinderGeometry', { args: [0.2, 0.25, 0.1] }),
                    React.createElement('meshStandardMaterial', { color: '#333' })
                ),
                // Lower Arm
                React.createElement(
                    'mesh',
                    { position: [0, 0.4, 0.15], rotation: [0.4, 0, 0] }, // Leaning back slightly
                    React.createElement('cylinderGeometry', { args: [0.05, 0.05, 0.8] }),
                    React.createElement('meshStandardMaterial', { color: '#444' })
                ),
                // Joint
                React.createElement(
                    'mesh',
                    { position: [0, 0.75, 0.3] },
                    React.createElement('sphereGeometry', { args: [0.08] }),
                    React.createElement('meshStandardMaterial', { color: '#333' })
                ),
                // Upper Arm (Articulated)
                React.createElement(
                    'mesh',
                    { position: [0, 1.0, 0.05], rotation: [-0.8, 0, 0] }, // Leaning forward
                    React.createElement('cylinderGeometry', { args: [0.05, 0.05, 0.8] }),
                    React.createElement('meshStandardMaterial', { color: '#444' })
                ),
                // Head (Bulb cover)
                React.createElement(
                    'mesh',
                    { position: [0, 1.3, -0.3], rotation: [1, 0, 0] },
                    React.createElement('coneGeometry', { args: [0.25, 0.5, 32, 1, true] }), 
                    React.createElement('meshStandardMaterial', { color: '#333', side: 2 })
                ),
                // Bulb
                React.createElement(
                    'mesh',
                    { position: [0, 1.2, -0.3], rotation: [1, 0, 0] },
                    React.createElement('sphereGeometry', { args: [0.1] }),
                    React.createElement('meshStandardMaterial', 
                        {color: isNightMode ? '#ffaa00' : '#57575778' })
                ),
                // Light source (Bulb)
                React.createElement(
                    'pointLight',
                    { 
                        position: [0, 1.2, -0.3], 
                        distance: 8,
                        decay: 2,
                        intensity: isNightMode ? 8 : 0, 
                        color: '#ffaa00' 
                    }
                )
            )
        )
    );
}
