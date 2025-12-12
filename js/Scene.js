import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import Workbench from './Workbench.js';

export default function Scene({ onSectionSelect }) {
    return React.createElement(
        Canvas,
        {
            shadows: true,
            style: { width: '100%', height: '100%' }
        },
        // Camera
        React.createElement(PerspectiveCamera, { makeDefault: true, position: [0, 4, 8], fov: 45 }),
        
        // Controls
        React.createElement(OrbitControls, { target: [0, 0.5, 0], minPolarAngle: 0, maxPolarAngle: Math.PI / 2.2, enablePan: false }),

        // Lights
        React.createElement('ambientLight', { intensity: 0.5 }),
        React.createElement('directionalLight', { 
            position: [5, 10, 5], 
            intensity: 1, 
            castShadow: true 
        }),
        
        // Environment
        React.createElement(Environment, { preset: 'city' }),

        // Floor
        React.createElement(
            'mesh',
            { rotation: [-Math.PI / 2, 0, 0], position: [0, -3, 0], receiveShadow: true },
            React.createElement('planeGeometry', { args: [50, 50] }),
            React.createElement('meshStandardMaterial', { color: '#111' })
        ),

        // Interactive Workbench
        React.createElement(Workbench, { 
            position: [0, -1, 0],
            onSectionSelect: onSectionSelect
        })
    );
}
