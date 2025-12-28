'use client';

import { useState, useEffect, useRef } from 'react';

// Примеры строительных материалов для автоввода
const exampleMaterials = [
    "Цемент",
    "Штукатурка",
    "Гипсокартон",
    "Керамическая плитка",
    "Ламинат",
    "Краска фасадная",
    "Утеплитель"
];

interface UseAnimatedPlaceholderOptions {
    defaultPlaceholder?: string;
    isActive?: boolean;
}

export const useAnimatedPlaceholder = (options: UseAnimatedPlaceholderOptions = {}) => {
    const { defaultPlaceholder = 'Найти на Valik.kz', isActive = false } = options;

    const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
    const animationState = useRef<{
        timeoutId?: NodeJS.Timeout;
        materialIndex: number;
        charIndex: number;
        isDeleting: boolean;
    }>({
        materialIndex: 0,
        charIndex: 0,
        isDeleting: false,
    });

    useEffect(() => {
        const state = animationState.current;

        const type = () => {
            const currentMaterial = exampleMaterials[state.materialIndex];
            let newPlaceholder = '';
            let timeout = 150;

            if (state.isDeleting) {
                newPlaceholder = currentMaterial.substring(0, state.charIndex - 1);
                state.charIndex--;
                timeout = 50;
            } else {
                newPlaceholder = currentMaterial.substring(0, state.charIndex + 1);
                state.charIndex++;
            }

            setPlaceholder(newPlaceholder);

            if (!state.isDeleting && state.charIndex === currentMaterial.length) {
                state.isDeleting = true;
                timeout = 1500;
            } else if (state.isDeleting && state.charIndex === 0) {
                state.isDeleting = false;
                state.materialIndex = (state.materialIndex + 1) % exampleMaterials.length;
                timeout = 500;
            }

            state.timeoutId = setTimeout(type, timeout);
        };

        if (isActive) {
            if (state.timeoutId) clearTimeout(state.timeoutId);
            setPlaceholder(defaultPlaceholder);
        } else {
            state.timeoutId = setTimeout(type, 1000);
        }

        return () => {
            if (state.timeoutId) clearTimeout(state.timeoutId);
        };
    }, [isActive, defaultPlaceholder]);

    return placeholder;
};
