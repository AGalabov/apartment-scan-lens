
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TraitSelect } from "@/components/TraitSelect";

interface ListingFiltersProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  traits: string[];
  traitFilters: Record<string, "YES" | "NO" | null>;
  onTraitFilterChange: (trait: string, value: "YES" | "NO" | null) => void;
}

export const ListingFilters: React.FC<ListingFiltersProps> = ({
  allTags,
  selectedTags,
  onTagToggle,
  traits,
  traitFilters,
  onTraitFilterChange,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Filter listings by tags and traits
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          {traits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Traits</h3>
              <div className="space-y-2">
                {traits.map((trait) => (
                  <TraitSelect
                    key={trait}
                    trait={trait}
                    value={traitFilters[trait] || null}
                    onChange={(value) => onTraitFilterChange(trait, value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
