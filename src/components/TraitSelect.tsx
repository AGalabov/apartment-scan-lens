
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
  return (
    <div className="flex items-center gap-2">
      <span className="min-w-32">{trait}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(value === "YES" ? null : "YES")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === "YES"
              ? "bg-green-500 text-white"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(value === "NO" ? null : "NO")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === "NO"
              ? "bg-red-500 text-white"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            value === null
              ? "bg-gray-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Unknown
        </button>
      </div>
    </div>
  );
};
