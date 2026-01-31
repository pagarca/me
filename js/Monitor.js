import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import InteractiveObject from 'interactive_object';

const CVScreen = () => {
    const greenColor = '#00ff00';
    const glow = 1.2;

    const screenGeometry = useMemo(() => React.createElement('planeGeometry', { args: [2.8, 1.6] }), []);
    const screenMaterial = useMemo(() => React.createElement('meshStandardMaterial', {
        color: '#001a00',
        emissive: '#002200',
        emissiveIntensity: 0.2
    }), []);

    const greenMaterial = useMemo(() => React.createElement('meshStandardMaterial', {
        color: greenColor,
        emissive: greenColor,
        emissiveIntensity: glow
    }), []);

    const photoGeometry = useMemo(() => React.createElement('planeGeometry', { args: [0.6, 0.6] }), []);
    const lineGeometry = useMemo(() => React.createElement('planeGeometry', { args: [0.6, 0.05] }), []);
    const blockGeometry = useMemo(() => React.createElement('planeGeometry', { args: [1.4, 0.1] }), []);
    const smallLineGeometry = useMemo(() => React.createElement('planeGeometry', { args: [0.65, 0.03] }), []);

    return React.createElement(
        'group',
        { position: [0, 0.8, 0.07] },

        React.createElement('pointLight', {
            position: [0, 0, 1],
            distance: 3,
            decay: 2,
            intensity: 10,
            color: greenColor
        }),

        React.createElement(
            'mesh',
            { position: [0, 0, -0.01] },
            screenGeometry,
            screenMaterial
        ),

        React.createElement(
            'group',
            { position: [-0.8, 0, 0] },
            React.createElement(
                'mesh',
                { position: [0, 0.3, 0.01] },
                photoGeometry,
                greenMaterial
            ),
            Array.from({ length: 3 }).map((_, i) =>
                React.createElement(
                    'mesh',
                    { key: `l-left-${i}`, position: [0, -0.2 - (i * 0.15), 0.01] },
                    lineGeometry,
                    greenMaterial
                )
            )
        ),

        React.createElement(
            'group',
            { position: [0.4, 0, 0] },
            React.createElement(
                'mesh',
                { position: [0, 0.55, 0.01] },
                blockGeometry,
                greenMaterial
            ),
            Array.from({ length: 6 }).map((_, i) =>
                React.createElement(
                    'group',
                    { key: `l-right-${i}`, position: [0, 0.3 - (i * 0.15), 0] },
                    React.createElement(
                        'mesh',
                        { position: [-0.36, 0, 0.01] },
                        smallLineGeometry,
                        greenMaterial
                    ),
                    React.createElement(
                        'mesh',
                        { position: [0.36, 0, 0.01] },
                        smallLineGeometry,
                        greenMaterial
                    )
                )
            )
        )
    );
};

const GhostMouse = ({ active }) => {
    const mouseBodyRef = useRef();

    const mousepadGeometry = useMemo(() => React.createElement('boxGeometry', { args: [0.7, 0.05, 0.75] }), []);
    const mousepadMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#222' }), []);

    const mouseGeometry = useMemo(() => React.createElement('boxGeometry', { args: [0.15, 0.08, 0.25] }), []);
    const mouseMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#2d3436' }), []);

    useFrame((state) => {
        if (!mouseBodyRef.current) return;

        let targetX = 0;
        let targetZ = 0;

        if (active) {
            const time = state.clock.elapsedTime;
            targetX = Math.sin(time * 2) * 0.15 + Math.cos(time * 1.3) * 0.1;
            targetZ = Math.cos(time * 1.5) * 0.1 + Math.sin(time * 2.5) * 0.05;
        }

        mouseBodyRef.current.position.x += (targetX - mouseBodyRef.current.position.x) * 0.1;
        mouseBodyRef.current.position.z += (targetZ - mouseBodyRef.current.position.z) * 0.1;
    });

    return React.createElement(
        'group',
        { position: [1.1, -0.5, 0.8] },
        React.createElement(
            'mesh',
            { position: [0, 0, 0], rotation: [0, -0.3, 0], receiveShadow: true },
            mousepadGeometry,
            mousepadMaterial
        ),
        React.createElement(
            'mesh',
            {
                ref: mouseBodyRef,
                position: [0, 0.05, 0],
                rotation: [0, -0.2, 0],
                castShadow: true
            },
            mouseGeometry,
            mouseMaterial
        )
    );
};

const Monitor = ({ onSectionSelect, wobble, onHover }) => {
    const [hovered, setHovered] = useState(false);

    const screenGeometry = useMemo(() => React.createElement('boxGeometry', { args: [3, 1.8, 0.1] }), []);
    const screenMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#111' }), []);

    const standGeometry = useMemo(() => React.createElement('cylinderGeometry', { args: [0.1, 0.2, 0.4] }), []);
    const standMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#222' }), []);

    const chassisGeometry = useMemo(() => React.createElement('boxGeometry', { args: [1.4, 0.05, 0.5] }), []);
    const chassisMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#2d3436' }), []);

    const keysGeometry = useMemo(() => React.createElement('boxGeometry', { args: [1.3, 0.02, 0.4] }), []);
    const keysMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#000000' }), []);

    const handleHover = (val) => {
        setHovered(val);
        if (onHover) onHover(val);
    };

    return React.createElement(
        InteractiveObject,
        {
            id: 'monitor',
            onSectionSelect,
            position: [0, 0.6, -1],
            onHoverChange: handleHover,
            wobble
        },
        React.createElement(
            'mesh',
            { position: [0, 0.8, 0] },
            screenGeometry,
            screenMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0, -0.2, 0] },
            standGeometry,
            standMaterial
        ),
        React.createElement(CVScreen, null),
        React.createElement(
            'group',
            { position: [-0.20, -0.5, 0.7], rotation: [0, 0.1, 0] },
            React.createElement(
                'mesh',
                { position: [0, 0.02, 0] },
                chassisGeometry,
                chassisMaterial
            ),
            React.createElement(
                'mesh',
                { position: [0, 0.06, 0] },
                keysGeometry,
                keysMaterial
            )
        ),
        React.createElement(GhostMouse, { active: hovered || wobble })
    );
};

export default Monitor;
