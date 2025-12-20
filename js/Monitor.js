import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import InteractiveObject from 'interactive_object';

const CVScreen = () => {
    const greenColor = '#00ff00';
    const glow = 1.2; // Increased brightness

    return React.createElement(
        'group',
        { position: [0, 0.8, 0.07] }, // Slightly in front of screen

        // CRT Global Light (Projects glow onto desk/keyboard)
        React.createElement('pointLight', {
            position: [0, 0, 1],
            distance: 3,
            decay: 2,
            intensity: 10,
            color: greenColor
        }),

        // Background Glow (Subtle)
        React.createElement(
            'mesh',
            { position: [0, 0, -0.01] },
            React.createElement('planeGeometry', { args: [2.8, 1.6] }),
            React.createElement('meshStandardMaterial', {
                color: '#001a00',
                emissive: '#002200',
                emissiveIntensity: 0.2
            })
        ),

        // --- Left Column ---
        React.createElement(
            'group',
            { position: [-0.8, 0, 0] },
            // "Photo" Square
            React.createElement(
                'mesh',
                { position: [0, 0.3, 0.01] },
                React.createElement('planeGeometry', { args: [0.6, 0.6] }),
                React.createElement('meshStandardMaterial', {
                    color: greenColor,
                    emissive: greenColor,
                    emissiveIntensity: glow
                })
            ),
            // Lines below photo
            Array.from({ length: 3 }).map((_, i) =>
                React.createElement(
                    'mesh',
                    { key: `l-left-${i}`, position: [0, -0.2 - (i * 0.15), 0.01] },
                    React.createElement('planeGeometry', { args: [0.6, 0.05] }),
                    React.createElement('meshStandardMaterial', {
                        color: greenColor,
                        emissive: greenColor,
                        emissiveIntensity: glow
                    })
                )
            )
        ),

        // --- Right Column ---
        React.createElement(
            'group',
            { position: [0.4, 0, 0] },
            // Main Text Block (Title area)
            React.createElement(
                'mesh',
                { position: [0, 0.55, 0.01] },
                React.createElement('planeGeometry', { args: [1.4, 0.1] }),
                React.createElement('meshStandardMaterial', {
                    color: greenColor,
                    emissive: greenColor,
                    emissiveIntensity: glow
                })
            ),
            // Body Text simulation (Two columns of small lines)
            Array.from({ length: 6 }).map((_, i) =>
                React.createElement(
                    'group',
                    { key: `l-right-${i}`, position: [0, 0.3 - (i * 0.15), 0] },
                    // Col 1
                    React.createElement(
                        'mesh',
                        { position: [-0.36, 0, 0.01] },
                        React.createElement('planeGeometry', { args: [0.65, 0.03] }),
                        React.createElement('meshStandardMaterial', {
                            color: greenColor,
                            emissive: greenColor,
                            emissiveIntensity: glow
                        })
                    ),
                    // Col 2
                    React.createElement(
                        'mesh',
                        { position: [0.36, 0, 0.01] },
                        React.createElement('planeGeometry', { args: [0.65, 0.03] }),
                        React.createElement('meshStandardMaterial', {
                            color: greenColor,
                            emissive: greenColor,
                            emissiveIntensity: glow
                        })
                    )
                )
            )
        )
    );
};

const GhostMouse = ({ active }) => {
    const mouseBodyRef = useRef();
    
    useFrame((state) => {
        if (!mouseBodyRef.current) return;

        // Smoothly interpolate towards target position
        // If active: follow procedural "ghost" path
        // If inactive: return to center [0, 0.08, 0]
        
        let targetX = 0;
        let targetZ = 0;

        if (active) {
            const time = state.clock.elapsedTime;
            // Constrained organic movement within mousepad bounds (+/- 0.25 range approx)
            targetX = Math.sin(time * 2) * 0.15 + Math.cos(time * 1.3) * 0.1;
            targetZ = Math.cos(time * 1.5) * 0.1 + Math.sin(time * 2.5) * 0.05;
        }

        // Lerp for smooth start/stop
        mouseBodyRef.current.position.x += (targetX - mouseBodyRef.current.position.x) * 0.1;
        mouseBodyRef.current.position.z += (targetZ - mouseBodyRef.current.position.z) * 0.1;
    });

    return React.createElement(
        'group',
        { position: [1.1, -0.5, 0.8] }, // Fixed position on desk
        // Mousepad (Static)
        React.createElement(
            'mesh',
            { position: [0, 0, 0], rotation: [0, -0.3, 0], receiveShadow: true },
            React.createElement('boxGeometry', { args: [0.7, 0.05, 0.75] }),
            React.createElement('meshStandardMaterial', { color: '#222' })
        ),
        // Mouse Body (Animated)
        React.createElement(
            'mesh',
            { 
                ref: mouseBodyRef,
                position: [0, 0.05, 0], 
                rotation: [0, -0.2, 0], 
                castShadow: true 
            },
            React.createElement('boxGeometry', { args: [0.15, 0.08, 0.25] }),
            React.createElement('meshStandardMaterial', { color: '#2d3436' })
        )
    );
};

const Monitor = ({ onSectionSelect, wobble, onHover, onDoomTrigger }) => {
    const [hovered, setHovered] = useState(false);
    const clickCount = useRef(0);
    const lastClickTime = useRef(0);
    
    const handleHover = (val) => {
        setHovered(val);
        if (onHover) onHover(val);
    };

    const handleClick = () => {
        // Trigger normal section select
        if (onSectionSelect) onSectionSelect('monitor');

        const now = Date.now();
        // Reset if more than 1 second between clicks
        if (now - lastClickTime.current > 1000) {
            clickCount.current = 0;
        }
        clickCount.current += 1;
        lastClickTime.current = now;

        if (clickCount.current >= 10 && onDoomTrigger) {
            onDoomTrigger();
            clickCount.current = 0;
        }
    };

    return React.createElement(
        InteractiveObject,
        { 
            id: 'monitor', 
            onSectionSelect,
            onClick: handleClick,
            position: [0, 0.6, -1],
            onHoverChange: handleHover,
            wobble
        },
        // Screen
        React.createElement(
            'mesh',
            { position: [0, 0.8, 0] },
            React.createElement('boxGeometry', { args: [3, 1.8, 0.1] }),
            React.createElement('meshStandardMaterial', { color: '#111' })
        ),
        // Stand
        React.createElement(
            'mesh',
            { position: [0, -0.2, 0] },
            React.createElement('cylinderGeometry', { args: [0.1, 0.2, 0.4] }),
            React.createElement('meshStandardMaterial', { color: '#222' })
        ),
        // Screen Content
        React.createElement(CVScreen, null),
        // Keyboard
        React.createElement(
            'group',
            { position: [-0.20, -0.5, 0.7], rotation: [0, 0.1, 0] },
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
        ),
        // Mouse (Animated Ghost User)
        React.createElement(GhostMouse, { active: hovered || wobble })
    );
};

export default Monitor;
