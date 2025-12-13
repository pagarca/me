import React, { useState, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Shape } from 'three';
import * as THREE from 'three';

// Helper to make an object interactive
const InteractiveObject = ({ id, onSectionSelect, children, onClick: customClick, onHoverChange, ...meshProps }) => {
    const [hovered, setHover] = useState(false);
    const hoverTimeout = useRef();

    const handlePointerEnter = (e) => {
        e.stopPropagation();
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHover(true);
        if (onHoverChange) onHoverChange(true);
        document.body.style.cursor = 'pointer';
    };

    const handlePointerLeave = (e) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => {
            setHover(false);
            if (onHoverChange) onHoverChange(false);
            document.body.style.cursor = 'auto';
        }, 60);
    };

    return React.createElement(
        'group',
        {
            ...meshProps,
            onPointerEnter: handlePointerEnter,
            onPointerLeave: handlePointerLeave,
            onClick: (e) => {
                e.stopPropagation();
                if (customClick) customClick();
                else if (onSectionSelect) onSectionSelect(id);
            },
            scale: hovered ? 1.05 : 1,
        },
        children
    );
};

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
            intensity: 2,
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
                position: [0, 0.08, 0], 
                rotation: [0, -0.2, 0], 
                castShadow: true 
            },
            React.createElement('boxGeometry', { args: [0.15, 0.08, 0.25] }),
            React.createElement('meshStandardMaterial', { color: '#2d3436' })
        )
    );
};

const Monitor = ({ onSectionSelect }) => {
    const [hovered, setHovered] = useState(false);

    return React.createElement(
        InteractiveObject,
        { 
            id: 'monitor', 
            onSectionSelect, 
            position: [0, 0.6, -1],
            onHoverChange: setHovered
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
        React.createElement(GhostMouse, { active: hovered })
    );
};

const Printer = ({ onSectionSelect }) => {
    const printHeadRef = useRef();
    const [printerHovered, setPrinterHovered] = useState(false);

    const progress = useRef(0);

    useFrame((state, delta) => {
        if (printerHovered && printHeadRef.current) {
            progress.current += delta * 8;
            printHeadRef.current.position.x = Math.sin(progress.current) * 0.25;
        }
    });

    return React.createElement(
        InteractiveObject,
        {
            id: 'printer',
            onSectionSelect,
            position: [2.1, 0.2, 0.8],
            rotation: [0, -0.5, 0],
            onHoverChange: setPrinterHovered
        },
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
        // Print Head (Animated)
        React.createElement(
            'group',
            { ref: printHeadRef, position: [0, 0.8, 0] },
            // Extruder Block
            React.createElement(
                'mesh',
                { position: [0, 0.12, 0] },
                React.createElement('boxGeometry', { args: [0.15, 0.2, 0.15] }),
                React.createElement('meshStandardMaterial', { color: '#555' })
            ),
            // Nozzle
            React.createElement(
                'mesh',
                { position: [0, -0.03, 0] },
                React.createElement('cylinderGeometry', { args: [0.01, 0.005, 0.02] }),
                React.createElement('meshStandardMaterial', { color: '#ffff00ff' })
            )
        ),
        // Printed Object (Little Pyramid/Cone)
        React.createElement(
            'mesh',
            { position: [0, 0.3, 0] },
            React.createElement('coneGeometry', { args: [0.2, 0.4, 4] }),
            React.createElement('meshStandardMaterial', { color: '#00ffff' })
        )
    );
};

const Camera = ({ onSectionSelect }) => React.createElement(
    InteractiveObject,
    { id: 'camera', onSectionSelect, position: [-2.2, 0.5, -0.5], rotation: [0, 0.5, 0] },
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
    // Lens Ring
    React.createElement(
        'mesh',
        { position: [0, 0, 0.3], rotation: [0, 0, 0] },
        React.createElement('torusGeometry', { args: [0.2, 0.02, 16, 32] }),
        React.createElement('meshStandardMaterial', { color: '#silver' })
    ),
    // Viewfinder
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
);

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

const LampHalo = ({ isNightMode }) => {
    // Generate Halo Texture
    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 170, 0, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 170, 0, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(canvas);
        return tex;
    }, []);

    if (!isNightMode) return null;

    return React.createElement(
        'sprite',
        { position: [0, 1.3, -0.3], scale: [0.35, 0.35, 0.35] },
        React.createElement('spriteMaterial', {
            map: texture,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    );
};

const DeskLamp = ({ isNightMode, onToggleLight }) => React.createElement(
    InteractiveObject,
    {
        id: 'lamp',
        position: [2.5, 0.1, -1.0],
        rotation: [0, 2.2, 0],
        onClick: onToggleLight
    },
    React.createElement(
        'group',
        { scale: [1.3, 1.3, 1.3] },
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
            { position: [0, 0.4, 0.15], rotation: [0.4, 0, 0] },
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
        // Upper Arm
        React.createElement(
            'mesh',
            { position: [0, 1.0, 0.05], rotation: [-0.8, 0, 0] },
            React.createElement('cylinderGeometry', { args: [0.05, 0.05, 0.8] }),
            React.createElement('meshStandardMaterial', { color: '#444' })
        ),
        // Head
        React.createElement(
            'mesh',
            { position: [0, 1.3, -0.3], rotation: [1, 0, 0] },
            React.createElement('coneGeometry', { args: [0.25, 0.5, 32, 1, true] }),
            React.createElement('meshStandardMaterial', { color: '#333', side: 2 })
        ),
        // Bulb
        React.createElement(
            'mesh',
            { position: [0, 1.3, -0.3], rotation: [1, 0, 0] },
            React.createElement('sphereGeometry', { args: [0.1] }),
            React.createElement('meshStandardMaterial', {
                color: isNightMode ? '#ffaa00' : '#bbbbbb',
                emissive: isNightMode ? '#ffaa00' : '#000000',
                emissiveIntensity: isNightMode ? 2 : 0,
                roughness: 0.1,
                metalness: 0.1
            })
        ),
        // Halo Sprite
        React.createElement(LampHalo, { isNightMode }),
        // Light source
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
);



export default function Workbench({ onSectionSelect, isNightMode, onToggleLight, ...props }) {
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
        // Sub-Components
        React.createElement(Monitor, { onSectionSelect }),
        React.createElement(Printer, { onSectionSelect }),
        React.createElement(Camera, { onSectionSelect }),
        React.createElement(CoffeeCup, { onSectionSelect }),
        React.createElement(DeskLamp, { isNightMode, onToggleLight }),
        // Cables removed per user request
    );
}

