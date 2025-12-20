import React, { useEffect, useState } from 'react';

const DoomHUD = ({ health = 100, ammo = 50, armor = 0, isShooting }) => {
    // No more breathing animation loop
    
    return React.createElement('div', { className: 'doom-hud-container' },
        // Main Viewport (Crosshair + Weapon)
        React.createElement('div', { className: 'doom-viewport' },
             React.createElement('div', { className: 'doom-crosshair' }, '+'),
             // Static Wrapper (or just image if no wrapper needed, but wrapper helps centering)
             React.createElement('div', { 
                className: 'doom-weapon-wrapper',
                style: { 
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translate(-50%, 0)' // Static
                }
             },
                // Actual Weapon Image with Recoil Class
                React.createElement('img', { 
                    src: 'assets/doom_shotgun.png', 
                    className: `doom-weapon ${isShooting ? 'firing' : ''}`,
                })
             )
        ),
        
        // Status Bar
        React.createElement('div', { className: 'doom-status-bar' },
            // Left: Ammo/Health
            React.createElement('div', { className: 'doom-stat-box' }, 
                React.createElement('span', { className: 'doom-label' }, 'AMMO'),
                React.createElement('span', { className: 'doom-value' }, ammo)
            ),
            React.createElement('div', { className: 'doom-stat-box' }, 
                React.createElement('span', { className: 'doom-label' }, 'HEALTH'),
                React.createElement('span', { className: 'doom-value' }, `${health}%`)
            ),

            // Center: Face - Profile Picture with Red Tint based on Health
            React.createElement('div', { className: 'doom-face-box' },
                React.createElement('img', { 
                    src: 'https://github.com/pagarca.png',
                    style: { 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: `sepia(${100 - health}%) hue-rotate(-50deg) saturate(500%)`,
                    }
                }),
                // Damage overlay
                React.createElement('div', {
                    style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'red',
                        opacity: (100 - health) / 100 * 0.5, // Max 50% red tint
                        pointerEvents: 'none'
                    }
                })
            ),

            // Right: Armor
            React.createElement('div', { className: 'doom-stat-box' }, 
                React.createElement('span', { className: 'doom-label' }, 'ARMOR'),
                React.createElement('span', { className: 'doom-value' }, `${armor}%`)
            )
        )
    );
};

export default DoomHUD;
