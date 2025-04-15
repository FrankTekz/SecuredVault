import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/slices/userSlice";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Header = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
      <h1 className="text-xl font-bold text-primary flex items-center">
        <i className="fas fa-shield-alt mr-2"></i>
        SecureVault
      </h1>
      <div className="flex items-center">
        {showSearch ? (
          <div className="fixed inset-0 bg-background z-50 p-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search vault..."
                className="flex-1"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearch(false)}
              >
                <i className="fas fa-times"></i>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearch(true)} 
              className="mr-2"
            >
              <i className="fas fa-search"></i>
            </Button>
            <Button 
              variant={isDarkMode ? "default" : "ghost"}
              size="icon" 
              onClick={() => dispatch(toggleDarkMode())}
              className="transition-colors"
            >
              <i className="fas fa-moon"></i>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
