import React from "react";
import Lottie from "lottie-react";
import animationData from "@/assets/lottie/AnimationRobot.json";

interface AIRobotLoadingProps {
  size?: number;
  message?: string;
}

const AIRobotLoading: React.FC<AIRobotLoadingProps> = ({
  size = 48,
  message = "Mira đang suy nghĩ...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 animate-fadeIn">
      <div
        className="relative rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-gradient-to-br from-emerald-400/30 to-violet-500/30 backdrop-blur-md"
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Lottie
            animationData={animationData}
            loop
            style={{ width: size * 0.8, height: size * 0.8 }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-300 animate-pulse">{message}</p>
    </div>
  );
};

export default AIRobotLoading;
