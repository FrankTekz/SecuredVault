import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const LockScreen = ({ onUnlock, reason, isNewPassword = false }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { toast } = useToast();
  
  // Reset errors when typing
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsError(false);
    setErrorMsg("");
  };
  
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setIsError(false);
    setErrorMsg("");
  };

  // This function handles the validation of the master password
  const handleUnlock = (e) => {
    e.preventDefault();
    
    if (isNewPassword) {
      // Validate new password setup
      if (password.trim().length === 0) {
        setIsError(true);
        setErrorMsg("Password cannot be empty");
        return;
      }
      
      if (password !== confirmPassword) {
        setIsError(true);
        setErrorMsg("Passwords do not match");
        return;
      }
      
      // Passwords match, set the new master password
      onUnlock(password);
      setPassword("");
      setConfirmPassword("");
      setIsError(false);
      
    } else {
      // Regular unlock with existing password
      if (password.trim().length > 0) {
        onUnlock(password);
        setPassword("");
        setIsError(false);
      } else {
        setIsError(true);
        setErrorMsg("Password cannot be empty");
        toast({
          title: "Unlock Failed",
          description: "Please enter your master password",
          variant: "destructive",
        });
      }
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
              <div className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder={isNewPassword ? "Create Master Password" : "Master Password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className={isError ? "border-red-500" : ""}
                    autoFocus
                  />
                </div>
                
                {isNewPassword && (
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm Master Password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={isError ? "border-red-500" : ""}
                    />
                  </div>
                )}
                
                {isError && (
                  <p className="text-red-500 text-xs">
                    {errorMsg}
                  </p>
                )}
              </div>
              
              <Button type="submit" className="w-full mt-4">
                {isNewPassword ? "Create Password" : "Unlock"}
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