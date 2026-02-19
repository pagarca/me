import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import InteractiveObject from 'interactive_object';

const Printer = ({ onSectionSelect, wobble, onHover }) => {
    const printHeadRef = useRef();
    const [printerHovered, setPrinterHovered] = useState(false);

    const handleHover = (val) => {
        setPrinterHovered(val);
        if (onHover) onHover(val);
    };

    const progress = useRef(0);
    const active = printerHovered || wobble;

    const bedGeometry = useMemo(() => React.createElement('boxGeometry', { args: [1, 0.1, 1] }), []);
    const bedMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#222' }), []);

    const pillarGeometry = useMemo(() => React.createElement('boxGeometry', { args: [0.1, 1, 0.1] }), []);
    const pillarMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#333' }), []);

    const topBarGeometry = useMemo(() => React.createElement('boxGeometry', { args: [1, 0.1, 0.1] }), []);

    const extruderGeometry = useMemo(() => React.createElement('boxGeometry', { args: [0.15, 0.2, 0.15] }), []);
    const extruderMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#555' }), []);

    const nozzleGeometry = useMemo(() => React.createElement('cylinderGeometry', { args: [0.01, 0.005, 0.02] }), []);
    const nozzleMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#ffff00' }), []);

    const pyramidGeometry = useMemo(() => React.createElement('coneGeometry', { args: [0.2, 0.4, 4] }), []);
    const pyramidMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#00ffff' }), []);

    useFrame((state, delta) => {
        if (active && printHeadRef.current) {
            progress.current += delta * 5;
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
            onHoverChange: handleHover,
            wobble
        },
        React.createElement(
            'mesh',
            { position: [0, 0.1, 0] },
            bedGeometry,
            bedMaterial
        ),
        React.createElement(
            'mesh',
            { position: [-0.4, 0.6, 0] },
            pillarGeometry,
            pillarMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0.4, 0.6, 0] },
            pillarGeometry,
            pillarMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0, 1.1, 0] },
            topBarGeometry,
            pillarMaterial
        ),
        React.createElement(
            'group',
            { ref: printHeadRef, position: [0, 0.8, 0] },
            React.createElement(
                'mesh',
                { position: [0, 0.12, 0] },
                extruderGeometry,
                extruderMaterial
            ),
            React.createElement(
                'mesh',
                { position: [0, -0.03, 0] },
                nozzleGeometry,
                nozzleMaterial
            )
        ),
        React.createElement(
            'mesh',
            { position: [0, 0.3, 0] },
            pyramidGeometry,
            pyramidMaterial
        )
    );
};

export default Printer;
