import { useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [location] = useLocation();
  const isDarkMode = useSelector((state) => state.user.darkMode);
  
  // Apply dark mode class to the document based on Redux state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {!isMobile && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        {isMobile && <Header />}
        
        <div className="container mx-auto p-4 pb-20 md:pb-4">
          {/* We'll create a persistent container to avoid complete remounting */}
          <div className="page-container relative min-h-[80vh]">
            <AnimatedRoutes />
          </div>
        </div>
      </main>
      
      {isMobile && (
        <div className="fixed bottom-0 w-full bg-background border-t border-border z-10">
          <div className="flex justify-around p-3">
            <a 
              href="/vault" 
              className={`flex flex-col items-center ${location === '/vault' || location === '/' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className={`fas fa-vault mb-1 text-lg ${location === '/vault' || location === '/' ? 'text-primary' : ''}`}></i>
              <span>Vault</span>
            </a>
            <a 
              href="/dark-web-scan" 
              className={`flex flex-col items-center ${location === '/dark-web-scan' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className={`fas fa-shield-alt mb-1 text-lg ${location === '/dark-web-scan' ? 'text-primary' : ''}`}></i>
              <span>Scan</span>
            </a>
            <a 
              href="/password-generator" 
              className={`flex flex-col items-center ${location === '/password-generator' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className={`fas fa-key mb-1 text-lg ${location === '/password-generator' ? 'text-primary' : ''}`}></i>
              <span>Generator</span>
            </a>
            <a 
              href="/secured-notes" 
              className={`flex flex-col items-center ${location === '/secured-notes' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className={`fas fa-sticky-note mb-1 text-lg ${location === '/secured-notes' ? 'text-primary' : ''}`}></i>
              <span>Notes</span>
            </a>
            <a 
              href="/settings" 
              className={`flex flex-col items-center ${location === '/settings' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className={`fas fa-cog mb-1 text-lg ${location === '/settings' ? 'text-primary' : ''}`}></i>
              <span>Settings</span>
            </a>
          </div>
        </div>
      )}
      
      <Toaster />
    </div>
  );
}

export default App;
