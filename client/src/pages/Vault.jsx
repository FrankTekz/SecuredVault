import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Vault = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Password Vault</h2>
      </div>
      
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-lg overflow-hidden"
          >
            <svg className="w-64 h-64 text-primary/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="6" width="18" height="15" rx="2" strokeWidth="1.5"/>
              <path d="M3 11H21" strokeWidth="1.5"/>
              <path d="M8 16H16" strokeWidth="1.5"/>
              <path d="M7 6V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6" strokeWidth="1.5"/>
              <circle cx="12" cy="16" r="2" strokeWidth="1.5"/>
            </svg>
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Password Vault</h3>
        <p className="text-muted-foreground mb-6">This section is coming soon. Store all your passwords securely in one place.</p>
        <Button className="flex items-center">
          <i className="fas fa-plus mr-2"></i> Add Password
        </Button>
      </Card>
    </motion.div>
  );
};

export default Vault;
