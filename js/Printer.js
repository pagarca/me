import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import InteractiveObject from 'interactive_object';

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
            position: [2.1, 0.1, 0.75],
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
                React.createElement('meshStandardMaterial', { color: '#ffff00' })
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

export default Printer;
