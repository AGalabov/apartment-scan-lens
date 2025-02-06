import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Listing } from "../types/types";

interface ApartmentCardProps {
  listing: Listing;
  onDelete: (id: string) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ listing, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking delete
    onDelete(listing.id);
  };

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="hover:shadow-lg transition-shadow group">
        {listing.imageUrl && (
          <div className="relative aspect-video">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="object-cover w-full h-full rounded-t-lg"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{listing.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {listing.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};