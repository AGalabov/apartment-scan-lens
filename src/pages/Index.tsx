
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Listing } from "../types/types";
import { loadListings, saveListings, exportListings, importListings } from "../utils/storage";
import { ListingActions } from "../components/listing/ListingActions";
import { ListingsGrid } from "../components/listing/ListingsGrid";

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

  const handleTraitFilterChange = (trait: string, value: "YES" | "NO" | null) => {
    setTraitFilters(prev => ({ ...prev, [trait]: value }));
  };

  const filteredListings = listings.filter((listing) => {
    if (selectedTags.length > 0 && !selectedTags.every((tag) => listing.tags.includes(tag))) {
      return false;
    }
    
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Apartment Listings</h1>
        <ListingActions
          onExport={handleExport}
          onImport={handleImport}
          allTags={allTags}
          selectedTags={selectedTags}
          onTagToggle={toggleTag}
          traits={traits}
          traitFilters={traitFilters}
          onTraitFilterChange={handleTraitFilterChange}
          onAddListing={handleAddListing}
        />
      </div>
      <ListingsGrid 
        listings={filteredListings}
        onDelete={handleDeleteListing}
      />
    </div>
  );
};

export default Index;
