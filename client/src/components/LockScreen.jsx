import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMasterPassword, unlockApp } from "@/slices/authSlice"; // 🆕 from authSlice
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const LockScreen = ({ reason }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const hasPasswordSet = useSelector((state) => state.auth.hasPasswordSet);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isCreatingPassword = !hasPasswordSet;

  const handleUnlock = (e) => {
    e.preventDefault();

    if (isCreatingPassword) {
      // Validation for creating password
      if (password.trim().length < 8) {
        setIsError(true);
        setErrorMessage("Password must be at least 8 characters");
        return;
      }
      if (password !== confirmPassword) {
        setIsError(true);
        setErrorMessage("Passwords do not match");
        return;
      }

      // Dispatch setMasterPassword from authSlice
      dispatch(setMasterPassword(password));
      toast({
        title: "Master Password Set",
        description: "Your vault is now unlocked",
      });
      setPassword("");
      setConfirmPassword("");
      setIsError(false);
    } else {
      // Validation for unlocking
      if (password.trim().length === 0) {
        setIsError(true);
        setErrorMessage("Password cannot be empty");
        return;
      }

      // Dispatch unlockApp from authSlice
      dispatch(unlockApp(password));
      setPassword("");
      setIsError(false);
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
              <i className={`fas fa-${isCreatingPassword ? 'key' : 'lock'} text-primary mr-2`}></i>
              {isCreatingPassword ? "Create Master Password" : "Vault Access Required"}
            </CardTitle>
            <CardDescription>
              {reason || "Enter your master password to unlock your vault"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUnlock}>
              <div className="space-y-4">
                <div>
                  <Input
                    type="password"
                    placeholder={isCreatingPassword ? "New Master Password" : "Master Password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setIsError(false);
                    }}
                    className={isError ? "border-red-500" : ""}
                    autoFocus
                  />
                  {isCreatingPassword && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>

                {isCreatingPassword && (
                  <div>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setIsError(false);
                      }}
                      className={isError && password !== confirmPassword ? "border-red-500" : ""}
                    />
                  </div>
                )}

                {isError && (
                  <p className="text-red-500 text-xs">
                    {errorMessage}
                  </p>
                )}

                <Button type="submit" className="w-full">
                  {isCreatingPassword ? "Create Password" : "Unlock"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center text-xs text-muted-foreground">
            {isCreatingPassword
              ? "Your master password will be used to encrypt all secure data"
              : "Passwords and credentials are encrypted with your master password"}
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default LockScreen;
