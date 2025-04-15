import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Vault from "@/pages/Vault";
import DarkWebScan from "@/pages/DarkWebScan";
import PasswordGenerator from "@/pages/PasswordGenerator";
import SecuredNotes from "@/pages/SecuredNotes";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";
import { useMediaQuery } from "@/hooks/use-mobile";

function App() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [location] = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {!isMobile && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        {isMobile && <Header />}
        
        <div className="container mx-auto p-4 pb-20 md:pb-4">
          <Switch>
            <Route path="/" component={PasswordGenerator} />
            <Route path="/vault" component={Vault} />
            <Route path="/dark-web-scan" component={DarkWebScan} />
            <Route path="/password-generator" component={PasswordGenerator} />
            <Route path="/secured-notes" component={SecuredNotes} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      
      {isMobile && (
        <div className="fixed bottom-0 w-full bg-background border-t border-border z-10">
          <div className="flex justify-around p-3">
            <a 
              href="/vault" 
              className={`flex flex-col items-center ${location === '/vault' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className="fas fa-vault mb-1 text-lg"></i>
              <span>Vault</span>
            </a>
            <a 
              href="/dark-web-scan" 
              className={`flex flex-col items-center ${location === '/dark-web-scan' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className="fas fa-shield-alt mb-1 text-lg"></i>
              <span>Scan</span>
            </a>
            <a 
              href="/password-generator" 
              className={`flex flex-col items-center ${location === '/password-generator' || location === '/' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className="fas fa-key mb-1 text-lg"></i>
              <span>Generator</span>
            </a>
            <a 
              href="/secured-notes" 
              className={`flex flex-col items-center ${location === '/secured-notes' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className="fas fa-sticky-note mb-1 text-lg"></i>
              <span>Notes</span>
            </a>
            <a 
              href="/settings" 
              className={`flex flex-col items-center ${location === '/settings' ? 'text-primary' : 'text-muted-foreground'} text-xs`}
            >
              <i className="fas fa-cog mb-1 text-lg"></i>
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
