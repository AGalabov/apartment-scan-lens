
import React from "react";
import { ApartmentCard } from "../ApartmentCard";
import { Listing } from "../../types/types";

interface ListingsGridProps {
  listings: Listing[];
  onDelete: (id: string) => void;
}

export const ListingsGrid: React.FC<ListingsGridProps> = ({ listings, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ApartmentCard 
          key={listing.id} 
          listing={listing} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
