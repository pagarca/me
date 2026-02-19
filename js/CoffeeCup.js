import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import InteractiveObject from 'interactive_object';

const Steam = () => {
    const steamRef = useRef();

    const sphereGeometry = useMemo(() => React.createElement('sphereGeometry', { args: [0.1, 8, 8] }), []);
    const steamMaterial = useMemo(() => React.createElement('meshStandardMaterial', {
        color: '#ffffff',
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    }), []);

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
            const time = state.clock.elapsedTime * data.speed + data.offset;
            const y = (time % 1.5) * 0.4;
            const opacity = 1 - (y / 0.6);

            child.position.y = y;
            child.position.x = data.x + Math.sin(time * 2) * 0.05;
            child.position.z = data.z + Math.cos(time * 1.5) * 0.05;
            child.scale.setScalar(0.1 + y * 0.2);
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
                sphereGeometry,
                steamMaterial
            )
        )
    );
};

const CoffeeCup = ({ onSectionSelect, wobble, onHover }) => {
    const [hovered, setHovered] = useState(false);

    const cupGeometry = useMemo(() => React.createElement('cylinderGeometry', { args: [0.15, 0.12, 0.3, 32, 1, true] }), []);
    const cupMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#ffffff', side: 2 }), []);

    const bottomGeometry = useMemo(() => React.createElement('circleGeometry', { args: [0.12, 32] }), []);
    const bottomMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#ffffff' }), []);

    const liquidGeometry = useMemo(() => React.createElement('circleGeometry', { args: [0.13, 32] }), []);
    const liquidMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#3e2723' }), []);

    const handleGeometry = useMemo(() => React.createElement('torusGeometry', { args: [0.08, 0.02, 8, 16] }), []);

    const handleHover = (val) => {
        setHovered(val);
        if (onHover) onHover(val);
    };

    return React.createElement(
        InteractiveObject,
        {
            id: 'coffee',
            onSectionSelect,
            position: [-1.2, 0.1, 0.8],
            onHoverChange: handleHover,
            wobble
        },
        React.createElement(
            'mesh',
            { position: [0, 0.15, 0] },
            cupGeometry,
            cupMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0, 0.01, 0], rotation: [-Math.PI / 2, 0, 0] },
            bottomGeometry,
            bottomMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0, 0.25, 0], rotation: [-Math.PI / 2, 0, 0] },
            liquidGeometry,
            liquidMaterial
        ),
        React.createElement(
            'mesh',
            { position: [-0.15, 0.15, 0], rotation: [0, 0, 0] },
            handleGeometry,
            cupMaterial
        ),
        (hovered || wobble) && React.createElement(Steam, null)
    );
};

export default CoffeeCup;
