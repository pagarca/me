import React, { useState, useCallback, Suspense, useEffect } from 'react';
import Scene from 'scene';
import LoadingScreen from 'loading_screen';
import { coffeeFacts } from 'coffee_facts';
import config from 'config';


const content = {
    monitor: {
        title: "About Me",
        text: "I'm a Computer Vision Engineer with a passion for bridging the digital and physical worlds. I specialize in deep learning for perception, but my curiosity extends to hardware, 3D printing, and interactive design.",
        skills: ["Python", "C/C++", "OpenCV"],
        image: "https://github.com/pagarca.png",
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
        skills: ["Inventor", "OpenSCAD", "Blender", "FDM/SLA", "Prototyping"],
        socials: [
            { name: "My Printables", url: "https://www.printables.com/@__Rasputin___253661", icon: "fa-solid fa-cube" }
        ]
    },
    camera: {
        title: "Computer Vision",
        text: "Teaching machines to understand the world. I build real-time perception systems for robotics and automation, focusing on object detection, segmentation, and pose estimation.",
        skills: ["OpenCV", "PyTorch", "YOLO", "NVIDIA Jetson", "CUDA"]
    },
    coffee: {}
};

export default function App() {
    const [activeSection, setActiveSection] = useState(null);
    const [isNightMode, setNightMode] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [dynamicContent, setDynamicContent] = useState(null);

    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const toggleLight = useCallback(() => setNightMode((prev) => !prev), []);
    const toggleHighContrast = useCallback(() => setHighContrast((prev) => !prev), []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && activeSection) {
                setActiveSection(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeSection]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const savedContrast = localStorage.getItem('highContrast');
        if (savedTheme === 'night') setNightMode(true);
        if (savedContrast === 'true') setHighContrast(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isNightMode ? 'night' : 'day');
        localStorage.setItem('highContrast', highContrast.toString());

        const body = document.getElementById('app-body');
        if (body) {
            if (highContrast) {
                body.classList.add('high-contrast');
            } else {
                body.classList.remove('high-contrast');
            }
        }
    }, [isNightMode, highContrast]);

    useEffect(() => {
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
                setTimeout(() => setIsDeleting(true), 2000);
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

    const currentData = dynamicContent || content[activeSection];
    const colors = config.colors;
    const accentColor = highContrast ? colors.accessibility.highContrastColors.foreground : colors.retroGreen;

    const overlayProps = {
        className: 'overlay',
        role: 'main',
        'aria-live': 'polite'
    };

    return React.createElement(
        React.Fragment,
        null,
        React.createElement('div', overlayProps,
            React.createElement('div', {
                className: 'controls-bar',
                style: { display: 'flex', gap: '10px', marginBottom: '10px' }
            },
            React.createElement('button', {
                onClick: toggleLight,
                'aria-label': isNightMode ? 'Switch to day mode' : 'Switch to night mode',
                className: 'control-btn',
                style: { color: accentColor, borderColor: accentColor }
            }, isNightMode ? '☀️ Day' : '🌙 Night'),
            React.createElement('button', {
                onClick: toggleHighContrast,
                'aria-label': highContrast ? 'Disable high contrast' : 'Enable high contrast',
                className: 'control-btn',
                style: { color: accentColor, borderColor: accentColor }
            }, highContrast ? '◐ Normal' : '◑ High Contrast')
            ),
            React.createElement('h1', {
                style: { color: highContrast ? colors.accessibility.highContrastColors.foreground : accentColor }
            },
                text,
                React.createElement('span', { className: 'cursor' }, '|')
            ),
            React.createElement('p', null, "Select an object to explore"),
            activeSection && currentData && React.createElement(
                'div',
                {
                    className: 'info-card',
                    role: 'dialog',
                    'aria-modal': 'true',
                    'aria-labelledby': 'dialog-title-' + activeSection
                },
                currentData.image && React.createElement('img', {
                    src: currentData.image,
                    className: 'profile-img',
                    alt: 'Profile photo'
                }),
                React.createElement('h2', {
                    id: 'dialog-title-' + activeSection
                }, currentData.title),
                React.createElement('p', null, currentData.text),
                currentData.skills && React.createElement(
                    'div',
                    { className: 'skills-container' },
                    currentData.skills.map(skill =>
                        React.createElement('span', { key: skill, className: 'skill-tag' }, skill)
                    )
                ),
                currentData.socials && React.createElement(
                    'div',
                    { className: 'social-links' },
                    currentData.socials.map(link =>
                        React.createElement('a', {
                            key: link.name,
                            href: link.url,
                            className: 'social-btn',
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            'aria-label': 'Open ' + link.name + ' in new tab'
                        },
                            link.icon && React.createElement('i', { className: link.icon, style: { marginRight: '8px' } }),
                            link.name
                        )
                    )
                ),
                React.createElement(
                    'button',
                    {
                        onClick: () => setActiveSection(null),
                        style: { marginTop: '1rem', cursor: 'pointer' },
                        'aria-label': 'Close dialog'
                    },
                    "Close"
                )
            )
        ),
        React.createElement(
            Suspense,
            { fallback: React.createElement(LoadingScreen) },
            React.createElement(Scene, {
                onSectionSelect: handleSectionSelect,
                activeSection: activeSection,
                isNightMode: isNightMode,
                onToggleLight: toggleLight
            })
        )
    );
}
