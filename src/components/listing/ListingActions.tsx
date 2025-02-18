
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";
import { AddListingModal } from "../AddListingModal";
import { ListingFilters } from "./ListingFilters";

interface ListingActionsProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  traits: string[];
  traitFilters: Record<string, "YES" | "NO" | null>;
  onTraitFilterChange: (trait: string, value: "YES" | "NO" | null) => void;
  onAddListing: (newListing: any) => void;
}

export const ListingActions: React.FC<ListingActionsProps> = ({
  onExport,
  onImport,
  allTags,
  selectedTags,
  onTagToggle,
  traits,
  traitFilters,
  onTraitFilterChange,
  onAddListing,
}) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onExport} variant="outline" className="gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
      <label>
        <Input
          type="file"
          accept=".json"
          onChange={onImport}
          className="hidden"
        />
        <Button variant="outline" className="gap-2" asChild>
          <span>
            <Upload className="h-4 w-4" />
            Import
          </span>
        </Button>
      </label>
      <ListingFilters
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={onTagToggle}
        traits={traits}
        traitFilters={traitFilters}
        onTraitFilterChange={onTraitFilterChange}
      />
      <AddListingModal onAdd={onAddListing} />
    </div>
  );
};
