import React, { useState } from 'react';
import Scene from './Scene.js';

export default function App() {
    const [activeSection, setActiveSection] = useState(null);

    const content = {
        monitor: {
            title: "About Me",
            text: "I'm an engineer working on Computer Vision, but I also love 3D modelling, CAD, and 3D printing. I enjoy tinkering with electronics and making cool things."
        },
        printer: {
            title: "3D Fabrication",
            text: "From CAD to reality. I design complex mechanisms in Fusion 360 and bring them to life with FDM and SLA printing."
        },
        camera: {
            title: "Computer Vision Engineer",
            text: "I specialize in teaching machines to 'see'. Experienced in object detection, segmentation, and real-time video processing using PyTorch and OpenCV."
        }
    };

    return React.createElement(
        React.Fragment,
        null,
        // UI Overlay
        React.createElement(
            'div',
            { className: 'overlay' },
            React.createElement('h1', null, "Pau's Workbench"),
            React.createElement('p', null, "Select an object to explore"),
            
            // Dynamic Content Card
            activeSection && React.createElement(
                'div',
                { className: 'info-card' },
                React.createElement('h2', null, content[activeSection].title),
                React.createElement('p', null, content[activeSection].text),
                React.createElement(
                    'button', 
                    { onClick: () => setActiveSection(null), style: { marginTop: '1rem', cursor: 'pointer' } }, 
                    "Close"
                )
            )
        ),
        // 3D Scene with props
        React.createElement(Scene, { onSectionSelect: setActiveSection })
    );
}
