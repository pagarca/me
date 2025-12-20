import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * First-person movement controller for Doom mode.
 * Handles WASD/Arrow key movement and head bobbing.
 * 
 * @param {Object} props
 * @param {number} props.speed - Movement speed multiplier
 * @param {Function} props.onExit - Callback when Q key is pressed to exit
 */
const DoomMovement = ({ speed = 5, onExit }) => {
    const { camera } = useThree();
    
    // Movement state refs (to avoid re-renders)
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);

    useEffect(() => {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward.current = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft.current = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward.current = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight.current = true;
                    break;
                case 'KeyQ':
                    if (onExit) onExit();
                    break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    moveForward.current = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    moveLeft.current = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    moveBackward.current = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    moveRight.current = false;
                    break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, [onExit]);

    useFrame((state, delta) => {
        // Only move when pointer is locked
        if (!state.controls?.isLocked) return;

        const moveSpeed = speed * delta;
        const isMoving = moveForward.current || moveBackward.current || 
                         moveLeft.current || moveRight.current;

        // Calculate forward and right vectors relative to camera
        const forward = new THREE.Vector3(0, 0, -1)
            .applyQuaternion(camera.quaternion)
            .setY(0)
            .normalize();

        const right = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(camera.quaternion)
            .setY(0)
            .normalize();

        // Apply movement
        if (moveForward.current) camera.position.addScaledVector(forward, moveSpeed);
        if (moveBackward.current) camera.position.addScaledVector(forward, -moveSpeed);
        if (moveRight.current) camera.position.addScaledVector(right, moveSpeed);
        if (moveLeft.current) camera.position.addScaledVector(right, -moveSpeed);

        // Head bobbing
        const baseHeight = 1.6;
        if (isMoving) {
            const bobAmount = Math.sin(state.clock.elapsedTime * 15) * 0.05;
            camera.position.y = baseHeight + bobAmount;
        } else {
            camera.position.y = baseHeight;
        }
    });

    return null;
};

export default DoomMovement;
