import React from 'react';

/**
 * Doom-style HUD overlay component.
 * Displays weapon, crosshair, and status bar with health/ammo/armor.
 * 
 * @param {Object} props
 * @param {number} props.health - Player health (0-100)
 * @param {number} props.ammo - Current ammo count
 * @param {number} props.armor - Player armor (0-100)
 * @param {boolean} props.isShooting - Whether the player is currently shooting (triggers recoil animation)
 */
const DoomHUD = ({ health = 100, ammo = 8, armor = 0, isShooting = false }) => {
    // Calculate damage overlay opacity based on health
    const damageOverlayOpacity = ((100 - health) / 100) * 0.5;
    
    // Calculate dynamic hue shift:
    // 100% Health -> Green (~100deg shift from sepia)
    // 0% Health -> Red (~-50deg shift from sepia)
    const hueShift = -50 + (health / 100) * 150;
    
    // Sepia(100%) makes it monochrome (brownish-yellow, approx hue 40-50)
    // Then we rotate hue to get desired color.
    const damageFilter = `sepia(100%) hue-rotate(${hueShift}deg) saturate(300%)`;

    return React.createElement('div', { className: 'doom-hud-container' },
        // Viewport (Crosshair + Weapon)
        React.createElement('div', { className: 'doom-viewport' },
            // Muzzle Flash (inside viewport, rendered FIRST so it's behind weapon)
            isShooting && React.createElement('div', { className: 'doom-muzzle-flash' }),
            React.createElement('div', { className: 'doom-crosshair' }, '+'),
            React.createElement('div', { className: 'doom-weapon-wrapper' },
                React.createElement('img', { 
                    src: 'assets/doom_shotgun.png', 
                    className: `doom-weapon ${isShooting ? 'firing' : ''}`,
                    alt: 'Shotgun'
                })
            )
        ),
        
        // Status Bar
        React.createElement('div', { className: 'doom-status-bar' },
            // Ammo
            React.createElement('div', { className: 'doom-stat-box' }, 
                React.createElement('span', { className: 'doom-label' }, 'AMMO'),
                React.createElement('span', { className: 'doom-value' }, ammo)
            ),
            // Health
            React.createElement('div', { className: 'doom-stat-box' }, 
                React.createElement('span', { className: 'doom-label' }, 'HEALTH'),
                React.createElement('span', { className: 'doom-value' }, `${health}%`)
            ),
            // Face (Profile Picture)
            React.createElement('div', { className: 'doom-face-box' },
                React.createElement('img', { 
                    src: 'https://github.com/pagarca.png',
                    alt: 'Player Face',
                    style: { 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        filter: damageFilter
                    }
                }),
                React.createElement('div', {
                    className: 'doom-face-damage-overlay',
                    style: { opacity: damageOverlayOpacity }
                })
            ),
            // Armor
            React.createElement('div', { className: 'doom-stat-box' }, 
                React.createElement('span', { className: 'doom-label' }, 'ARMOR'),
                React.createElement('span', { className: 'doom-value' }, `${armor}%`)
            )
        )
    );
};

export default DoomHUD;
