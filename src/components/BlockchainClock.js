import React, { useState, useEffect } from "react";

const BlockchainClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [latestBlock, setLatestBlock] = useState(0);
    const [networkSpeed, setNetworkSpeed] = useState("50 TPS");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
            setLatestBlock(prev => prev + 1);
            setNetworkSpeed((Math.random() * 5 + 45).toFixed(1) + " TPS");
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (time) => {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-teal-500/30 shadow-lg text-teal-400 font-mono text-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs">NETWORK TIME</span>
                <span className="text-yellow-400 text-xs animate-pulse">● LIVE</span>
            </div>

            <div className="text-2xl font-bold text-white mb-2 tracking-widest text-center border-b border-gray-700 pb-2">
                {formatTime(currentTime)}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                    <span className="text-gray-500 block">Current Block</span>
                    <span className="text-teal-300">#{(15000000 + latestBlock).toLocaleString()}</span>
                </div>
                <div className="text-right">
                    <span className="text-gray-500 block">Height</span>
                    <span className="text-blue-300">ETH Mainnet</span>
                </div>
            </div>

            {/* Visual Blockchain Animation */}
            <div className="mt-3 flex space-x-1 justify-center opacity-70">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-sm ${i === 4 ? "bg-teal-400 animate-ping" : "bg-gray-600"}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainClock;
