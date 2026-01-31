export const config = {
    colors: {
        retroGreen: '#4cd137',
        retroGreenGlow: 'rgba(76, 209, 55, 0.7)',
        terminalGreen: '#00ff00',
        terminalBg: '#001a00',
        terminalBgEmissive: '#002200',
        darkBg: '#111',
        nightBg: '#050505',
        dayBg: '#171720',
        nightAmbient: '#001133',
        coffeeBrown: '#3e2723',
        white: '#ffffff',
        yellow: '#ffff00',
        orange: '#ffaa00',
        cyan: '#00ffff',
        grayDark: '#222',
        grayMedium: '#333',
        grayLight: '#444',
        grayMetallic: '#2d3436',
        grayDarker: '#181818',
        silver: '#C0C0C0',
        deskBrown: '#8B4513'
    },
    positions: {
        monitor: [0, 0.6, -1],
        printer: [2.1, 0.1, 0.75],
        camera: [-2.2, 0.5, -0.5],
        coffeeCup: [-1.2, 0.1, 0.8],
        deskLamp: [2.5, 0.1, -1.0],
        workbench: [0, -1, 0],
        floor: [0, -3, 0]
    },
    rotations: {
        printer: [0, -0.5, 0],
        camera: [0, 0.5, 0],
        deskLamp: [0, 2.2, 0]
    },
    sizes: {
        desk: [6, 0.2, 3],
        monitor: [3, 1.8, 0.1],
        printerBed: [1, 0.1, 1],
        deskLeg: [0.1, 0.1, 3],
        keyboard: [1.4, 0.05, 0.5],
        keys: [1.3, 0.02, 0.4]
    },
    camera: {
        desktop: {
            position: [0, 4, 8],
            fov: 45
        },
        mobile: {
            position: [0, 6, 12],
            fov: 55
        },
        controls: {
            target: [0, 0.5, 0],
            minPolarAngle: 0,
            maxPolarAngle: Math.PI / 2.2,
            minDistance: 3,
            maxDistance: 15
        }
    },
    lights: {
        ambient: {
            day: { intensity: 4, color: '#ffffff' },
            night: { intensity: 0.1, color: '#001133' }
        },
        directional: {
            day: { intensity: 3, color: '#ffffff' },
            night: { intensity: 0.2, color: '#ffffff' },
            position: [5, 10, 5]
        },
        screen: {
            intensity: 10,
            distance: 3,
            decay: 2
        },
        lamp: {
            intensity: 8,
            distance: 8,
            decay: 2,
            color: '#ffaa00'
        }
    },
    particles: {
        dustCount: 400,
        dustSize: 0.02,
        dustOpacity: 0.15,
        steamCount: 3,
        steamMaxHeight: 0.6
    },
    mobile: {
        breakpoint: 768,
        maxDpr: [1, 1.5],
        desktopMaxDpr: [1, 2],
        shadowMapSize: [1024, 1024],
        desktopShadowMapSize: [2048, 2048]
    },
    animations: {
        wobble: {
            speed: 8,
            minScale: 1,
            maxScale: 1.05
        },
        ghostMouse: {
            speed: 2,
            range: 0.15,
            secondaryRange: 0.1
        },
        steam: {
            cycleDuration: 1.5,
            maxOpacity: 0.4
        }
    },
    accessibility: {
        highContrastColors: {
            foreground: '#00ff00',
            background: '#000000',
            accent: '#ffff00'
        }
    }
};
