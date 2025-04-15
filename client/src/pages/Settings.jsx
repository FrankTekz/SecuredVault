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
import { useToast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { 
  toggleDarkMode, 
  toggleAutoLock, 
  toggleClearClipboard, 
  clearSettings 
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
  const { darkMode, autoLock, clearClipboard } = useSelector((state) => state.user);
  
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
          title="Auto-Lock"
          description="Lock the app after 5 minutes of inactivity"
          actionElement={
            <Switch
              checked={autoLock}
              onCheckedChange={() => dispatch(toggleAutoLock())}
            />
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
            <Switch
              checked={darkMode}
              onCheckedChange={() => dispatch(toggleDarkMode())}
            />
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
