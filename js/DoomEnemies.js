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
const Fireball = ({ position, target, onHit }) => {
    const ref = useRef();
    
    useFrame((state, delta) => {
        if (!ref.current) return;
        
        // Move towards target
        const speed = 8;
        const direction = new THREE.Vector3()
            .subVectors(target, ref.current.position)
            .normalize();
            
        ref.current.position.add(direction.multiplyScalar(speed * delta));
        
        // Check collision with player (camera at roughly 0, 1.6, 0 in world space but we can check distance to target)
        // Target is the player position at shot time, but player might move.
        // For simplicity, we check distance to origin/camera if we had access, 
        // but here we just check if it gets close to the target position (which was player pos).
        // Better: check distance to actual player position passed down or assume player is near target.
        
        const distToTarget = ref.current.position.distanceTo(target);
        if (distToTarget < 0.5) {
            onHit();
        }
    });

    return React.createElement(Billboard, {
        position: position,
        follow: true
    },
        React.createElement(Image, {
            ref: ref,
            url: 'assets/doom_fireball.png',
            transparent: true,
            scale: [0.8, 0.8]
        })
    );
};

const Enemy = ({ position, onKilled, canShoot = true, onShoot }) => {
    const ref = useRef();
    const [health, setHealth] = useState(100);
    const [hitFlash, setHitFlash] = useState(0);
    
    // Shooting logic
    useFrame((state) => {
        if (!ref.current || health <= 0) return;
        
        // Floating animation
        ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;

        // Random shooting
        // if (Math.random() < 0.005) { // Approx once every 3-4 seconds at 60fps
        //     onShoot(ref.current.position.clone());
        // }

        // Decay hit flash
        if (hitFlash > 0) {
            setHitFlash(prev => Math.max(0, prev - 0.1));
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
 * @param {Function} props.onPlayerDamage - Callback to damage player
 */
const DoomEnemies = ({ ammo, onPlayerDamage }) => {
    const [fireballs, setFireballs] = useState([]);

    const enemies = useMemo(() => {
        const count = 8;
        const generated = [];
        const minDistance = 2.5;
        // ... (generation logic same as before) 
        // Re-implementing simplified for brevity in replace, but ideally should keep original
        // Using fixed implementation to ensure it works
        for (let i = 0; i < count; i++) {
             let pos;
            let attempts = 0;
            // Try to find a non-overlapping position
            do {
                pos = [
                    (Math.random() - 0.5) * 16, // X: -8 to 8
                    1.5 + Math.random(),        // Y: 1.5 to 2.5
                    -3 - Math.random() * 12     // Z: -3 to -15
                ];
                attempts++;
            } while (
                generated.some(e => 
                    Math.sqrt(
                        Math.pow(e.position[0] - pos[0], 2) + 
                        Math.pow(e.position[2] - pos[2], 2)
                    ) < minDistance
                ) && attempts < 50
            );
            
            generated.push({ id: i, position: pos });
        }
        return generated;
    }, []);

    const handleShoot = (startPos) => {
        // Target player position (approximate at camera height)
        const targetPos = new THREE.Vector3(0, 1.6, 0); 
        
        setFireballs(prev => [
            ...prev,
            { id: Date.now() + Math.random(), position: startPos, target: targetPos }
        ]);
    };

    const handleFireballHit = (id) => {
        // Remove fireball
        setFireballs(prev => prev.filter(f => f.id !== id));
        // Damage player
        if (onPlayerDamage) onPlayerDamage(10);
    };

    return React.createElement('group', null,
        enemies.map(enemy => 
            React.createElement(Enemy, { 
                key: enemy.id, 
                position: enemy.position,
                canShoot: ammo > 0,
                onShoot: handleShoot
            })
        ),
        fireballs.map(fb => 
            React.createElement(Fireball, {
                key: fb.id,
                position: fb.position,
                target: fb.target,
                onHit: () => handleFireballHit(fb.id)
            })
        )
    );
};

export default DoomEnemies;
