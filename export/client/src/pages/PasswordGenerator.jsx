import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { generatePassword, calculatePasswordStrength } from "@/lib/utils";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const PasswordGenerator = () => {
  const { toast } = useToast();
  const clearClipboard = useSelector((state) => state.user.clearClipboard);
  
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    avoidAmbiguous: false,
  });
  
  const [strength, setStrength] = useState({ 
    score: 0, 
    label: "Weak", 
    color: "red", 
    percentage: 25 
  });
  
  const [copyAnimation, setCopyAnimation] = useState(false);
  
  const generateNewPassword = useCallback(() => {
    const newPassword = generatePassword(options);
    setPassword(newPassword);
    setStrength(calculatePasswordStrength(newPassword));
  }, [options]);
  
  const handleSliderChange = (value) => {
    setOptions({
      ...options,
      length: value[0],
    });
  };
  
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopyAnimation(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Password has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopyAnimation(false);
    }, 300);
    
    // Clear clipboard after 30 seconds if enabled
    if (clearClipboard) {
      setTimeout(() => {
        navigator.clipboard.writeText("");
      }, 30000);
    }
  };
  
  // Initial password generation
  useEffect(() => {
    generateNewPassword();
  }, [generateNewPassword]);
  
  const getStrengthColor = () => {
    switch (strength.color) {
      case "red": return "bg-red-600";
      case "orange": return "bg-orange-500";
      case "yellow": return "bg-yellow-500";
      case "green": return "bg-green-500";
      default: return "bg-red-600";
    }
  };
  
  const getStrengthTextColor = () => {
    switch (strength.color) {
      case "red": return "text-red-600";
      case "orange": return "text-orange-500";
      case "yellow": return "text-yellow-500";
      case "green": return "text-green-500";
      default: return "text-red-600";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Password Generator</h2>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Input
              type="text"
              value={password}
              readOnly
              className="pr-24 text-lg font-mono h-12"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={generateNewPassword}
                className="p-2"
              >
                <i className="fas fa-sync-alt"></i>
              </Button>
              <motion.div
                animate={copyAnimation ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyPassword}
                  className="p-2"
                >
                  <i className="fas fa-copy"></i>
                </Button>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Password Strength</span>
              <span className={`text-sm font-semibold ${getStrengthTextColor()}`}>{strength.label}</span>
            </div>
            <Progress value={strength.percentage} className="h-2" indicatorClassName={getStrengthColor()} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customize Password</h3>
          
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <Label htmlFor="passwordLength">Length: {options.length}</Label>
            </div>
            <Slider
              id="passwordLength"
              min={6}
              max={32}
              step={1}
              value={[options.length]}
              onValueChange={handleSliderChange}
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="includeUppercase">Uppercase Letters (A-Z)</Label>
              <Switch
                id="includeUppercase"
                checked={options.includeUppercase}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, includeUppercase: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="includeLowercase">Lowercase Letters (a-z)</Label>
              <Switch
                id="includeLowercase"
                checked={options.includeLowercase}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, includeLowercase: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="includeNumbers">Numbers (0-9)</Label>
              <Switch
                id="includeNumbers"
                checked={options.includeNumbers}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, includeNumbers: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="includeSymbols">Symbols (!@#$%^&*)</Label>
              <Switch
                id="includeSymbols"
                checked={options.includeSymbols}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, includeSymbols: checked })
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="avoidAmbiguous">Avoid Ambiguous Characters (l, 1, I, O, 0)</Label>
              <Switch
                id="avoidAmbiguous"
                checked={options.avoidAmbiguous}
                onCheckedChange={(checked) =>
                  setOptions({ ...options, avoidAmbiguous: checked })
                }
              />
            </div>
          </div>
          
          <Button className="w-full mt-6" onClick={generateNewPassword}>
            Generate New Password
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PasswordGenerator;
