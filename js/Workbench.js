import React from 'react';
import Monitor from 'monitor';
import Printer from 'printer';
import Camera from 'camera';
import CoffeeCup from 'coffee_cup';
import DeskLamp from 'desk_lamp';

export default function Workbench({ onSectionSelect, activeSection, isNightMode, onToggleLight, isMobile, ...props }) {
    const [activeObject, setActiveObject] = React.useState(null);
    const [anyHovered, setAnyHovered] = React.useState(false);
    const hoverCount = React.useRef(0);

    const handleChildHover = React.useCallback((isEntering) => {
        hoverCount.current += isEntering ? 1 : -1;
        // Clamp to 0 just in case
        if (hoverCount.current < 0) hoverCount.current = 0;
        setAnyHovered(hoverCount.current > 0);
    }, []);

    // Attract Loop for Mobile
    React.useEffect(() => {
        // Stop/Pause if:
        // 1. Not mobile
        // 2. An object is selected (activeSection is truthy)
        // 3. User is actively hovering (anyHovered is true)
        if (!isMobile || activeSection || anyHovered) {
            setActiveObject(null);
            return;
        }

        let timeoutId;
        
        const triggerHighlight = () => {
            const items = ['monitor', 'printer', 'camera', 'coffee', 'lamp'];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            setActiveObject(randomItem);

            // Turn off after 2s
            setTimeout(() => {
                // Check safety again before clearing? (Loop restarts anyway)
                setActiveObject(null);
                
                // Wait randomly between 2s and 4s before next trigger
                timeoutId = setTimeout(triggerHighlight, 2000 + Math.random() * 2000);
            }, 2000);
        };

        // Start loop
        timeoutId = setTimeout(triggerHighlight, 2000);

        return () => clearTimeout(timeoutId);
    }, [isMobile, activeSection, anyHovered]);

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
        React.createElement(Monitor, { onSectionSelect, wobble: activeObject === 'monitor', onHover: handleChildHover }),
        React.createElement(Printer, { onSectionSelect, wobble: activeObject === 'printer', onHover: handleChildHover }),
        React.createElement(Camera, { onSectionSelect, wobble: activeObject === 'camera', onHover: handleChildHover }),
        React.createElement(CoffeeCup, { onSectionSelect, wobble: activeObject === 'coffee', onHover: handleChildHover }),
        React.createElement(DeskLamp, { isNightMode, onToggleLight, wobble: activeObject === 'lamp', onHover: handleChildHover })
    );
}
