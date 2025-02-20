
import React, { useState, useEffect } from "react";
import { AddListingModal } from "../components/AddListingModal";
import { ApartmentCard } from "../components/ApartmentCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload, Filter } from "lucide-react";
import { Listing } from "../types/types";
import { loadListings, saveListings, exportListings, importListings } from "../utils/storage";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TraitSelect } from "@/components/TraitSelect";

const Index = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [traits, setTraits] = useState<string[]>([]);
  const [traitFilters, setTraitFilters] = useState<Record<string, "YES" | "NO" | null>>({});
  const { toast } = useToast();

  useEffect(() => {
    const data = loadListings();
    setListings(data.offers);
    setTraits(data.traits);
  }, []);

  const handleAddListing = (newListing: Omit<Listing, "id">) => {
    const listing: Listing = {
      ...newListing,
      id: crypto.randomUUID(),
    };
    
    // Update traits list if new ones were added
    const updatedTraits = [...traits];
    if (newListing.traits) {
      Object.keys(newListing.traits).forEach(trait => {
        if (!updatedTraits.includes(trait)) {
          updatedTraits.push(trait);
        }
      });
    }
    
    const updatedListings = [...listings, listing];
    setListings(updatedListings);
    setTraits(updatedTraits);
    saveListings({ offers: updatedListings, traits: updatedTraits });
  };

  const handleDeleteListing = (id: string) => {
    const updatedListings = listings.filter(listing => listing.id !== id);
    setListings(updatedListings);
    saveListings({ offers: updatedListings, traits });
    toast({
      title: "Listing deleted",
      description: "The listing has been removed successfully",
    });
  };

  const allTags = Array.from(
    new Set(listings.flatMap((listing) => listing.tags))
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  const filteredListings = listings.filter((listing) => {
    // Filter by tags
    if (selectedTags.length > 0 && !selectedTags.every((tag) => listing.tags.includes(tag))) {
      return false;
    }
    
    // Filter by traits
    for (const [trait, value] of Object.entries(traitFilters)) {
      if (value === null) continue;
      if (listing.traits?.[trait] !== value) {
        return false;
      }
    }
    
    return true;
  });

  const handleExport = () => {
    const json = exportListings();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apartment-listings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Export successful",
      description: "Your listings have been exported to JSON",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importListings(content)) {
          const data = loadListings();
          setListings(data.offers);
          setTraits(data.traits);
          toast({
            title: "Import successful",
            description: "Your listings have been imported",
          });
        } else {
          toast({
            title: "Import failed",
            description: "Invalid file format",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center sticky top-0 bg-background z-10 py-4 border-b">
        <h1 className="text-2xl font-bold">Apartment Listings</h1>
        <div className="flex gap-4">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <label>
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <Button variant="outline" className="gap-2" asChild>
              <span>
                <Upload className="h-4 w-4" />
                Import
              </span>
            </Button>
          </label>
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
              <div className="mt-4 space-y-4 overflow-y-auto h-[calc(100vh-200px)] pr-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
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
                          onChange={(value) =>
                            setTraitFilters((prev) => ({ ...prev, [trait]: value }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <AddListingModal onAdd={handleAddListing} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <ApartmentCard 
            key={listing.id} 
            listing={listing} 
            onDelete={handleDeleteListing}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
