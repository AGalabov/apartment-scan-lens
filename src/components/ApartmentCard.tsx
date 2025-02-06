import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Listing } from "../types/types";

interface ApartmentCardProps {
  listing: Listing;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ listing }) => {
  return (
    <Link to={`/listing/${listing.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">{listing.title}</CardTitle>
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