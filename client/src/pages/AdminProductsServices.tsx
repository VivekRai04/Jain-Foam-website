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
import { Textarea } from "@/components/ui/textarea";
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

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
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

export default function AdminProductsServices() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Edit states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json() as Promise<Product[]>;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setDeleteConfirm(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          category: editCategory,
          description: editDescription,
        }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setEditingProduct(null);
      setEditName("");
      setEditCategory("");
      setEditDescription("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product",
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

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditDescription(product.description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editName || !editCategory || !editDescription || !editingProduct) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    editMutation.mutate(editingProduct.id);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !name || !category || !description) {
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
      formData.append("name", name);
      formData.append("category", category);
      formData.append("description", description);

      const res = await fetch("/api/admin/products/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      await res.json();

      toast({
        title: "Success",
        description: "Product uploaded successfully",
      });

      // Reset form
      setSelectedFile(null);
      setName("");
      setCategory("");
      setDescription("");
      const fileInput = document.getElementById("image-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      // Refresh products
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload product",
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
          <h1 className="text-4xl font-bold">Products & Services Management</h1>
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
          <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="image-input">Product Image</Label>
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
                  Add Product
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Products List */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Products & Services</h2>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No products yet. Add your first product above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image_path}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Category: {product.category}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(product)}
                        disabled={editMutation.isPending || deleteMutation.isPending}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteConfirm(product.id)}
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
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
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
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the product details.
              </DialogDescription>
            </DialogHeader>

            {editingProduct && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Product Name</Label>
                    <Input
                      id="edit-name"
                      placeholder="Enter product name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
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

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Enter product description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    disabled={editMutation.isPending}
                    className="min-h-[120px]"
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingProduct(null)}
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
