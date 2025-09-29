
import React from 'react';

interface PlanetProps {
    health: number;
    hasShield: boolean;
}

const Planet: React.FC<PlanetProps> = ({ health, hasShield }) => {
    const damageOpacity = (100 - health) / 100 * 0.8;

    return (
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full overflow-hidden shadow-2xl shadow-cyan-500/20">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-green-400">
                {/* Continents-like pattern */}
                <div className="absolute w-40 h-32 bg-green-600/50 rounded-full top-10 left-10 blur-md"></div>
                <div className="absolute w-20 h-20 bg-green-700/50 rounded-full bottom-12 right-12 blur-md"></div>
                <div className="absolute w-32 h-24 bg-green-500/50 rounded-full top-20 right-5 blur-lg"></div>
            </div>
             {/* Damage Overlay */}
            <div 
                className="absolute inset-0 bg-red-800 transition-opacity duration-500"
                style={{ opacity: damageOpacity }}
            ></div>
            {/* Shield Effect */}
            {hasShield && (
                 <div className="absolute inset-[-10px] border-4 border-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_5px] shadow-cyan-400/50"></div>
            )}
        </div>
    );
};

export default Planet;
