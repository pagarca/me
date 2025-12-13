import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const InteractiveObject = ({ id, onSectionSelect, children, onClick: customClick, onHoverChange, wobble, ...meshProps }) => {
    const [hovered, setHover] = useState(false);
    const hoverTimeout = useRef();
    const innerRef = useRef();

    // Wiggle animation (Scale Pulse)
    useFrame((state, delta) => {
        if (!innerRef.current) return;
        
        // Calculate target scale
        let targetScale = 1;

        if (wobble) {
            const t = state.clock.elapsedTime;
            // Target oscillates between 1 and 1.05
            targetScale = 1 + (Math.sin(t * 8) + 1) * 0.025;
        }

        // Smoothly interpolate current scale towards target scale
        // Using a high lerp factor (e.g., 10 * delta) covers the gap quickly but smoothly
        const currentScale = innerRef.current.scale.x; // Assuming uniform scale
        const smoothScale = currentScale + (targetScale - currentScale) * delta * 10;

        innerRef.current.scale.setScalar(smoothScale);
        
        // Ensure rotation is reset (if we had any previously)
        innerRef.current.rotation.set(0, 0, 0);
    });

    const handlePointerEnter = (e) => {
        e.stopPropagation();
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setHover(true);
        if (onHoverChange) onHoverChange(true);
        document.body.style.cursor = 'pointer';
    };

    const handlePointerLeave = (e) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        hoverTimeout.current = setTimeout(() => {
            setHover(false);
            if (onHoverChange) onHoverChange(false);
            document.body.style.cursor = 'auto';
        }, 60);
    };

    return React.createElement(
        'group',
        {
            ...meshProps,
            onPointerEnter: handlePointerEnter,
            onPointerLeave: handlePointerLeave,
            onClick: (e) => {
                e.stopPropagation();
                if (customClick) customClick();
                else if (onSectionSelect) onSectionSelect(id);
            },
            scale: hovered ? 1.05 : 1,
        },
        // Inner group for wobble to avoid conflict with parent rotation in meshProps
        React.createElement(
            'group',
            { ref: innerRef },
            children
        )
    );
};

export default InteractiveObject;
