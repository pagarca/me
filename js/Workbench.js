import React, { useMemo } from 'react';
import Monitor from 'monitor';
import Printer from 'printer';
import Camera from 'camera';
import CoffeeCup from 'coffee_cup';
import DeskLamp from 'desk_lamp';

const Workbench = ({ onSectionSelect, activeSection, isNightMode, onToggleLight, isMobile, ...props }) => {
    const [activeObject, setActiveObject] = React.useState(null);
    const [anyHovered, setAnyHovered] = React.useState(false);
    const hoverCount = React.useRef(0);

    const handleChildHover = React.useCallback((isEntering) => {
        hoverCount.current += isEntering ? 1 : -1;
        if (hoverCount.current < 0) hoverCount.current = 0;
        setAnyHovered(hoverCount.current > 0);
    }, []);

    React.useEffect(() => {
        if (!isMobile || activeSection || anyHovered) {
            setActiveObject(null);
            return;
        }

        let timeoutId;

        const triggerHighlight = () => {
            const items = ['monitor', 'printer', 'camera', 'coffee', 'lamp'];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            setActiveObject(randomItem);

            setTimeout(() => {
                setActiveObject(null);
                timeoutId = setTimeout(triggerHighlight, 2000 + Math.random() * 2000);
            }, 2000);
        };

        timeoutId = setTimeout(triggerHighlight, 2000);

        return () => clearTimeout(timeoutId);
    }, [isMobile, activeSection, anyHovered]);

    const deskGeometry = useMemo(() => React.createElement('boxGeometry', { args: [6, 0.2, 3] }), []);
    const deskMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#8B4513' }), []);

    const legGeometry = useMemo(() => React.createElement('cylinderGeometry', { args: [0.1, 0.1, 3] }), []);
    const legMaterial = useMemo(() => React.createElement('meshStandardMaterial', { color: '#333' }), []);

    return React.createElement(
        'group',
        { ...props },
        React.createElement(
            'mesh',
            { position: [0, 0, 0], castShadow: true, receiveShadow: true },
            deskGeometry,
            deskMaterial
        ),
        [-2.5, 2.5].map((x) =>
            [-1.2, 1.2].map((z) =>
                React.createElement(
                    'mesh',
                    { position: [x, -1.5, z], key: `leg-${x}-${z}` },
                    legGeometry,
                    legMaterial
                )
            )
        ),
        React.createElement(Monitor, { onSectionSelect, wobble: activeObject === 'monitor', onHover: handleChildHover }),
        React.createElement(Printer, { onSectionSelect, wobble: activeObject === 'printer', onHover: handleChildHover }),
        React.createElement(Camera, { onSectionSelect, wobble: activeObject === 'camera', onHover: handleChildHover }),
        React.createElement(CoffeeCup, { onSectionSelect, wobble: activeObject === 'coffee', onHover: handleChildHover }),
        React.createElement(DeskLamp, { isNightMode, onToggleLight, wobble: activeObject === 'lamp', onHover: handleChildHover })
    );
};

export default Workbench;
