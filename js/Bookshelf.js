import React, { useState } from 'react';
import InteractiveObject from 'interactive_object';

// Individual book component with unique color
const Book = ({ position, color, height = 0.6, width = 0.08, depth = 0.35 }) => {
    return React.createElement(
        'mesh',
        { position, castShadow: true },
        React.createElement('boxGeometry', { args: [width, height, depth] }),
        React.createElement('meshStandardMaterial', { 
            color,
            roughness: 0.7,
            metalness: 0.1
        })
    );
};

// Book spine decoration (gold text simulation)
const BookSpine = ({ position, height = 0.4 }) => {
    return React.createElement(
        'mesh',
        { position },
        React.createElement('boxGeometry', { args: [0.01, height * 0.3, 0.02] }),
        React.createElement('meshStandardMaterial', { 
            color: '#d4af37',
            emissive: '#d4af37',
            emissiveIntensity: 0.3,
            metalness: 0.8
        })
    );
};

const Bookshelf = ({ onSectionSelect, wobble, onHover }) => {
    const [hovered, setHovered] = useState(false);
    
    const handleHover = (val) => {
        setHovered(val);
        if (onHover) onHover(val);
    };

    // Book colors - academic/professional feel
    const bookColors = [
        '#1a365d', // Navy blue
        '#742a2a', // Burgundy
        '#234e52', // Dark teal
        '#553c9a', // Purple
        '#744210', // Brown
    ];

    return React.createElement(
        InteractiveObject,
        { 
            id: 'bookshelf', 
            onSectionSelect, 
            position: [-2.2, 0.1, 0.5],
            onHoverChange: handleHover,
            wobble
        },
        // Bookshelf frame - Back panel
        React.createElement(
            'mesh',
            { position: [0, 0.35, -0.2], castShadow: true },
            React.createElement('boxGeometry', { args: [0.6, 0.8, 0.05] }),
            React.createElement('meshStandardMaterial', { color: '#5D4037' })
        ),
        // Bookshelf frame - Bottom shelf
        React.createElement(
            'mesh',
            { position: [0, 0, 0], receiveShadow: true },
            React.createElement('boxGeometry', { args: [0.6, 0.05, 0.4] }),
            React.createElement('meshStandardMaterial', { color: '#5D4037' })
        ),
        // Bookshelf frame - Top shelf
        React.createElement(
            'mesh',
            { position: [0, 0.7, 0], castShadow: true },
            React.createElement('boxGeometry', { args: [0.6, 0.05, 0.4] }),
            React.createElement('meshStandardMaterial', { color: '#5D4037' })
        ),
        // Left side panel
        React.createElement(
            'mesh',
            { position: [-0.275, 0.35, 0], castShadow: true },
            React.createElement('boxGeometry', { args: [0.05, 0.7, 0.4] }),
            React.createElement('meshStandardMaterial', { color: '#5D4037' })
        ),
        // Right side panel
        React.createElement(
            'mesh',
            { position: [0.275, 0.35, 0], castShadow: true },
            React.createElement('boxGeometry', { args: [0.05, 0.7, 0.4] }),
            React.createElement('meshStandardMaterial', { color: '#5D4037' })
        ),
        
        // Books - arranged on the shelf
        React.createElement(Book, { 
            position: [-0.15, 0.35, 0.02], 
            color: bookColors[0], 
            height: 0.55 
        }),
        React.createElement(BookSpine, { position: [-0.14, 0.35, 0.02], height: 0.55 }),
        
        React.createElement(Book, { 
            position: [-0.05, 0.32, 0.02], 
            color: bookColors[1], 
            height: 0.5,
            width: 0.1 
        }),
        React.createElement(BookSpine, { position: [-0.04, 0.32, 0.02], height: 0.5 }),
        
        React.createElement(Book, { 
            position: [0.05, 0.37, 0.02], 
            color: bookColors[2], 
            height: 0.6,
            width: 0.07 
        }),
        
        React.createElement(Book, { 
            position: [0.13, 0.34, 0.02], 
            color: bookColors[3], 
            height: 0.54,
            width: 0.09 
        }),
        React.createElement(BookSpine, { position: [0.14, 0.34, 0.02], height: 0.54 }),
        
        React.createElement(Book, { 
            position: [0.21, 0.33, 0.02], 
            color: bookColors[4], 
            height: 0.52,
            width: 0.06 
        }),

        // Small decorative element - bookend
        React.createElement(
            'mesh',
            { position: [-0.22, 0.15, 0.05], rotation: [0, 0.3, 0] },
            React.createElement('boxGeometry', { args: [0.08, 0.2, 0.06] }),
            React.createElement('meshStandardMaterial', { 
                color: '#333',
                metalness: 0.6,
                roughness: 0.4
            })
        )
    );
};

export default Bookshelf;
