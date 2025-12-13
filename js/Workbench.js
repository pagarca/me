import React from 'react';
import Monitor from 'monitor';
import Printer from 'printer';
import Camera from 'camera';
import CoffeeCup from 'coffee_cup';
import DeskLamp from 'desk_lamp';

export default function Workbench({ onSectionSelect, isNightMode, onToggleLight, ...props }) {
    return React.createElement(
        'group',
        { ...props },
        // Desk Surface
        React.createElement(
            'mesh',
            { position: [0, 0, 0], castShadow: true, receiveShadow: true },
            React.createElement('boxGeometry', { args: [6, 0.2, 3] }),
            React.createElement('meshStandardMaterial', { color: '#8B4513' })
        ),
        // Desk Legs
        [-2.5, 2.5].map((x) =>
            [-1.2, 1.2].map((z) =>
                React.createElement(
                    'mesh',
                    { position: [x, -1.5, z], key: `leg-${x}-${z}` },
                    React.createElement('cylinderGeometry', { args: [0.1, 0.1, 3] }),
                    React.createElement('meshStandardMaterial', { color: '#333' })
                )
            )
        ),
        // Sub-Components
        React.createElement(Monitor, { onSectionSelect }),
        React.createElement(Printer, { onSectionSelect }),
        React.createElement(Camera, { onSectionSelect }),
        React.createElement(CoffeeCup, { onSectionSelect }),
        React.createElement(DeskLamp, { isNightMode, onToggleLight })
    );
}
