
import React from 'react';

interface GameOverScreenProps {
    score: number;
    onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black bg-opacity-70">
            <h1 className="text-8xl font-black uppercase tracking-widest text-red-500 mb-4" style={{ textShadow: '0 0 15px #dc2626, 0 0 25px #dc2626' }}>
                Game Over
            </h1>
            <p className="text-4xl text-gray-300 mb-8">
                Your Final Score: <span className="font-bold text-yellow-400">{score}</span>
            </p>
            <button
                onClick={onRestart}
                className="px-12 py-6 bg-green-600 text-white text-3xl font-bold rounded-lg shadow-lg hover:bg-green-500 transition-all duration-300"
                style={{ boxShadow: '0 0 20px #16a34a' }}
            >
                Play Again
            </button>
        </div>
    );
};

export default GameOverScreen;
