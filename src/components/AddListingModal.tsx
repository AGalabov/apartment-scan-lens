import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagInput } from "./TagInput";
import { Listing } from "../types/types";
import { Plus } from "lucide-react";
import { fetchMetadata } from "../utils/metadataService";
import { useToast } from "@/components/ui/use-toast";

interface AddListingModalProps {
  onAdd: (listing: Omit<Listing, "id">) => void;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({ onAdd }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUrlMetadata = async (url: string) => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const metadata = await fetchMetadata(url);
      console.log('Fetched metadata:', metadata);
      
      if (metadata.title) {
        setTitle(metadata.title);
      }
      if (metadata.imageUrl) {
        setImageUrl(metadata.imageUrl);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      toast({
        title: "Error",
        description: "Failed to fetch URL metadata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (url.trim()) {
        fetchUrlMetadata(url);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      onAdd({ title, url, tags, imageUrl });
      setTitle("");
      setUrl("");
      setImageUrl("");
      setTags([]);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="URL"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imageUrl}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <TagInput tags={tags} onTagsChange={setTags} />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Add Listing"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};