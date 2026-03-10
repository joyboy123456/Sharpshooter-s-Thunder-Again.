import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";

export const TouchControls = () => {
  const setMove = useGameStore((state) => state.setMove);
  const addAimDelta = useGameStore((state) => state.addAimDelta);
  const setFiring = useGameStore((state) => state.setFiring);
  const firing = useGameStore((state) => state.controls.firing);

  // Joystick state
  const joystickRef = useRef(null);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const joystickOrigin = useRef({ x: 0, y: 0 });
  const joystickTouchId = useRef(null);

  // Aim touch state
  const aimTouchId = useRef(null);
  const lastAimPos = useRef({ x: 0, y: 0 });

  const JOYSTICK_MAX_DIST = 50;
  const AIM_SENSITIVITY = 0.005;

  // Handle joystick touch
  const handleJoystickStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    joystickOrigin.current = { x: touch.clientX, y: touch.clientY };
    joystickTouchId.current = touch.identifier;
    setJoystickActive(true);
  };

  const handleJoystickMove = (e) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === joystickTouchId.current) {
        const dx = touch.clientX - joystickOrigin.current.x;
        const dy = touch.clientY - joystickOrigin.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const clampedDist = Math.min(dist, JOYSTICK_MAX_DIST);
        const angle = Math.atan2(dy, dx);

        const clampedX = Math.cos(angle) * clampedDist;
        const clampedY = Math.sin(angle) * clampedDist;

        setJoystickPos({ x: clampedX, y: clampedY });

        // Normalize to -1 to 1
        const moveX = clampedX / JOYSTICK_MAX_DIST;
        const moveZ = clampedY / JOYSTICK_MAX_DIST;
        setMove(moveX, moveZ);
      }
    }
  };

  const handleJoystickEnd = (e) => {
    e.preventDefault();
    let found = false;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === joystickTouchId.current) {
        found = true;
        break;
      }
    }
    if (!found) {
      joystickTouchId.current = null;
      setJoystickActive(false);
      setJoystickPos({ x: 0, y: 0 });
      setMove(0, 0);
    }
  };

  // Handle aim touch (right side of screen)
  const handleAimStart = (e) => {
    e.preventDefault();
    const touch = e.touches[e.touches.length - 1];
    // Only track if on right side of screen
    if (touch.clientX > window.innerWidth / 2) {
      aimTouchId.current = touch.identifier;
      lastAimPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleAimMove = (e) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === aimTouchId.current) {
        const dx = touch.clientX - lastAimPos.current.x;
        const dy = touch.clientY - lastAimPos.current.y;

        addAimDelta(-dx * AIM_SENSITIVITY, dy * AIM_SENSITIVITY);

        lastAimPos.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  const handleAimEnd = (e) => {
    e.preventDefault();
    let found = false;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === aimTouchId.current) {
        found = true;
        break;
      }
    }
    if (!found) {
      aimTouchId.current = null;
    }
  };

  // Keyboard controls for desktop
  useEffect(() => {
    const keys = { w: false, a: false, s: false, d: false };

    const updateMove = () => {
      let moveX = 0;
      let moveZ = 0;
      if (keys.w) moveZ -= 1;
      if (keys.s) moveZ += 1;
      if (keys.a) moveX -= 1;
      if (keys.d) moveX += 1;
      setMove(moveX, moveZ);
    };

    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.w = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.s = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.a = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.d = true;
          break;
        case "Space":
          setFiring(true);
          break;
      }
      updateMove();
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.w = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.s = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.a = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.d = false;
          break;
        case "Space":
          setFiring(false);
          break;
      }
      updateMove();
    };

    // Mouse controls for aiming
    const handleMouseMove = (e) => {
      if (document.pointerLockElement) {
        addAimDelta(-e.movementX * 0.002, e.movementY * 0.002);
      }
    };

    const handleClick = () => {
      document.body.requestPointerLock();
    };

    const handleMouseDown = (e) => {
      if (e.button === 0) {
        setFiring(true);
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        setFiring(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setMove, addAimDelta, setFiring]);

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* Left Joystick */}
      <div
        ref={joystickRef}
        className="absolute bottom-8 left-8 w-32 h-32 pointer-events-auto touch-none"
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        <div className="absolute inset-0 rounded-full bg-white/20 border-2 border-white/40" />
        <div
          className="absolute w-14 h-14 rounded-full bg-white/50 border-2 border-white/70"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) translate(${joystickPos.x}px, ${joystickPos.y}px)`,
          }}
        />
      </div>

      {/* Right Aim Area */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-auto touch-none"
        onTouchStart={handleAimStart}
        onTouchMove={handleAimMove}
        onTouchEnd={handleAimEnd}
        onTouchCancel={handleAimEnd}
      />

      {/* Fire Button */}
      <button
        className={`absolute bottom-8 right-8 w-20 h-20 rounded-full pointer-events-auto touch-none flex items-center justify-center transition-colors ${
          firing
            ? "bg-red-600/80 border-red-400"
            : "bg-red-500/50 border-red-300/50"
        } border-4`}
        onTouchStart={(e) => {
          e.preventDefault();
          setFiring(true);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          setFiring(false);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          setFiring(false);
        }}
      >
        <svg
          className="w-10 h-10 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" />
          <path d="M12 6v2M12 16v2M6 12h2M16 12h2" />
        </svg>
      </button>

      {/* Crosshair */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-1 h-1 bg-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 border border-white/50 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[1px] w-4 h-[2px] bg-white/70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-[1px] -translate-y-1/2 w-[2px] h-4 bg-white/70" />
      </div>
    </div>
  );
};
