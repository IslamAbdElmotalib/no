
import React from 'react';
import { type Projectile } from '../types';

interface ProjectileProps {
    projectile: Projectile;
}

const ProjectileComponent: React.FC<ProjectileProps> = ({ projectile }) => {
    return (
        <div
            className="absolute bg-yellow-300 rounded-full"
            style={{
                left: projectile.position.x,
                top: projectile.position.y,
                width: projectile.size,
                height: projectile.size * 2,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 10px 2px #fde047'
            }}
        />
    );
};

export default ProjectileComponent;
