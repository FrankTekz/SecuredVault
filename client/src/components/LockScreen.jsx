import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const LockScreen = ({ onUnlock, reason }) => {
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const { toast } = useToast();

  // This function would handle the validation of the master password
  // In a real app, we would verify it against a securely stored hash
  const handleUnlock = (e) => {
    e.preventDefault();
    
    // For demo purposes, any non-empty password will work
    if (password.trim().length > 0) {
      onUnlock(password);
      setPassword("");
      setIsError(false);
    } else {
      setIsError(true);
      toast({
        title: "Unlock Failed",
        description: "Please enter your master password",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <Card className="w-full max-w-lg mx-auto my-8">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              <i className="fas fa-lock text-primary mr-2"></i> Note Access Required
            </CardTitle>
            <CardDescription>
              {reason || "Enter your master password to access your secure notes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock}>
              <div className="mb-4">
                <Input
                  type="password"
                  placeholder="Master Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={isError ? "border-red-500" : ""}
                  autoFocus
                />
                {isError && (
                  <p className="text-red-500 text-xs mt-1">
                    Password cannot be empty
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Unlock
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground">
            Passwords and secure data are encrypted with your master password
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default LockScreen;