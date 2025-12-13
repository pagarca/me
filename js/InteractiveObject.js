import React, { useState, useRef } from 'react';

const InteractiveObject = ({ id, onSectionSelect, children, onClick: customClick, onHoverChange, ...meshProps }) => {
    const [hovered, setHover] = useState(false);
    const hoverTimeout = useRef();

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
        children
    );
};

export default InteractiveObject;
