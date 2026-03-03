import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import confetti from 'canvas-confetti';

export function AuthCelebration() {
    const { isSignedIn, isLoaded } = useUser();
    const hasCelebrated = useRef(false);

    useEffect(() => {
        if (isLoaded && isSignedIn && !hasCelebrated.current) {
            // Trigger fireworks
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);

                // since particles fall down, start a bit higher than random
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#1B4332', '#ffffff', '#40916C'] // Medical Green and White
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#1B4332', '#ffffff', '#40916C']
                });
            }, 250);

            hasCelebrated.current = true;
        } else if (isLoaded && !isSignedIn) {
            // Reset when they log out so it can fire again next time they log in
            hasCelebrated.current = false;
        }
    }, [isSignedIn, isLoaded]);

    return null; // This is a logic-only component
}
