import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DoomMovement = ({ speed = 5, onExit }) => {
    const { camera } = useThree();
    const moveForward = useRef(false);
    const moveBackward = useRef(false);
    const moveLeft = useRef(false);
    const moveRight = useRef(false);
    const velocity = useRef(new THREE.Vector3());
    const direction = useRef(new THREE.Vector3());

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
    }, []);

    useFrame((state, delta) => {
        if (!state.controls?.isLocked) return;

        // Friction
        velocity.current.x -= velocity.current.x * 10.0 * delta;
        velocity.current.z -= velocity.current.z * 10.0 * delta;

        // Direction
        direction.current.z = Number(moveForward.current) - Number(moveBackward.current);
        direction.current.x = Number(moveRight.current) - Number(moveLeft.current);
        direction.current.normalize(); // this ensures consistent movements in all directions

        if (moveForward.current || moveBackward.current) velocity.current.z -= direction.current.z * speed * 10.0 * delta;
        if (moveLeft.current || moveRight.current) velocity.current.x -= direction.current.x * speed * 10.0 * delta;

        // Move camera
        // Note: pointerLockControls typically moves the camera, so we use simpler "moveRight" / "moveForward" utils if available, 
        // or manually move relative to camera direction.
        
        // Simple manual implementation relative to camera look direction
        // We need to move on the XZ plane relative to camera rotation
        
        // Forward/Backward
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        forward.y = 0; // Flatten to ground
        forward.normalize();

        const right = new THREE.Vector3(1, 0, 0);
        right.applyQuaternion(camera.quaternion);
        right.y = 0;
        right.normalize();

        // Apply velocity to position
        // We use a simplified velocity method here for "Doom-like" instant start/stopfeel or keep momentum if desired.
        // Let's stick to direct movement for snappiness (Doom is snappy)
        
        const moveSpeed = speed * delta;
        
        if (moveForward.current) camera.position.addScaledVector(forward, moveSpeed);
        if (moveBackward.current) camera.position.addScaledVector(forward, -moveSpeed);
        if (moveRight.current) camera.position.addScaledVector(right, moveSpeed);
        if (moveLeft.current) camera.position.addScaledVector(right, -moveSpeed);

        // Bobbing (Head bob)
        if (moveForward.current || moveBackward.current || moveLeft.current || moveRight.current) {
            const time = state.clock.elapsedTime;
            camera.position.y = 1.6 + Math.sin(time * 15) * 0.05;
        } else {
            camera.position.y = 1.6;
        }
    });

    return null;
};

export default DoomMovement;
