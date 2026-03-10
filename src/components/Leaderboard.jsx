import { useGameStore } from "../store/gameStore";

export const Leaderboard = () => {
  const player = useGameStore((state) => state.player);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 p-4 flex z-10 gap-4">
        <div className="bg-white bg-opacity-60 backdrop-blur-sm flex items-center rounded-lg gap-2 p-2 min-w-[140px]">
          <div
            className="w-10 h-10 border-2 rounded-full flex items-center justify-center bg-blue-500"
            style={{ borderColor: "#4a90d9" }}
          >
            <span className="text-white font-bold">P</span>
          </div>
          <div className="flex-grow">
            <h2 className="font-bold text-sm">Player</h2>
            <div className="flex text-sm items-center gap-4">
              <p>Kills: {player.kills}</p>
              <p>Deaths: {player.deaths}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="fixed top-4 right-4 z-10 text-white"
        onClick={() => {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            document.documentElement.requestFullscreen();
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      </button>
    </>
  );
};
