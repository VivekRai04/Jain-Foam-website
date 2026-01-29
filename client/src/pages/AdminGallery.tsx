import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Loader2, Edit2, ArrowLeft } from "lucide-react";

type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image_filename: string;
  image_path: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

const CATEGORIES = [
  "Mattresses",
  "Curtains",
  "Sofas",
  "Wallpapers",
  "Flooring",
  "Carpets",
  "Blinds",
  "Artificial Grass",
];

export default function AdminGallery() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Edit states
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch gallery items
  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const res = await fetch("/api/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery items");
      return res.json() as Promise<GalleryItem[]>;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    },
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          category: editCategory,
        }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({
        title: "Success",
        description: "Gallery item updated successfully",
      });
      setEditingItem(null);
      setEditTitle("");
      setEditCategory("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update gallery item",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEditClick = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editTitle || !editCategory || !editingItem) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    editMutation.mutate(editingItem.id);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !title || !category) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select an image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("title", title);
      formData.append("category", category);

      const res = await fetch("/api/admin/gallery/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      await res.json();

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      // Reset form
      setSelectedFile(null);
      setTitle("");
      setCategory("");
      const fileInput = document.getElementById("image-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh gallery
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Gallery Management</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Upload Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Upload New Image</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter image title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} disabled={uploading}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="image-input">Image File</Label>
              <Input
                id="image-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Gallery Items List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Gallery Items</h2>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No gallery items yet. Upload your first image above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={item.image_path}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Category: {item.category}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(item)}
                        disabled={editMutation.isPending || deleteMutation.isPending}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(item.id)}
                        disabled={deleteMutation.isPending || editMutation.isPending}
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this gallery item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteConfirm) {
                    deleteMutation.mutate(deleteConfirm);
                  }
                }}
                disabled={deleteMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Gallery Item</DialogTitle>
              <DialogDescription>
                Update the title and category for this gallery item.
              </DialogDescription>
            </DialogHeader>
            
            {editingItem && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      placeholder="Enter image title"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      disabled={editMutation.isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={editCategory} 
                      onValueChange={setEditCategory}
                      disabled={editMutation.isPending}
                    >
                      <SelectTrigger id="edit-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingItem(null)}
                    disabled={editMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={editMutation.isPending}
                  >
                    {editMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
