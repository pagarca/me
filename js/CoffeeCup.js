import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import InteractiveObject from 'interactive_object';

const Steam = () => {
    const steamRef = useRef();
    // Create random start offsets for particles
    const particles = useMemo(() => Array.from({ length: 3 }).map(() => ({
        offset: Math.random() * 10,
        speed: 0.5 + Math.random() * 0.5,
        x: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1
    })), []);

    useFrame((state) => {
        if (!steamRef.current) return;
        steamRef.current.children.forEach((child, i) => {
            const data = particles[i];
            // Cycle rising animation based on time + offset
            const time = state.clock.elapsedTime * data.speed + data.offset;
            const y = (time % 1.5) * 0.4; // Rise up to 0.6 units
            const opacity = 1 - (y / 0.6); // Fade out as it rises
            
            child.position.y = y;
            child.position.x = data.x + Math.sin(time * 2) * 0.05; // Wiggle
            child.position.z = data.z + Math.cos(time * 1.5) * 0.05;
            child.scale.setScalar(0.1 + y * 0.2); // Grow slightly
            child.material.opacity = Math.max(0, opacity * 0.4);
        });
    });

    return React.createElement(
        'group',
        { ref: steamRef, position: [0, 0.25, 0] },
        particles.map((_, i) => 
            React.createElement(
                'mesh',
                { key: i },
                React.createElement('sphereGeometry', { args: [0.1, 8, 8] }),
                React.createElement('meshStandardMaterial', { 
                    color: '#ffffff', 
                    transparent: true, 
                    opacity: 0.4,
                    depthWrite: false
                })
            )
        )
    );
};

const CoffeeCup = ({ onSectionSelect }) => {
    const [hovered, setHovered] = useState(false);

    return React.createElement(
        InteractiveObject,
        { 
            id: 'coffee', 
            onSectionSelect, 
            position: [-1.2, 0.1, 0.8],
            onHoverChange: setHovered 
        },
        // Cup Body
        React.createElement(
            'mesh',
            { position: [0, 0.15, 0] },
            React.createElement('cylinderGeometry', { args: [0.15, 0.12, 0.3, 32, 1, true] }), // Hollow
            React.createElement('meshStandardMaterial', { color: '#ffffff', side: 2 }) // DoubleSide
        ),
        // Cup Bottom
        React.createElement(
            'mesh',
            { position: [0, 0.01, 0], rotation: [-Math.PI / 2, 0, 0] },
            React.createElement('circleGeometry', { args: [0.12, 32] }),
            React.createElement('meshStandardMaterial', { color: '#ffffff' })
        ),
        // Coffee Liquid
        React.createElement(
            'mesh',
            { position: [0, 0.25, 0], rotation: [-Math.PI / 2, 0, 0] }, // Lowered slightly
            React.createElement('circleGeometry', { args: [0.13, 32] }),
            React.createElement('meshStandardMaterial', { color: '#3e2723' })
        ),
        // Handle
        React.createElement(
            'mesh',
            { position: [-0.15, 0.15, 0], rotation: [0, 0, 0] },
            React.createElement('torusGeometry', { args: [0.08, 0.02, 8, 16] }),
            React.createElement('meshStandardMaterial', { color: '#ffffff' })
        ),
        // Steam (Conditional)
        hovered && React.createElement(Steam, null)
    );
};

export default CoffeeCup;
