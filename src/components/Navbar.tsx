
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart2, Heart, BookOpen, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-5 w-5 mr-2" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="h-5 w-5 mr-2" /> },
    { path: '/discover', label: 'Discover', icon: <Heart className="h-5 w-5 mr-2" /> },
    { path: '/about', label: 'About', icon: <BookOpen className="h-5 w-5 mr-2" /> },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-emotion flex items-center justify-center animate-pulse-slow">
            <span className="text-white font-bold text-xl">E</span>
          </div>
          <span className="font-bold text-xl emotion-gradient-text">Emotion-Verse</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              asChild
              className="flex items-center"
            >
              <Link to={item.path}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-background transition-transform duration-300 ease-in-out transform pt-16",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col space-y-4 p-4">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              asChild
              className="w-full justify-start text-lg py-6"
              onClick={() => setIsOpen(false)}
            >
              <Link to={item.path}>
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
