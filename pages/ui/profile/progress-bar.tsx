import React, { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const getProgressColor = (progress: number): string => {
    if (progress < 25) return "#f87171"; // Red
    if (progress < 50) return "#ffb84d"; // Orange
    if (progress < 75) return "#ffff66"; // Yellow
    return "#66ff66"; // Green
  };

  // Using React.CSSProperties for typing the style object
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "80%",
    height: "5px",
    backgroundColor: "#e0e0df",
    borderRadius: "5px",
    overflow: "hidden",
  };

  const barStyle: React.CSSProperties = {
    height: "100%",
    backgroundColor: getProgressColor(progressPercent),
    transition: "width 0.5s ease-out",
    width: `${progressPercent}%`,
  };

  useEffect(() => {
    const targetProgress = Number(progress);
    setProgressPercent(0); // Reset progress when `progress` changes

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= targetProgress) {
          clearInterval(interval); // Stop when reaching the target
          return targetProgress;
        }
        return prev + 5; // Adjust this value for animation speed
      });
    }, 100);

    return () => clearInterval(interval); // Cleanup interval on component unmount or when `progress` changes
  }, [progress]); // ✅ Added `progress` as a dependency

  return (
    <div style={containerStyle}>
      <div style={barStyle}></div>
    </div>
  );
};

export default ProgressBar;
