
import React from 'react';
import { type ActivePowerUp, PowerUpType } from '../types';

interface GameUIProps {
    score: number;
    planetHealth: number;
    activePowerUps: ActivePowerUp[];
}

const PowerUpDisplay: React.FC<{ powerUp: ActivePowerUp }> = ({ powerUp }) => {
    const icons: Record<PowerUpType, string> = {
        [PowerUpType.RapidFire]: '⚡️',
        [PowerUpType.Shield]: '🛡️',
        [PowerUpType.MultiShot]: '🚀',
    };
    const colors: Record<PowerUpType, string> = {
        [PowerUpType.RapidFire]: 'bg-yellow-400',
        [PowerUpType.Shield]: 'bg-cyan-400',
        [PowerUpType.MultiShot]: 'bg-red-400',
    };

    return (
        <div className={`flex items-center gap-2 p-2 rounded-lg text-black font-bold ${colors[powerUp.type]}`}>
            <span>{icons[powerUp.type]}</span>
            {powerUp.type !== PowerUpType.Shield && (
                <span>{(powerUp.duration / 1000).toFixed(1)}s</span>
            )}
        </div>
    );
};

const GameUI: React.FC<GameUIProps> = ({ score, planetHealth, activePowerUps }) => {
    return (
        <>
            <div className="absolute top-5 left-5 text-white text-3xl font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                SCORE: {score}
            </div>
            <div className="absolute top-5 right-5 w-64">
                <div className="text-white text-xl font-bold mb-1 text-right">PLANET HEALTH</div>
                <div className="w-full bg-red-800 rounded-full h-6 border-2 border-red-400">
                    <div
                        className="bg-green-500 h-full rounded-full transition-all duration-300 ease-linear"
                        style={{ width: `${planetHealth}%` }}
                    ></div>
                </div>
            </div>
            <div className="absolute bottom-5 left-5 flex gap-3">
                {activePowerUps.map(p => <PowerUpDisplay key={p.type} powerUp={p}/>)}
            </div>
        </>
    );
};

export default GameUI;
