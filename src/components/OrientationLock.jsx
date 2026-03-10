import { useEffect, useState } from "react";

export const OrientationLock = ({ children }) => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(mobile);

      if (mobile) {
        setIsPortrait(window.innerHeight > window.innerWidth);
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    // Try to lock orientation on mobile
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock("landscape").catch(() => {
        // Orientation lock not supported or denied
      });
    }

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (isMobile && isPortrait) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="text-white text-center p-8">
          <svg
            className="w-24 h-24 mx-auto mb-6 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12l4-4m0 0l4 4m-4-4v12"
              transform="rotate(90 12 12)"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-4">Please Rotate Your Device</h2>
          <p className="text-gray-400">
            This game is best experienced in landscape mode
          </p>
        </div>
      </div>
    );
  }

  return children;
};
