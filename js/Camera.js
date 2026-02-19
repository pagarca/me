import React, { useMemo } from 'react';
import { Shape } from 'three';
import InteractiveObject from 'interactive_object';

const createViewfinderShape = () => {
    const s = new Shape();
    s.moveTo(-0.15, 0);
    s.lineTo(0.15, 0);
    s.lineTo(0.1, 0.15);
    s.lineTo(-0.1, 0.15);
    s.lineTo(-0.15, 0);
    return s;
};

const viewfinderShape = createViewfinderShape();
const extrudeSettings = { depth: 0.3, bevelEnabled: false };

const Camera = ({ onSectionSelect, wobble, onHover }) => {
    const bodyGeometry = useMemo(() => React.createElement('boxGeometry', { args: [0.8, 0.5, 0.3] }), []);
    const bodyMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#222' }), []);

    const lensGeometry = useMemo(() => React.createElement('cylinderGeometry', { args: [0.2, 0.2, 0.2] }), []);
    const lensMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#111' }), []);

    const ringGeometry = useMemo(() => React.createElement('torusGeometry', { args: [0.2, 0.02, 16, 32] }), []);
    const ringMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#C0C0C0' }), []);

    const viewfinderGeometry = useMemo(() => React.createElement('extrudeGeometry', { args: [viewfinderShape, extrudeSettings] }), []);
    const viewfinderMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#181818' }), []);

    return React.createElement(
        InteractiveObject,
        { id: 'camera', onSectionSelect, position: [-2.2, 0.5, -0.5], rotation: [0, 0.5, 0], wobble, onHoverChange: onHover },
        React.createElement(
            'mesh',
            { position: [0, 0, 0] },
            bodyGeometry,
            bodyMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0, 0, 0.2], rotation: [Math.PI / 2, 0, 0] },
            lensGeometry,
            lensMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0, 0, 0.3], rotation: [0, 0, 0] },
            ringGeometry,
            ringMaterial
        ),
        React.createElement(
            'mesh',
            { position: [0, 0.25, -0.15], rotation: [0, 0, 0] },
            viewfinderGeometry,
            viewfinderMaterial
        )
    );
};

export default Camera;
