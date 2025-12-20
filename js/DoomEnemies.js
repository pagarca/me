import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Billboard, Image } from '@react-three/drei';
import * as THREE from 'three';

const Enemy = ({ position, onKilled }) => {
    const ref = useRef();
    const [health, setHealth] = useState(100);
    const [hitFlash, setHitFlash] = useState(0);

    useFrame((state, delta) => {
        if (!ref.current) return;
        
        // Simple "float" animation
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;

        // Face player (Billboard handles rotation, but we might want them to move towards player later)
        if (hitFlash > 0) {
            setHitFlash(prev => Math.max(0, prev - delta * 5));
        }
    });

    // Make it clickable for "Shooting" (Raycasting handled by canvas pointer events)
    // Actually, Scene raycasting is cleaner, but onClick here works for simple implementation.
    const handleShot = (e) => {
        e.stopPropagation();
        // Play sound?
        setHealth(h => {
             const newH = h - 25; // 4 shots to kill
             if (newH <= 0) {
                 if (onKilled) onKilled();
                 return 0;
             }
             return newH;
        });
        setHitFlash(1); // Full red intensity
    };

    if (health <= 0) return null; // Or play death animation

    return React.createElement(
        Billboard,
        {
            position: position,
            follow: true,
            lockX: false,
            lockY: false,
            lockZ: false,
        },
        React.createElement(Image, {
            ref: ref,
            url: "assets/doom_demon.png",
            transparent: true,
            scale: [2, 2], // Adjust size
            color: hitFlash > 0 ? new THREE.Color(1, 1 - hitFlash, 1 - hitFlash) : 'white',
            onClick: handleShot,
            // pointerEvents needs to be enabled in scene for this to work
        })
    );
};

const DoomEnemies = () => {
    // Spawn 5 enemies in random spots around the desk
    const initialEnemies = useMemo(() => {
        return Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            position: [(Math.random() - 0.5) * 10, 1.5, (Math.random() - 0.5) * 10 - 5]
        }));
    }, []);

    return React.createElement(
        'group',
        null,
        initialEnemies.map(enemy => 
            React.createElement(Enemy, { key: enemy.id, position: enemy.position })
        )
    );
};

export default DoomEnemies;
