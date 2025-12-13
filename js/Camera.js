import React, { useMemo } from 'react';
import { Shape } from 'three';
import InteractiveObject from 'interactive_object';

const Camera = ({ onSectionSelect }) => React.createElement(
    InteractiveObject,
    { id: 'camera', onSectionSelect, position: [-2.2, 0.5, -0.5], rotation: [0, 0.5, 0] },
    // Body
    React.createElement(
        'mesh',
        { position: [0, 0, 0] },
        React.createElement('boxGeometry', { args: [0.8, 0.5, 0.3] }),
        React.createElement('meshStandardMaterial', { color: '#222' })
    ),
    // Lens
    React.createElement(
        'mesh',
        { position: [0, 0, 0.2], rotation: [Math.PI / 2, 0, 0] },
        React.createElement('cylinderGeometry', { args: [0.2, 0.2, 0.2] }),
        React.createElement('meshStandardMaterial', { color: '#111' })
    ),
    // Lens Ring
    React.createElement(
        'mesh',
        { position: [0, 0, 0.3], rotation: [0, 0, 0] },
        React.createElement('torusGeometry', { args: [0.2, 0.02, 16, 32] }),
        React.createElement('meshStandardMaterial', { color: '#silver' })
    ),
    // Viewfinder
    (() => {
        const shape = useMemo(() => {
            const s = new Shape();
            s.moveTo(-0.15, 0);
            s.lineTo(0.15, 0);
            s.lineTo(0.1, 0.15);
            s.lineTo(-0.1, 0.15);
            s.lineTo(-0.15, 0);
            return s;
        }, []);
        const extrudeSettings = { depth: 0.3, bevelEnabled: false };
        return React.createElement(
            'mesh',
            { position: [0, 0.25, -0.15], rotation: [0, 0, 0] },
            React.createElement('extrudeGeometry', { args: [shape, extrudeSettings] }),
            React.createElement('meshStandardMaterial', { color: '#181818' })
        );
    })()
);

export default Camera;
