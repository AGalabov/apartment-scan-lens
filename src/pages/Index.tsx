import React, { useState, useEffect } from "react";
import { AddListingModal } from "../components/AddListingModal";
import { ApartmentCard } from "../components/ApartmentCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Download, Upload } from "lucide-react";
import { Listing } from "../types/types";
import { loadListings, saveListings, exportListings, importListings } from "../utils/storage";

const Index = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setListings(loadListings().offers);
  }, []);

  const handleAddListing = (newListing: Omit<Listing, "id">) => {
    const listing: Listing = {
      ...newListing,
      id: crypto.randomUUID(),
    };
    const updatedListings = [...listings, listing];
    setListings(updatedListings);
    saveListings({ offers: updatedListings });
  };

  const handleDeleteListing = (id: string) => {
    const updatedListings = listings.filter(listing => listing.id !== id);
    setListings(updatedListings);
    saveListings({ offers: updatedListings });
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

  const filteredListings = listings.filter((listing) =>
    selectedTags.length === 0
      ? true
      : selectedTags.every((tag) => listing.tags.includes(tag))
  );

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
          setListings(loadListings().offers);
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
          <AddListingModal onAdd={handleAddListing} />
        </div>
      </div>

      {allTags.length > 0 && (
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
      )}

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