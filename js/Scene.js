import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment, PointerLockControls } from '@react-three/drei';
import Workbench from 'workbench';
import DoomMovement from 'DoomMovement';
import DoomEnemies from 'DoomEnemies';


const ResponsiveCamera = ({ isMobile }) => {
    const position = isMobile ? [0, 6, 12] : [0, 4, 8];
    const fov = isMobile ? 55 : 45;

    return React.createElement(PerspectiveCamera, { makeDefault: true, position: position, fov: fov });
};

const Dust = ({ count = 300 }) => {
    const points = React.useRef();

    const particles = React.useMemo(() => {
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
            // Slow rotation for drift
            points.current.rotation.y += 0.0005;
            // Very subtle vertical bobbing
            points.current.position.y = -2 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
        }
    });

    return React.createElement(
        'points',
        { ref: points, position: [0, -2, 0] },
        React.createElement('bufferGeometry', null,
            React.createElement('bufferAttribute', {
                attach: 'attributes-position',
                count: count,
                itemSize: 3,
                array: particles
            })
        ),
        React.createElement('pointsMaterial', {
            size: 0.02, // Much smaller
            color: '#ffffff',
            transparent: true,
            opacity: 0.15, // More subtle
            sizeAttenuation: true
        })
    );
};

const Scene = ({ onSectionSelect, activeSection, isNightMode, onToggleLight, doomMode, onDoomTrigger }) => {
    const bgColor = isNightMode ? '#050505' : '#171720';
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    const [muzzleFlash, setMuzzleFlash] = React.useState(false);

    // Handle Shooting
    React.useEffect(() => {
        if (!doomMode) return;

        const handleMouseDown = (e) => {
            // Only left click
            if (e.button !== 0) return;
            
            // Trigger Flash locally
            setMuzzleFlash(true);
            setTimeout(() => setMuzzleFlash(false), 50);
            
            // Notify App for HUD animation
            if (onDoomTrigger) {
                // We're abusing onDoomTrigger slightly or we need a new prop.
                // onDoomTrigger is strictly for switching modes.
                // Let's assume Scene renders DoomHUD? No, App does.
            }
        };

        window.addEventListener('mousedown', handleMouseDown);
        return () => window.removeEventListener('mousedown', handleMouseDown);
    }, [doomMode]);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return React.createElement(
        Canvas,
        {
            shadows: true,
            style: { width: '100%', height: '100%', background: bgColor },
            onPointerMissed: () => onSectionSelect(null)
        },
        // Fog for depth
        React.createElement('fog', { attach: 'fog', args: [bgColor, 10, 30] }),

        // Atmosphere
        React.createElement(Dust, { count: 400 }),

        // Camera
        React.createElement(ResponsiveCamera, { isMobile }),

        // Controls
        doomMode
            ? React.createElement(React.Fragment, null,
                React.createElement(PointerLockControls, {
                    makeDefault: true,
                    selector: "#root",
                    onUnlock: () => {
                        // When pointer lock is lost (ESC), we exit Doom Mode
                        if (onDoomTrigger && doomMode) onDoomTrigger(false); 
                    }
                }),
                React.createElement(DoomMovement, {
                    onExit: () => {
                         if (onDoomTrigger && doomMode) onDoomTrigger(false);
                         // We also need to explicitly unlock pointer lock document-wide if we use custom key
                         if (document.exitPointerLock) document.exitPointerLock();
                    }
                })
            )
            : React.createElement(OrbitControls, {
                target: [0, 0.5, 0],
                minPolarAngle: 0,
                maxPolarAngle: Math.PI / 2.2,
                enablePan: false,
                minDistance: 3,
                maxDistance: 15
            }),

        // Lights (Day/Night Logic) - Increased to compensate for no Environment
        React.createElement('ambientLight', {
            intensity: isNightMode ? 0.1 : 4,
            color: isNightMode ? '#001133' : '#ffffff'
        }),
        React.createElement('directionalLight', {
            position: [5, 10, 5],
            intensity: isNightMode ? 0.2 : 3,
            castShadow: true
        }),

        // Environment (wrapped in Suspense so scene loads even if HDR fails)
        React.createElement(Suspense, { fallback: null },
            React.createElement(Environment, { preset: 'city' })
        ),

        // Floor (Infinite plane handled by fog, but we keep mesh for raycasting/grounding)
        React.createElement(
            'mesh',
            {
                rotation: [-Math.PI / 2, 0, 0],
                position: [0, -3, 0],
                receiveShadow: true,
                onClick: (e) => {
                    e.stopPropagation();
                    if (!doomMode) onSectionSelect(null);
                }
            },
            React.createElement('planeGeometry', { args: [100, 100] }),
            React.createElement('meshStandardMaterial', { color: bgColor })
        ),

        // Soft Shadows
        React.createElement(ContactShadows, {
            position: [0, -2.99, 0],
            opacity: 0.4,
            scale: 40,
            blur: 2,
            far: 4.5
        }),

        // Interactive Workbench
        // In Doom Mode, maybe we hide the workbench or keep it? User might want to shoot it.
        // Let's keep it.
        React.createElement(Workbench, {
            position: [0, -1, 0],
            onSectionSelect: onSectionSelect,
            activeSection: activeSection,
            isNightMode: isNightMode,
            onToggleLight: onToggleLight,
            isMobile: isMobile,
            onDoomTrigger: onDoomTrigger
        }),

        // Doom Enemies
        doomMode && React.createElement(DoomEnemies, null),

        // Muzzle Flash Overlay (Simple 2D or 3D?)
        // Let's do a simple screen flash or light?
        // A point light at camera position would look cool.
        doomMode && muzzleFlash && React.createElement('pointLight', {
            position: [0, 2, 8], // Near camera roughly
            intensity: 10,
            distance: 10,
            color: '#ffff00'
        })
    );
}

export default React.memo(Scene);
