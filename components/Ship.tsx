
import React from 'react';
import { type Ship } from '../types';

interface ShipProps {
    ship: Ship;
}

const ShipComponent: React.FC<ShipProps> = ({ ship }) => {
    const baseStyle = 'absolute transition-transform duration-100';
    
    const enemyStyle = {
        width: 0,
        height: 0,
        borderLeft: `${ship.size / 2}px solid transparent`,
        borderRight: `${ship.size / 2}px solid transparent`,
        borderBottom: `${ship.size}px solid #ef4444`, // red-500
        filter: 'drop-shadow(0 0 5px #ef4444)',
    };
    
    const friendlyStyle = {
        width: `${ship.size}px`,
        height: `${ship.size * 1.5}px`,
        backgroundColor: '#60a5fa', // blue-400
        borderRadius: '20%',
        boxShadow: '0 0 10px #60a5fa',
    };

    const style = ship.type === 'enemy' ? enemyStyle : friendlyStyle;

    return (
        <div
            className={baseStyle}
            style={{
                left: ship.position.x,
                top: ship.position.y,
                transform: 'translate(-50%, -50%)',
                ...style,
            }}
        />
    );
};

export default ShipComponent;
