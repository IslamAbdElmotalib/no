
export interface Vector2D {
  x: number;
  y: number;
}

export interface GameObject {
  id: number;
  position: Vector2D;
  size: number;
}

export interface Ship extends GameObject {
  type: 'enemy' | 'friendly';
  health: number;
  velocity: Vector2D;
}

export interface Projectile extends GameObject {
  velocity: Vector2D;
}

export interface Explosion extends GameObject {
  life: number; // countdown to disappear
  maxLife: number;
}

export enum PowerUpType {
  RapidFire = 'RAPID_FIRE',
  Shield = 'SHIELD',
  MultiShot = 'MULTI_SHOT',
}

export interface PowerUp extends GameObject {
  type: PowerUpType;
  velocity: Vector2D;
}

export interface ActivePowerUp {
    type: PowerUpType;
    duration: number;
}

export enum GameStatus {
  StartScreen,
  Playing,
  GameOver,
}
