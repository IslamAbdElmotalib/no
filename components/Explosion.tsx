
import React from 'react';
import { type Explosion } from '../types';

interface ExplosionProps {
    explosion: Explosion;
}

const ExplosionComponent: React.FC<ExplosionProps> = ({ explosion }) => {
    const progress = (explosion.maxLife - explosion.life) / explosion.maxLife;
    const currentSize = explosion.size * progress * 1.5;
    const opacity = 1 - progress;

    return (
        <div
            className="absolute bg-orange-500 rounded-full"
            style={{
                left: explosion.position.x,
                top: explosion.position.y,
                width: currentSize,
                height: currentSize,
                transform: 'translate(-50%, -50%)',
                opacity: opacity,
                boxShadow: '0 0 20px 10px #fb923c'
            }}
        />
    );
};

export default ExplosionComponent;
