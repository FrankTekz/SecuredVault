import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const DarkWebScan = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dark Web Scan</h2>
      </div>
      
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-lg overflow-hidden"
          >
            <svg className="w-40 h-40 md:w-56 md:h-56 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simple Shield Outline */}
              <path 
                d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none"
              />
            </svg>
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Dark Web Monitoring</h3>
        <p className="text-muted-foreground mb-6">Coming soon. Monitor if your credentials have been exposed in data breaches.</p>
        <Button className="flex items-center">
          <i className="fas fa-shield-alt mr-2"></i> Start Scan
        </Button>
      </Card>
    </motion.div>
  );
};

export default DarkWebScan;
