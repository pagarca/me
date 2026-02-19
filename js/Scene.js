import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import Workbench from 'workbench';


const ResponsiveCamera = ({ isMobile }) => {
    const position = isMobile ? [0, 6, 12] : [0, 4, 8];
    const fov = isMobile ? 55 : 45;

    return React.createElement(PerspectiveCamera, { makeDefault: true, position: position, fov: fov });
};

const Dust = ({ count = 300 }) => {
    const points = React.useRef();

    const particleGeometry = useMemo(() => React.createElement('bufferGeometry', null), []);
    const particleMaterial = useMemo(() => React.createElement('pointsMaterial', {
        size: 0.02,
        color: '#ffffff',
        transparent: true,
        opacity: 0.15,
        sizeAttenuation: true
    }), []);

    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 15;
            const y = Math.random() * 8;
            const z = (Math.random() - 0.5) * 15;
            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (points.current) {
            points.current.rotation.y += 0.0005;
            points.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return React.createElement(
        'points',
        { ref: points, position: [0, -2, 0] },
        particleGeometry,
        React.createElement('bufferAttribute', {
            attach: 'attributes-position',
            count: count,
            itemSize: 3,
            array: particles
        }),
        particleMaterial
    );
};

const Scene = ({ onSectionSelect, activeSection, isNightMode, onToggleLight }) => {
    const bgColor = isNightMode ? '#050505' : '#171720';
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showPerf, setShowPerf] = useState(false);

    const dpr = isMobile ? [1, 1.5] : [1, 2];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setShowPerf(urlParams.has('debug'));
    }, []);

    const floorGeometry = useMemo(() => React.createElement('planeGeometry', { args: [100, 100] }), []);
    const floorMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: bgColor }), [bgColor]);

    return React.createElement(
        Canvas,
        {
            shadows: true,
            dpr: dpr,
            style: { width: '100%', height: '100%', background: bgColor },
            onPointerMissed: () => onSectionSelect(null)
        },
        React.createElement('fog', { attach: 'fog', args: [bgColor, 10, 30] }),
        React.createElement(Dust, { count: 400 }),
        React.createElement(ResponsiveCamera, { isMobile }),
        showPerf && React.createElement(
            'group',
            { position: [-3.5, 3, 0] },
            React.createElement('mesh', {
                geometry: React.createElement('planeGeometry', { args: [0.5, 0.3] }),
                material: React.createElement('meshBasicMaterial', {
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.7
                })
            }),
            React.createElement('text', {
                position: [0, 0, 0.01],
                fontSize: 0.08,
                color: '#4cd137',
                anchorX: 'center',
                anchorY: 'middle'
            }, 'Debug Mode')
        ),
        React.createElement(OrbitControls, {
            target: [0, 0.5, 0],
            minPolarAngle: 0,
            maxPolarAngle: Math.PI / 2.2,
            enablePan: false,
            minDistance: 3,
            maxDistance: 15
        }),
        React.createElement('ambientLight', {
            intensity: isNightMode ? 0.1 : 4,
            color: isNightMode ? '#001133' : '#ffffff'
        }),
        React.createElement('directionalLight', {
            position: [5, 10, 5],
            intensity: isNightMode ? 0.2 : 3,
            castShadow: true,
            shadowMapSize: isMobile ? [1024, 1024] : [2048, 2048]
        }),
        React.createElement(Suspense, { fallback: null },
            React.createElement(Environment, { preset: 'sunset' })
        ),
        React.createElement(
            'mesh',
            {
                rotation: [-Math.PI / 2, 0, 0],
                position: [0, -3, 0],
                receiveShadow: true,
                onClick: (e) => {
                    e.stopPropagation();
                    onSectionSelect(null);
                }
            },
            floorGeometry,
            floorMaterial
        ),
        React.createElement(ContactShadows, {
            position: [0, -2.99, 0],
            opacity: 0.4,
            scale: 40,
            blur: 2,
            far: 4.5
        }),
        React.createElement(Workbench, {
            position: [0, -1, 0],
            onSectionSelect: onSectionSelect,
            activeSection: activeSection,
            isNightMode: isNightMode,
            onToggleLight: onToggleLight,
            isMobile: isMobile
        })
    );
};

export default React.memo(Scene);
