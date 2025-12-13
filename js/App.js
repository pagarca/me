import React, { useState, useCallback } from 'react';
import Scene from 'scene';
import { coffeeFacts } from 'coffee_facts';

const content = {
    monitor: {
        title: "About Me",
        text: "I'm a Computer Vision Engineer with a passion for bridging the digital and physical worlds. I specialize in deep learning for perception, but my curiosity extends to hardware, 3D printing, and interactive design.",
        skills: ["Python", "C/C++", "OpenCV"],
        image: "https://github.com/pagarca.png", // Auto-fetched from GitHub
        socials: [
            { name: "GitHub", url: "https://github.com/pagarca", icon: "fa-brands fa-github" },
            { name: "LinkedIn", url: "https://www.linkedin.com/in/pau-garrigues-carb%C3%B3-a838b8b8/", icon: "fa-brands fa-linkedin" },
            { name: "ORCID", url: "https://orcid.org/0000-0003-3408-3249", icon: "fa-brands fa-orcid" },
            { name: "Email", url: "mailto:paugarrigues@gmail.com", icon: "fa-solid fa-envelope" }
        ]
    },
    printer: {
        title: "3D Fabrication",
        text: "Turning code into physical reality. I design complex mechanical assemblies in CAD and bring them to life using both FDM and SLA technologies. Experienced in optimizing topology for strength and weight.",
        skills: ["Inventor", "OpenSCAD", "PrusaSlicer", "FDM/SLA", "Prototyping"],
        socials: [
            { name: "My Printables", url: "https://www.printables.com/@__Rasputin___253661", icon: "fa-solid fa-cube" }
        ]
    },
    camera: {
        title: "Computer Vision",
        text: "Teaching machines to understand the world. I build real-time perception systems for robotics and automation, focusing on object detection, segmentation, and pose estimation.",
        skills: ["OpenCV", "PyTorch", "YOLO", "NVIDIA Jetson", "CUDA"]
    },
    // Fallback or specific static content for coffee can be empty since we use dynamicContent
    coffee: {}
};

export default function App() {
    const [activeSection, setActiveSection] = useState(null);
    const [isNightMode, setNightMode] = useState(false);
    const [dynamicContent, setDynamicContent] = useState(null);

    // Typewriter State
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const toggleLight = useCallback(() => setNightMode((prev) => !prev), []);

    // Typewriter Effect
    React.useEffect(() => {
        const titles = ["Pau's Workbench"];
        const i = loopNum % titles.length;
        const fullText = titles[i];

        const handleType = () => {
            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 2000); // Pause at end
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum]);

    const handleSectionSelect = useCallback((id) => {
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
    }, []);



    // Helper to get current content
    const currentData = dynamicContent || content[activeSection];

    return React.createElement(
        React.Fragment,
        null,
        // UI Overlay
        React.createElement(
            'div',
            { className: 'overlay' },
            React.createElement('h1', null,
                text,
                React.createElement('span', { className: 'cursor' }, '|')
            ),
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

                // Skills Section
                currentData.skills && React.createElement(
                    'div',
                    { className: 'skills-container' },
                    currentData.skills.map(skill =>
                        React.createElement('span', { key: skill, className: 'skill-tag' }, skill)
                    )
                ),

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
