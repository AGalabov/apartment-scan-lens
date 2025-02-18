
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <Select
        value={value?.toString() || ""}
        onValueChange={(val) => {
          if (val === "") onChange(null);
          else onChange(val as "YES" | "NO");
        }}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Unknown" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Unknown</SelectItem>
          <SelectItem value="YES">Yes</SelectItem>
          <SelectItem value="NO">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
