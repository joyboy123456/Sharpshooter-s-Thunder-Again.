import { useState } from "react";

export const StartScreen = ({ onStart }) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = () => {
    setIsStarting(true);
    setTimeout(() => {
      onStart();
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
        isStarting ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Title */}
        <div className="mb-8">
          <h1
            className="text-6xl md:text-8xl font-black tracking-wider mb-2"
            style={{
              color: "#c4a35a",
              textShadow: "0 4px 8px rgba(0,0,0,0.5), 0 0 40px rgba(196,163,90,0.3)",
              fontFamily: "'Impact', sans-serif",
            }}
          >
            SHARPSHOOTER
          </h1>
          <h2
            className="text-4xl md:text-6xl font-bold tracking-widest"
            style={{
              color: "#8b0000",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              fontFamily: "'Impact', sans-serif",
            }}
          >
            THUNDER
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl mb-12 tracking-wide"
          style={{ color: "#888" }}
        >
          First Person Shooter
        </p>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="relative px-12 py-4 text-2xl font-bold tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(180deg, #8b0000 0%, #5c0000 100%)",
            color: "#c4a35a",
            border: "3px solid #c4a35a",
            boxShadow: "0 4px 15px rgba(139,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          START MISSION
          <div
            className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity"
            style={{ background: "white" }}
          />
        </button>

        {/* Controls hint */}
        <div className="mt-12 text-sm" style={{ color: "#666" }}>
          <p className="mb-2">Desktop: WASD to move, Mouse to aim, Click to fire</p>
          <p>Mobile: Left joystick to move, Right side to aim, Fire button to shoot</p>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, transparent, #c4a35a, transparent)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: "linear-gradient(90deg, transparent, #8b0000, transparent)",
        }}
      />
    </div>
  );
};
