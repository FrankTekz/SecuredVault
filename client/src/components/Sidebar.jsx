import { useState } from "react";
import { useLocation } from "wouter";
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/slices/userSlice";
import SearchBar from "./SearchBar";

const Sidebar = () => {
  const [location] = useLocation();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.user.darkMode);

  const navItems = [
    { path: '/vault', icon: 'fas fa-vault', label: 'Vault' },
    { path: '/dark-web-scan', icon: 'fas fa-shield-alt', label: 'Dark Web Scan' },
    { path: '/password-generator', icon: 'fas fa-key', label: 'Password Generator' },
    { path: '/secured-notes', icon: 'fas fa-sticky-note', label: 'Secured Notes' },
  ];

  const isActive = (path) => location === path;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border h-full bg-background">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary flex items-center">
            <i className="fas fa-shield-alt mr-2"></i>
            SecureVault
          </h1>
          <Button 
            variant={isDarkMode ? "default" : "ghost"}
            size="icon" 
            onClick={() => dispatch(toggleDarkMode())}
            className="p-2 transition-colors"
          >
            <i className="fas fa-moon"></i>
          </Button>
        </div>
        <div className="mt-4">
          <SearchBar />
        </div>
      </div>
      
      <NavigationMenu className="flex-1 max-w-full p-0 py-4 px-3">
        <NavigationMenuList className="flex flex-col space-y-2 w-full">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.path} className="w-full">
              <NavigationMenuLink
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full ${
                  isActive(item.path)
                    ? "bg-primary bg-opacity-10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <i className={`${item.icon} w-5 h-5`}></i>
                <span>{item.label}</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="p-4 border-t border-border">
        <a
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
            isActive('/settings')
              ? "bg-primary bg-opacity-10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <i className="fas fa-cog w-5 h-5"></i>
          <span>Settings</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
