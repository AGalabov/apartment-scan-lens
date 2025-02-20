import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Edit2, Save, ExternalLink } from "lucide-react";
import { loadListings, saveListings } from "../utils/storage";
import { TagInput } from "../components/TagInput";
import { useToast } from "@/components/ui/use-toast";
import { TraitSelect } from "../components/TraitSelect";

const ListingView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const listingsState = loadListings();
  const listing = listingsState.offers.find((l) => l.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(listing?.title || "");
  const [editedTags, setEditedTags] = useState(listing?.tags || []);
  const [editedTraits, setEditedTraits] = useState(listing?.traits || {});
  const [newTrait, setNewTrait] = useState("");

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
    const updatedListings = listingsState.offers.map((l) =>
      l.id === id
        ? {
            ...l,
            title: editedTitle,
            tags: editedTags,
            traits: editedTraits,
          }
        : l
    );
    saveListings({ 
      offers: updatedListings,
      traits: listingsState.traits
    });
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully",
    });
  };

  const addNewTrait = () => {
    if (newTrait.trim() && !listingsState.traits.includes(newTrait.trim())) {
      const updatedTraits = [...listingsState.traits, newTrait.trim()];
      saveListings({
        offers: listingsState.offers,
        traits: updatedTraits,
      });
      setEditedTraits((current) => ({ ...current, [newTrait]: null }));
      setNewTrait("");
    }
  };

  const handleNewTraitKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addNewTrait();
    }
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
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => window.open(listing.url, '_blank')}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Go to listing
          </Button>
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Traits</h3>
              <div className="grid gap-4">
                {listingsState.traits.map((trait) => (
                  <TraitSelect
                    key={trait}
                    trait={trait}
                    value={editedTraits[trait] || null}
                    onChange={(value) =>
                      setEditedTraits((prev) => ({ ...prev, [trait]: value }))
                    }
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="New trait"
                  value={newTrait}
                  onChange={(e) => setNewTrait(e.target.value)}
                  onKeyDown={handleNewTraitKeyPress}
                />
                <Button type="button" onClick={addNewTrait}>
                  Add Trait
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">{listing.title}</h1>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            {listing.traits && Object.entries(listing.traits).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(listing.traits).map(([trait, value]) => {
                    if (value === null) return null;
                    return (
                      <Badge
                        key={trait}
                        variant="outline"
                        className={value === "YES" ? "text-green-600" : "text-red-600"}
                      >
                        {trait}: {value === "YES" ? "Yes" : "No"}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
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
