import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="glass max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          {/* 404 Animation */}
          <div className="relative">
            <div className="text-8xl font-bold text-gradient opacity-20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gradient">Page Not Found</h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Current Path Info */}
          <div className="text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
            <span className="font-mono">{location.pathname}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => window.history.back()}
              variant="outline" 
              className="glass border-primary/30 hover:bg-primary/10 flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
              className="btn-glow bg-gradient-primary border-0 flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </div>

          {/* Fun Message */}
          <div className="text-sm text-accent">
            Don't worry, even data scientists get lost sometimes! 🔍
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
