import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/slices/userSlice";
import { setSearchQuery, clearSearchQuery } from "@/slices/searchSlice";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

const Header = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.user.darkMode);
  const globalSearchQuery = useSelector((state) => state.search.query);
  const [showSearch, setShowSearch] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const credentials = useSelector((state) => state.credentials.items);
  const [searchResults, setSearchResults] = useState([]);
  
  // Only show search button when on the vault page
  const isVaultPage = location === "/vault";
  
  // Initialize local search with global search when modal opens
  useEffect(() => {
    if (showSearch) {
      setLocalSearchQuery(globalSearchQuery);
    }
  }, [showSearch, globalSearchQuery]);
  
  // Handle search when query changes
  useEffect(() => {
    if (localSearchQuery) {
      const results = credentials.filter(cred => 
        cred.title?.toLowerCase().includes(localSearchQuery.toLowerCase()) || 
        cred.username?.toLowerCase().includes(localSearchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [localSearchQuery, credentials]);
  
  // Navigate to vault page with search applied
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery) {
      dispatch(setSearchQuery(localSearchQuery));
      if (location !== "/vault") {
        navigate("/vault");
      }
      setShowSearch(false);
    }
  };
  
  const handleResultClick = (result) => {
    dispatch(setSearchQuery(result.title)); // Set search to the item title
    navigate("/vault");
    setShowSearch(false);
  };
  
  return (
    <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
      <h1 className="text-xl font-bold text-primary flex items-center">
        <i className="fas fa-shield-alt mr-2"></i>
        SecuredVault
      </h1>
      <div className="flex items-center">
        {showSearch ? (
          <div className="fixed inset-0 bg-background z-50 p-4">
            <form onSubmit={handleSearchSubmit} className="flex flex-col h-full">
              <div className="flex items-center gap-2 mb-4">
                <Input
                  type="text"
                  placeholder="Search by title or username..."
                  className="flex-1"
                  autoFocus
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={() => {
                    setShowSearch(false);
                    setLocalSearchQuery("");
                  }}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>
              
              {searchResults.length > 0 && (
                <div className="flex-1 overflow-auto">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                  </h3>
                  <div className="space-y-2">
                    {searchResults.map(result => (
                      <div 
                        key={result.id} 
                        className="p-3 rounded-md border border-border hover:bg-accent cursor-pointer"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="font-medium">{result.title}</div>
                        <div className="text-sm text-muted-foreground">{result.username}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {localSearchQuery && searchResults.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <i className="fas fa-search text-3xl text-muted-foreground mb-3"></i>
                  <p className="text-muted-foreground">No matching items found</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="mt-4"
                disabled={!localSearchQuery}
              >
                Search in Vault
              </Button>
            </form>
          </div>
        ) : (
          <>
            {isVaultPage && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearch(true)} 
                className="mr-2"
              >
                <i className="fas fa-search"></i>
              </Button>
            )}
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
