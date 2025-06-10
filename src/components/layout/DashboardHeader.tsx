
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, LogOut, Settings, Home, FileText, CreditCard, BarChart, Users } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Customers', href: '/dashboard/customers', icon: <Users className="w-4 h-4 mr-2" /> },
    { name: 'Invoices', href: '/invoices', icon: <FileText className="w-4 h-4 mr-2" /> },
    { name: 'Expenses', href: '/dashboard/expenses', icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { name: 'Reports', href: '/reports', icon: <BarChart className="w-4 h-4 mr-2" /> },
  ];

  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "?";
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">FinTrackr</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href || 
                (link.href !== '/dashboard' && location.pathname.startsWith(link.href));
              return (
                <Button 
                  key={link.name} 
                  variant={isActive ? "default" : "ghost"}
                  asChild
                  className={isActive ? "bg-primary text-primary-foreground" : ""}
                >
                  <Link to={link.href}>
                    {link.icon}
                    {link.name}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage alt={user?.firstName} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="text-xl font-bold tracking-tight">FinTrackr</span>
                </Link>
                <nav className="mt-8 flex flex-col space-y-3">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.href || 
                      (link.href !== '/dashboard' && location.pathname.startsWith(link.href));
                    return (
                      <Button
                        key={link.name}
                        variant={isActive ? "default" : "ghost"}
                        className={`justify-start ${isActive ? "bg-primary text-primary-foreground" : ""}`}
                        asChild
                      >
                        <Link to={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                          {link.icon}
                          {link.name}
                        </Link>
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
