
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, Check, X } from "lucide-react";
import { Listing } from "../types/types";

interface ApartmentCardProps {
  listing: Listing;
  onDelete: (id: string) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ listing, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
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
          {listing.traits && Object.entries(listing.traits).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(listing.traits).map(([trait, value]) => {
                if (value === null) return null;
                return (
                  <Badge
                    key={trait}
                    variant="outline"
                    className={`flex items-center gap-1 ${
                      value === "YES" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trait}
                    {value === "YES" ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
};
