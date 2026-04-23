import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 — Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="font-display text-4xl font-semibold mt-2">Lost in traffic</h1>
        <p className="text-muted-foreground mt-3">The page you're looking for doesn't exist or has been re-routed.</p>
        <Link to="/"><Button className="mt-6 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">Back to home</Button></Link>
      </div>
    </div>
  );
};

export default NotFound;
