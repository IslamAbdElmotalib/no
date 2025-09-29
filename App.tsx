import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, PowerUpType, type Ship, type Projectile, type Explosion, type PowerUp, type Vector2D, type ActivePowerUp } from './types';
import Planet from './components/Planet';
import Turret from './components/Turret';
import ShipComponent from './components/Ship';
import ProjectileComponent from './components/Projectile';
import ExplosionComponent from './components/Explosion';
import PowerUpComponent from './components/PowerUp';
import GameUI from './components/GameUI';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';

const App: React.FC = () => {
    const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.StartScreen);
    const [score, setScore] = useState(0);
    const [planetHealth, setPlanetHealth] = useState(100);
    const [finalScore, setFinalScore] = useState(0);
    const [turretAngle, setTurretAngle] = useState(0);
    const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
    // FIX: Define state setter to trigger re-renders for the game loop.
    const [, setRenderTrigger] = useState(0);

    const gameAreaRef = useRef<HTMLDivElement>(null);
    const projectiles = useRef<Projectile[]>([]);
    const ships = useRef<Ship[]>([]);
    const explosions = useRef<Explosion[]>([]);
    const powerUps = useRef<PowerUp[]>([]);
    
    const lastTime = useRef(0);
    const nextEnemySpawn = useRef(0);
    const nextFriendlySpawn = useRef(0);
    const shootCooldown = useRef(0);
    const isShooting = useRef(false);
    const shootOnMoveTimeout = useRef<number | null>(null);

    const resetGameState = useCallback(() => {
        setScore(0);
        setPlanetHealth(100);
        setTurretAngle(0);
        setActivePowerUps([]);
        projectiles.current = [];
        ships.current = [];
        explosions.current = [];
        powerUps.current = [];
        lastTime.current = 0;
        nextEnemySpawn.current = 0;
        nextFriendlySpawn.current = 3000;
        shootCooldown.current = 0;
        isShooting.current = false;
        if (shootOnMoveTimeout.current) {
            clearTimeout(shootOnMoveTimeout.current);
            shootOnMoveTimeout.current = null;
        }
    }, []);

    const startGame = () => {
        resetGameState();
        setGameStatus(GameStatus.Playing);
    };

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const turretX = rect.width / 2;
        const turretY = rect.height - 100;
        const angle = Math.atan2(clientY - turretY, clientX - turretX) + Math.PI / 2;
        setTurretAngle(angle * (180 / Math.PI));

        isShooting.current = true;
        if (shootOnMoveTimeout.current) {
            clearTimeout(shootOnMoveTimeout.current);
        }
        shootOnMoveTimeout.current = window.setTimeout(() => {
            isShooting.current = false;
        }, 150); // Stop shooting 150ms after mouse stops moving
    }, []);

    useEffect(() => {
        const gameArea = gameAreaRef.current;
        if (gameStatus === GameStatus.Playing && gameArea) {
            gameArea.addEventListener('mousemove', handleMouseMove);
            gameArea.addEventListener('touchmove', handleMouseMove, { passive: false });
            
            return () => {
                gameArea.removeEventListener('mousemove', handleMouseMove);
                gameArea.removeEventListener('touchmove', handleMouseMove);
            };
        }
    }, [gameStatus, handleMouseMove]);


    const gameLoop = useCallback((timestamp: number) => {
        if (gameStatus !== GameStatus.Playing) return;

        if (lastTime.current === 0) {
            lastTime.current = timestamp;
            requestAnimationFrame(gameLoop);
            return;
        }

        const deltaTime = timestamp - lastTime.current;
        lastTime.current = timestamp;

        const hasPowerUp = (type: PowerUpType) => activePowerUps.some(p => p.type === type);
        
        // Update power-ups duration
        setActivePowerUps(prev => prev.map(p => ({ ...p, duration: p.duration - deltaTime })).filter(p => p.duration > 0));

        // Update shooting cooldown
        const fireRate = hasPowerUp(PowerUpType.RapidFire) ? 100 : 250;
        if (shootCooldown.current > 0) shootCooldown.current -= deltaTime;

        // Player shooting
        if (isShooting.current && shootCooldown.current <= 0) {
            shootCooldown.current = fireRate;
            const angleRad = (turretAngle - 90) * (Math.PI / 180);
            const speed = 1;
            
            const createProjectile = (angleOffset = 0) => {
                const finalAngle = angleRad + angleOffset;
                return {
                    id: Date.now() + Math.random(),
                    position: { x: window.innerWidth / 2, y: window.innerHeight - 120 },
                    velocity: { x: Math.cos(finalAngle) * speed, y: Math.sin(finalAngle) * speed },
                    size: 8,
                };
            };
            
            projectiles.current.push(createProjectile());
            if (hasPowerUp(PowerUpType.MultiShot)) {
                 projectiles.current.push(createProjectile(-0.15));
                 projectiles.current.push(createProjectile(0.15));
            }
        }

        // Move projectiles
        projectiles.current = projectiles.current.filter(p => {
            p.position.x += p.velocity.x * deltaTime;
            p.position.y += p.velocity.y * deltaTime;
            return p.position.y > 0 && p.position.x > 0 && p.position.x < window.innerWidth;
        });

        // Spawn ships
        if (timestamp > nextEnemySpawn.current) {
            const spawnRate = Math.max(200, 2000 - score * 10);
            nextEnemySpawn.current = timestamp + spawnRate;
            ships.current.push({
                id: Date.now() + Math.random(),
                type: 'enemy',
                health: 1,
                position: { x: Math.random() * window.innerWidth, y: -50 },
                velocity: { x: (Math.random() - 0.5) * 0.1, y: 0.1 + score * 0.001 },
                size: 30 + Math.random() * 15,
            });
        }
        if (timestamp > nextFriendlySpawn.current) {
            nextFriendlySpawn.current = timestamp + 5000 + Math.random() * 5000;
            ships.current.push({
                id: Date.now() + Math.random(),
                type: 'friendly',
                health: 1,
                position: { x: Math.random() * window.innerWidth, y: -50 },
                velocity: { x: (Math.random() - 0.5) * 0.05, y: 0.08 },
                size: 25,
            });
        }

        // Move ships
        ships.current = ships.current.filter(s => {
            s.position.x += s.velocity.x * deltaTime;
            s.position.y += s.velocity.y * deltaTime;
            if (s.position.y > window.innerHeight - 100) {
                if (s.type === 'enemy') {
                    if (!hasPowerUp(PowerUpType.Shield)) {
                        setPlanetHealth(h => Math.max(0, h - 10));
                    }
                     explosions.current.push({ id: Date.now() + Math.random(), position: s.position, size: s.size*2, life: 300, maxLife: 300 });
                }
                return false;
            }
            return s.position.y < window.innerHeight;
        });
        
        // Move power-ups
        powerUps.current = powerUps.current.filter(p => {
            p.position.y += p.velocity.y * deltaTime;
            if(p.position.y > window.innerHeight - 100) {
                const powerUpDuration = 10000; // 10 seconds
                if (p.type === PowerUpType.Shield) {
                    setActivePowerUps(prev => [...prev.filter(ap => ap.type !== p.type), {type: p.type, duration: Infinity}]);
                } else {
                     setActivePowerUps(prev => [...prev.filter(ap => ap.type !== p.type), {type: p.type, duration: powerUpDuration}]);
                }
                return false;
            }
            return true;
        });

        // Collision detection
        const newProjectiles: Projectile[] = [];
        projectiles.current.forEach(p => {
            let hit = false;
            for (let i = ships.current.length - 1; i >= 0; i--) {
                const s = ships.current[i];
                const dx = p.position.x - s.position.x;
                const dy = p.position.y - s.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < (p.size + s.size) / 2) {
                    hit = true;
                    explosions.current.push({ id: Date.now() + Math.random(), position: s.position, size: s.size, life: 300, maxLife: 300 });
                    if (s.type === 'enemy') {
                        setScore(sc => sc + 10);
                        if (Math.random() < 0.15) { // 15% chance to drop power-up
                             const powerUpTypes = Object.values(PowerUpType);
                             const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                             powerUps.current.push({
                                 id: Date.now(),
                                 type: randomType,
                                 position: s.position,
                                 velocity: {x: 0, y: 0.1},
                                 size: 30
                             })
                        }
                    } else {
                        setScore(sc => Math.max(0, sc - 50));
                        setPlanetHealth(h => Math.max(0, h - 5));
                    }
                    ships.current.splice(i, 1);
                    break;
                }
            }
            if (!hit) newProjectiles.push(p);
        });
        projectiles.current = newProjectiles;
        
        // Update explosions
        explosions.current = explosions.current.filter(e => {
            e.life -= deltaTime;
            return e.life > 0;
        });
        
        // Check for game over
        if (planetHealth <= 0) {
            setFinalScore(score);
            setGameStatus(GameStatus.GameOver);
        }

        setRenderTrigger(r => r + 1);
        requestAnimationFrame(gameLoop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameStatus, planetHealth, score, turretAngle, activePowerUps]);
    
    useEffect(() => {
        if (gameStatus === GameStatus.Playing) {
            requestAnimationFrame(gameLoop);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameStatus]);

    const renderGameContent = () => {
        switch (gameStatus) {
            case GameStatus.StartScreen:
                return <StartScreen onStart={startGame} />;
            case GameStatus.GameOver:
                return <GameOverScreen score={finalScore} onRestart={startGame} />;
            case GameStatus.Playing:
                return (
                    <>
                        <GameUI score={score} planetHealth={planetHealth} activePowerUps={activePowerUps} />
                        <Planet health={planetHealth} hasShield={activePowerUps.some(p => p.type === PowerUpType.Shield)} />
                        <Turret angle={turretAngle} />
                        {ships.current.map(s => <ShipComponent key={s.id} ship={s} />)}
                        {projectiles.current.map(p => <ProjectileComponent key={p.id} projectile={p} />)}
                        {explosions.current.map(e => <ExplosionComponent key={e.id} explosion={e} />)}
                        {powerUps.current.map(p => <PowerUpComponent key={p.id} powerUp={p} />)}
                    </>
                );
        }
    };

    return (
        <div ref={gameAreaRef} className="relative w-full h-full bg-black overflow-hidden cursor-crosshair">
            <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: 'url(https://picsum.photos/seed/space/1920/1080)', filter: 'blur(4px) brightness(0.4)'}}></div>
            {renderGameContent()}
        </div>
    );
};

export default App;