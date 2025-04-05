
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-emotion flex items-center justify-center">
            <span className="text-white font-bold text-4xl">404</span>
          </div>
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-xl text-muted-foreground">
            Oops! We couldn't find the page you're looking for.
          </p>
          <Button asChild size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </main>
      <footer className="bg-secondary/50 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Emotion-Verse &copy; 2025 | Sentiment Analysis & Emotion Detection
        </p>
      </footer>
    </div>
  );
};

export default NotFound;
