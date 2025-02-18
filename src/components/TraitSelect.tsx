
import React from "react";

interface TraitSelectProps {
  trait: string;
  value: "YES" | "NO" | null;
  onChange: (value: "YES" | "NO" | null) => void;
}

export const TraitSelect: React.FC<TraitSelectProps> = ({
  trait,
  value,
  onChange,
}) => {
  const handleClick = (clickedValue: "YES" | "NO" | null) => {
    // Cycle through states based on current value
    if (value === clickedValue) {
      onChange(null);
    } else {
      onChange(clickedValue);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="min-w-32">{trait}</span>
      <div className="relative inline-flex h-8 rounded-full bg-gray-100">
        <button
          type="button"
          onClick={() => handleClick("NO")}
          className={`relative flex-1 px-4 rounded-l-full transition-colors ${
            value === "NO"
              ? "bg-red-500 text-white"
              : "hover:bg-red-100 text-red-700"
          }`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => handleClick(null)}
          className={`relative flex-1 px-4 transition-colors ${
            value === null
              ? "bg-gray-500 text-white"
              : "hover:bg-gray-200 text-gray-700"
          }`}
        >
          ?
        </button>
        <button
          type="button"
          onClick={() => handleClick("YES")}
          className={`relative flex-1 px-4 rounded-r-full transition-colors ${
            value === "YES"
              ? "bg-green-500 text-white"
              : "hover:bg-green-100 text-green-700"
          }`}
        >
          Yes
        </button>
      </div>
    </div>
  );
};
