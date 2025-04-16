import { Route, Router, Switch, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";

// Components
import PasswordGenerator from "@/pages/PasswordGenerator";
import Vault from "@/pages/Vault";
import DarkWebScan from "@/pages/DarkWebScan";
import SecuredNotes from "@/pages/SecuredNotes";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const AnimatedRoutes = () => {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <div key={location}>
        <PageTransition>
          <Switch>
            <Route path="/" component={PasswordGenerator} />
            <Route path="/vault" component={Vault} />
            <Route path="/dark-web-scan" component={DarkWebScan} />
            <Route path="/password-generator" component={PasswordGenerator} />
            <Route path="/secured-notes" component={SecuredNotes} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
      </div>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;