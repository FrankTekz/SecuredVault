import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { 
  toggleDarkMode, 
  toggleAutoLock, 
  toggleClearClipboard, 
  setLockInterval,
  setLockTimeout,
  clearSettings,
  LOCK_INTERVALS,
  AUTO_LOCK_TIMEOUTS
} from "@/slices/userSlice";
import { clearCredentials } from "@/slices/credentialsSlice";
import { clearNotes } from "@/slices/notesSlice";
import { motion } from "framer-motion";
import { useState } from "react";

const SettingsGroup = ({ title, children }) => (
  <div className="border border-border rounded-lg p-4 mb-4">
    <h3 className="text-lg font-semibold mb-3 border-b border-border pb-2">{title}</h3>
    {children}
  </div>
);

const SettingsRow = ({ title, description, actionElement }) => (
  <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
    {actionElement}
  </div>
);

const Settings = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { darkMode, autoLock, clearClipboard, lockInterval, lockTimeout } = useSelector((state) => state.user);
  
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  
  const handleExportPasswords = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Password export will be available in a future update.",
    });
  };
  
  const handleImportPasswords = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Password import will be available in a future update.",
    });
  };
  
  const handleChangeMasterPassword = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Master password change will be available in a future update.",
    });
  };
  
  const handleClearData = () => {
    // Clear all data
    dispatch(clearSettings());
    dispatch(clearCredentials());
    dispatch(clearNotes());
    
    setClearDataDialogOpen(false);
    
    toast({
      title: "Data Cleared",
      description: "All your data has been cleared from the application.",
    });
  };
  
  const handleLockIntervalChange = (value) => {
    dispatch(setLockInterval(value));
    
    let message = "";
    switch(value) {
      case LOCK_INTERVALS.SESSION_END:
        message = "Password will be required when session ends";
        break;
      case LOCK_INTERVALS.EVERY_USE:
        message = "Password will be required for every use";
        break;
      case LOCK_INTERVALS.TIMEOUT_15:
        message = "Password will be required after 15 minutes of inactivity";
        break;
      default:
        message = "Lock interval updated";
    }
    
    toast({
      title: "Setting Updated",
      description: message,
    });
  };
  
  const handleLockTimeoutChange = (value) => {
    const timeout = parseInt(value, 10);
    dispatch(setLockTimeout(timeout));
    
    toast({
      title: "Setting Updated",
      description: `Auto-lock timeout set to ${timeout} minutes`,
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <SettingsGroup title="Backup & Sync">
        <SettingsRow
          title="Export Passwords"
          description="Export all your passwords and notes as an encrypted file"
          actionElement={
            <Button variant="secondary" onClick={handleExportPasswords}>
              Export
            </Button>
          }
        />
        
        <SettingsRow
          title="Import Passwords"
          description="Import from CSV, JSON or other password managers"
          actionElement={
            <Button variant="secondary" onClick={handleImportPasswords}>
              Import
            </Button>
          }
        />
      </SettingsGroup>
      
      <SettingsGroup title="Security">
        <SettingsRow
          title="Change Master Password"
          description="Update your master password to access the app"
          actionElement={
            <Button variant="secondary" onClick={handleChangeMasterPassword}>
              Change
            </Button>
          }
        />
        
        <SettingsRow
          title="Secured Notes Lock Interval"
          description="Choose when to require password re-entry for notes"
          actionElement={
            <Select 
              value={lockInterval} 
              onValueChange={handleLockIntervalChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={LOCK_INTERVALS.SESSION_END}>End of Session</SelectItem>
                <SelectItem value={LOCK_INTERVALS.EVERY_USE}>Every Use</SelectItem>
                <SelectItem value={LOCK_INTERVALS.TIMEOUT_15}>After 15 Minutes</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        
        <SettingsRow
          title="Auto-Lock"
          description="Automatically lock the application after inactivity"
          actionElement={
            <div className="flex items-center gap-2">
              <Switch
                checked={autoLock}
                onCheckedChange={() => dispatch(toggleAutoLock())}
              />
            </div>
          }
        />
        
        <SettingsRow
          title="Auto-Lock Timeout"
          description="Set how long before auto-lock activates"
          actionElement={
            <Select 
              value={lockTimeout.toString()} 
              onValueChange={handleLockTimeoutChange}
              disabled={!autoLock}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AUTO_LOCK_TIMEOUTS.TIMEOUT_5.toString()}>5 Minutes</SelectItem>
                <SelectItem value={AUTO_LOCK_TIMEOUTS.TIMEOUT_15.toString()}>15 Minutes</SelectItem>
                <SelectItem value={AUTO_LOCK_TIMEOUTS.TIMEOUT_30.toString()}>30 Minutes</SelectItem>
                <SelectItem value={AUTO_LOCK_TIMEOUTS.TIMEOUT_60.toString()}>1 Hour</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        
        <SettingsRow
          title="Clipboard Clear"
          description="Clear clipboard after 30 seconds"
          actionElement={
            <Switch
              checked={clearClipboard}
              onCheckedChange={() => dispatch(toggleClearClipboard())}
            />
          }
        />
      </SettingsGroup>
      
      <SettingsGroup title="Application">
        <SettingsRow
          title="Dark Mode"
          description="Enable or disable dark mode"
          actionElement={
            <div className="flex items-center gap-2">
              <i className="fas fa-moon text-muted-foreground mr-2"></i>
              <Switch
                checked={darkMode}
                onCheckedChange={() => dispatch(toggleDarkMode())}
              />
            </div>
          }
        />
        
        <SettingsRow
          title="Clear Data"
          description="Remove all data and reset application"
          actionElement={
            <Button 
              variant="destructive" 
              onClick={() => setClearDataDialogOpen(true)}
            >
              Clear
            </Button>
          }
        />
      </SettingsGroup>
      
      {/* Clear Data Confirmation Dialog */}
      <AlertDialog open={clearDataDialogOpen} onOpenChange={setClearDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your
              passwords, notes, and reset all settings to default values.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleClearData}
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Settings;
