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
            <svg className="w-64 h-64 text-primary/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" strokeWidth="1.5"/>
              <path d="M12 7V13L16 15" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4.5 12C4.5 8.41015 7.41015 5.5 11 5.5C14.5899 5.5 17.5 8.41015 17.5 12C17.5 15.5899 14.5899 18.5 11 18.5C7.41015 18.5 4.5 15.5899 4.5 12Z" strokeWidth="1.5" strokeDasharray="2 2"/>
              <path d="M17.5 6.5L19.5 4.5" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M17.5 17.5L19.5 19.5" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4.5 4.5L6.5 6.5" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4.5 19.5L6.5 17.5" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </motion.div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Dark Web Monitoring</h3>
        <p className="text-muted-foreground mb-6">Coming soon. Monitor if your credentials have been exposed in data breaches.</p>
        <Button className="flex items-center">
          <i className="fas fa-search mr-2"></i> Start Scan
        </Button>
      </Card>
    </motion.div>
  );
};

export default DarkWebScan;
