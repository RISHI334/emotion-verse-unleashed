
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Menu, X, Home, Activity, Lightbulb, Info, Brain } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const NavItems = () => (
    <>
      <NavLink href="/" label="Home" icon={<Home />} />
      <NavLink href="/dashboard" label="Dashboard" icon={<Activity />} />
      <NavLink href="/discover" label="Discover" icon={<Lightbulb />} />
      <NavLink href="/train" label="Train Model" icon={<Brain />} />
      <NavLink href="/about" label="About" icon={<Info />} />
    </>
  );

  const NavLink = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => {
    const isActive = location.pathname === href;
    return (
      <Link to={href} onClick={() => setIsOpen(false)}>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          className={`w-full justify-start ${isActive ? 'bg-primary/10 hover:bg-primary/20' : ''}`}
        >
          {icon}
          <span className="ml-2">{label}</span>
        </Button>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex items-center justify-between py-3">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground"
        >
          <Activity className="h-6 w-6 text-primary" />
          <span>Emotion-Verse</span>
        </Link>

        {isMobile ? (
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90%] px-4 pt-4">
              <div className="mt-2 flex flex-col gap-2">
                <NavItems />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <nav className="flex items-center gap-2">
            <NavItems />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
