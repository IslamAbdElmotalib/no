
import React from 'react';
import { type PowerUp, PowerUpType } from '../types';

interface PowerUpProps {
    powerUp: PowerUp;
}

const PowerUpIcons: Record<PowerUpType, string> = {
    [PowerUpType.RapidFire]: '⚡️',
    [PowerUpType.Shield]: '🛡️',
    [PowerUpType.MultiShot]: '🚀',
};

const PowerUpComponent: React.FC<PowerUpProps> = ({ powerUp }) => {
    return (
        <div
            className="absolute flex items-center justify-center bg-purple-600 rounded-full border-2 border-purple-300 animate-pulse"
            style={{
                left: powerUp.position.x,
                top: powerUp.position.y,
                width: powerUp.size,
                height: powerUp.size,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 15px 5px #a855f7'
            }}
        >
            <span className="text-lg">{PowerUpIcons[powerUp.type]}</span>
        </div>
    );
};

export default PowerUpComponent;
