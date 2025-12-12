import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import Workbench from './Workbench.js';

export default function Scene({ onSectionSelect, isNightMode, onToggleLight }) {
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

        // Lights (Day/Night Logic)
        React.createElement('ambientLight', { 
            intensity: isNightMode ? 0.05 : 0.5, 
            color: isNightMode ? '#001133' : '#ffffff' 
        }),
        React.createElement('directionalLight', { 
            position: [5, 10, 5], 
            intensity: isNightMode ? 0.1 : 1, 
            castShadow: true 
        }),
        
        // Environment (City lights remain, but scene gets dark)
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
            onSectionSelect: onSectionSelect,
            isNightMode: isNightMode,
            onToggleLight: onToggleLight
        })
    );
}
