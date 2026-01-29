import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogOut, Eye, Image } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  // Check if admin is authenticated
  const { error } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/check");
      return res.json();
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      navigate("/admin/login");
    } catch (error) {
      // Even if logout fails, redirect
      navigate("/admin/login");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground mb-4">
                You need to log in to access the admin dashboard.
              </p>
              <Button onClick={() => navigate("/admin/login")}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/enquiries")}>
            <CardHeader className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>View Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                View and manage customer enquiries from the contact form.
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => alert("Manage Images functionality coming soon!")}>
            <CardHeader className="text-center">
              <Image className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>Manage Images</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Upload, edit, and manage images on the website.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}