import React, { useState } from 'react';
import Scene from './Scene.js';
import { coffeeFacts } from './coffeeFacts.js';

export default function App() {
    const [activeSection, setActiveSection] = useState(null);
    const [isNightMode, setNightMode] = useState(false);
    const [dynamicContent, setDynamicContent] = useState(null);

    const toggleLight = () => setNightMode(!isNightMode);

    const handleSectionSelect = (id) => {
        if (id === 'coffee') {
            const randomFact = coffeeFacts[Math.floor(Math.random() * coffeeFacts.length)];
            setDynamicContent({
                title: "Coffee Fact ☕",
                text: "As a coffee lover, here is a random fact: " + randomFact
            });
            setActiveSection('coffee');
        } else {
            setDynamicContent(null);
            setActiveSection(id);
        }
    };

    const content = {
        monitor: {
            title: "About Me",
            text: "I'm an engineer working on Computer Vision, but I also love 3D modelling, CAD, and 3D printing. I enjoy tinkering with electronics and making cool things.",
            image: "https://github.com/pagarca.png", // Auto-fetched from GitHub
            socials: [
                { name: "GitHub", url: "https://github.com/pagarca", icon: "fa-brands fa-github" },
                { name: "LinkedIn", url: "https://www.linkedin.com/in/pau-garrigues-carb%C3%B3-a838b8b8/", icon: "fa-brands fa-linkedin" },
                { name: "Email", url: "mailto:paugarrigues@gmail.com", icon: "fa-solid fa-envelope" }
            ]
        },
        printer: {
            title: "3D Fabrication",
            text: "From CAD to reality. I design complex mechanisms in Fusion 360 and bring them to life with FDM and SLA printing.",
            socials: [
                { name: "My Printables", url: "https://www.printables.com/@__Rasputin___253661", icon: "fa-solid fa-cube" }
            ]
        },
        camera: {
            title: "Computer Vision Engineer",
            text: "I specialize in teaching machines to 'see'. Experienced in object detection, segmentation, and real-time video processing using PyTorch and OpenCV."
        },
        // Fallback or specific static content for coffee can be empty since we use dynamicContent
        coffee: {}
    };

    // Helper to get current content
    const currentData = dynamicContent || content[activeSection];

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
            activeSection && currentData && React.createElement(
                'div',
                { className: 'info-card' },
                // Optional Image
                currentData.image && React.createElement('img', {
                    src: currentData.image,
                    className: 'profile-img',
                    alt: 'Profile'
                }),
                React.createElement('h2', null, currentData.title),
                React.createElement('p', null, currentData.text),

                // Optional Socials
                currentData.socials && React.createElement(
                    'div',
                    { className: 'social-links' },
                    currentData.socials.map(link =>
                        React.createElement('a', {
                            key: link.name,
                            href: link.url,
                            className: 'social-btn',
                            target: '_blank'
                        },
                            // Icon
                            link.icon && React.createElement('i', { className: `${link.icon}`, style: { marginRight: '8px' } }),
                            link.name
                        )
                    )
                ),

                React.createElement(
                    'button',
                    { onClick: () => setActiveSection(null), style: { marginTop: '1rem', cursor: 'pointer' } },
                    "Close"
                )
            )
        ),
        // 3D Scene with props
        React.createElement(Scene, {
            onSectionSelect: handleSectionSelect,
            isNightMode: isNightMode,
            onToggleLight: toggleLight
        })
    );
}
