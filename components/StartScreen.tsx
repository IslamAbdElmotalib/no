import React from 'react';

interface StartScreenProps {
    onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-white bg-black bg-opacity-50">
            <h1 className="text-8xl font-black uppercase tracking-widest mb-4" style={{ textShadow: '0 0 15px #0ea5e9, 0 0 25px #0ea5e9' }}>
                Planet Guardian
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-2xl text-center">
                Your mission is to protect Earth from incoming hostile fleets. Use your mouse or finger to aim and fire. Avoid hitting friendly shuttles!
            </p>
            <div className="p-4 rounded-lg bg-gray-800 border border-gray-600 text-lg mb-12">
                <h3 className="text-xl font-bold text-center mb-2 text-cyan-400">Controls</h3>
                <p><span className="font-bold">Aim & Fire:</span> Move Mouse / Drag Finger</p>
                <p className="text-sm text-gray-400 mt-1">The turret fires automatically as you move.</p>
            </div>
            <button
                onClick={onStart}
                className="px-12 py-6 bg-sky-500 text-white text-3xl font-bold rounded-lg shadow-lg hover:bg-sky-400 transition-all duration-300 animate-pulse"
                style={{ boxShadow: '0 0 20px #0ea5e9' }}
            >
                START MISSION
            </button>
        </div>
    );
};

export default StartScreen;