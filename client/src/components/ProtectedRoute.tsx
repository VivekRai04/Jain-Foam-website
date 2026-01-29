import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/check");
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
          if (!data.authenticated) {
            navigate("/admin/login");
          }
        } else {
          setIsAuthenticated(false);
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

