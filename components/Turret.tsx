
import React from 'react';

interface TurretProps {
    angle: number;
}

const Turret: React.FC<TurretProps> = ({ angle }) => {
    return (
        <div
            className="absolute bottom-[80px] left-1/2 -translate-x-1/2 w-8 h-20 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        >
            <div className="w-full h-full bg-gradient-to-t from-gray-500 to-gray-300 rounded-t-lg border-2 border-gray-600"></div>
        </div>
    );
};

export default Turret;
