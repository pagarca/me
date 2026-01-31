import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const InteractiveObject = ({ id, onSectionSelect, children, onClick: customClick, onHoverChange, wobble, position, rotation, scale: scaleProp }) => {
    const [hovered, setHover] = useState(false);
    const hoverTimeout = useRef();
    const innerRef = useRef();

    useFrame((state, delta) => {
        if (!innerRef.current) return;

        let targetScale = 1;

        if (wobble) {
            const t = state.clock.elapsedTime;
            targetScale = 1 + (Math.sin(t * 8) + 1) * 0.025;
        }

        const currentScale = innerRef.current.scale.x;
        const smoothScale = currentScale + (targetScale - currentScale) * delta * 10;

        innerRef.current.scale.setScalar(smoothScale);
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

    const handleClick = (e) => {
        e.stopPropagation();
        if (customClick) customClick();
        else if (onSectionSelect) onSectionSelect(id);
    };

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && hovered) {
            e.preventDefault();
            handleClick(e);
        }
    };

    const groupProps = {
        position: position,
        rotation: rotation,
        scale: hovered ? 1.05 : (scaleProp || 1)
    };

    return React.createElement(
        'group',
        {
            ...groupProps,
            onPointerEnter: handlePointerEnter,
            onPointerLeave: handlePointerLeave,
            onClick: handleClick,
            onKeyDown: handleKeyDown,
            tabIndex: 0
        },
        React.createElement(
            'group',
            { ref: innerRef },
            children
        )
    );
};

export default InteractiveObject;
