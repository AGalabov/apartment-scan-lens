import React from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { loadListings } from "../utils/storage";

const ListingView = () => {
  const { id } = useParams();
  const listing = loadListings().offers.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="p-4">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Button>
        </Link>
        <p className="text-center mt-8">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Button>
        </Link>
        <div className="flex gap-2">
          {listing.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <iframe
        src={listing.url}
        className="w-full h-[calc(100vh-120px)] border rounded-lg"
        title={listing.title}
      />
    </div>
  );
};

export default ListingView;