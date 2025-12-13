import React, { useMemo } from 'react';
import * as THREE from 'three';
import InteractiveObject from 'interactive_object';

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

export default DeskLamp;
