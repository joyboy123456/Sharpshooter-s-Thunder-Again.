import { useGameStore } from "../store/gameStore";

export const GameUI = () => {
  const player = useGameStore((state) => state.player);
  const enemies = useGameStore((state) => state.enemies);

  const aliveEnemies = enemies.filter((e) => !e.dead).length;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Health bar - top left */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <div
          className="w-48 h-6 relative"
          style={{
            background: "rgba(0,0,0,0.7)",
            border: "2px solid #c4a35a",
          }}
        >
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              width: `${player.health}%`,
              background: player.health > 30
                ? "linear-gradient(180deg, #4a7c4a 0%, #2d4a2d 100%)"
                : "linear-gradient(180deg, #8b0000 0%, #5c0000 100%)",
            }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
            style={{ color: "#c4a35a" }}
          >
            {player.health} / 100
          </span>
        </div>
      </div>

      {/* Stats - top right */}
      <div
        className="absolute top-4 right-4 px-4 py-2 text-right"
        style={{
          background: "rgba(0,0,0,0.7)",
          border: "2px solid #c4a35a",
        }}
      >
        <div className="flex gap-6">
          <div>
            <span className="text-xs" style={{ color: "#888" }}>KILLS</span>
            <p className="text-2xl font-bold" style={{ color: "#c4a35a" }}>
              {player.kills}
            </p>
          </div>
          <div>
            <span className="text-xs" style={{ color: "#888" }}>DEATHS</span>
            <p className="text-2xl font-bold" style={{ color: "#8b0000" }}>
              {player.deaths}
            </p>
          </div>
          <div>
            <span className="text-xs" style={{ color: "#888" }}>ENEMIES</span>
            <p className="text-2xl font-bold" style={{ color: "#4a7c4a" }}>
              {aliveEnemies}
            </p>
          </div>
        </div>
      </div>

      {/* Death screen */}
      {player.dead && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <h2
              className="text-5xl font-black mb-4"
              style={{ color: "#8b0000", textShadow: "0 0 20px rgba(139,0,0,0.5)" }}
            >
              YOU DIED
            </h2>
            <p style={{ color: "#888" }}>Respawning...</p>
          </div>
        </div>
      )}

      {/* Ammo indicator - bottom right (above fire button on mobile) */}
      <div
        className="absolute bottom-32 right-4 md:bottom-4 px-4 py-2"
        style={{
          background: "rgba(0,0,0,0.7)",
          border: "2px solid #c4a35a",
        }}
      >
        <span className="text-xs" style={{ color: "#888" }}>AMMO</span>
        <p className="text-xl font-bold" style={{ color: "#c4a35a" }}>
          INF
        </p>
      </div>
    </div>
  );
};
