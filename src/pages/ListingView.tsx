import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Edit2, Save } from "lucide-react";
import { loadListings, saveListings } from "../utils/storage";
import { TagInput } from "../components/TagInput";
import { useToast } from "@/components/ui/use-toast";

const ListingView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const listings = loadListings().offers;
  const listing = listings.find((l) => l.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(listing?.title || "");
  const [editedTags, setEditedTags] = useState(listing?.tags || []);

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

  const handleSave = () => {
    const updatedListings = listings.map((l) =>
      l.id === id
        ? {
            ...l,
            title: editedTitle,
            tags: editedTags,
          }
        : l
    );
    saveListings({ offers: updatedListings });
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to listings
          </Button>
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-xl font-bold"
            />
            <TagInput tags={editedTags} onTagsChange={setEditedTags} />
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">{listing.title}</h1>
            <div className="flex gap-2">
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>

      <iframe
        src={listing.url}
        className="w-full h-[calc(100vh-200px)] border rounded-lg"
        title={listing.title}
      />
    </div>
  );
};

export default ListingView;