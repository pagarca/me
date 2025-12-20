import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Image } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Individual enemy sprite component.
 * Uses Billboard to always face the camera.
 * @param {Object} props
 * @param {Array} props.position - [x, y, z] position
 * @param {Function} props.onKilled - Callback when enemy dies
 * @param {boolean} props.canShoot - Whether player has ammo to shoot
 */
const Enemy = ({ position, onKilled, canShoot = true }) => {
    const ref = useRef();
    const [health, setHealth] = useState(100);
    const [hitFlash, setHitFlash] = useState(0);

    useFrame((state, delta) => {
        if (!ref.current) return;
        
        // Floating animation
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;

        // Decay hit flash
        if (hitFlash > 0) {
            setHitFlash(prev => Math.max(0, prev - delta * 5));
        }
    });

    const handleShot = (e) => {
        e.stopPropagation();
        if (!canShoot) return; // Can't damage without ammo
        setHealth(h => {
            const newHealth = h - 25; // 4 shots to kill
            if (newHealth <= 0 && onKilled) onKilled();
            return Math.max(0, newHealth);
        });
        setHitFlash(1);
    };

    if (health <= 0) return null;

    const hitColor = hitFlash > 0 
        ? new THREE.Color(1, 1 - hitFlash, 1 - hitFlash) 
        : 'white';

    return React.createElement(Billboard, {
        position: position,
        follow: true,
        lockX: false,
        lockY: false,
        lockZ: false,
    },
        React.createElement(Image, {
            ref: ref,
            url: 'assets/doom_demon.png',
            transparent: true,
            scale: [2, 2],
            color: hitColor,
            onClick: handleShot
        })
    );
};

/**
 * Container component that spawns and manages all enemies.
 * @param {Object} props
 * @param {number} props.ammo - Current ammo count (enemies can only be hit if ammo > 0)
 */
const DoomEnemies = ({ ammo }) => {
    const enemies = useMemo(() => {
        return Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            position: [
                (Math.random() - 0.5) * 10, 
                1.5, 
                (Math.random() - 0.5) * 10 - 5
            ]
        }));
    }, []);

    return React.createElement('group', null,
        enemies.map(enemy => 
            React.createElement(Enemy, { 
                key: enemy.id, 
                position: enemy.position,
                canShoot: ammo > 0
            })
        )
    );
};

export default DoomEnemies;
