import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { addCredential, unlockCredentials, setMasterPassword, lockCredentials, deleteCredential } from "@/slices/credentialsSlice";
import { setSearchQuery, clearSearchQuery } from "@/slices/searchSlice";
import { useToast } from "@/hooks/use-toast";
import LockScreen from "@/components/LockScreen";
import { decryptField } from "@/slices/credentialsSlice";
import CryptoJS from 'crypto-js';

const Vault = () => {
  const { toast } = useToast();
  const credentials = useSelector((state) => state.credentials.items);
  const { isLocked, hasPasswordSet, masterPasswordHash } = useSelector((state) => state.credentials);
  const globalSearchQuery = useSelector((state) => state.search.query);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
const [editingId, setEditingId] = useState(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [credentialToDelete, setCredentialToDelete] = useState(null);
  const [masterPassword, setMasterPasswordValue] = useState("");
  const [newCredential, setNewCredential] = useState({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: ""
  });

  console.log("Vault Component State:", {
    isLocked,
    hasPasswordSet,
    masterPasswordHash,
    credentialsLength: credentials.length
  });

  // Force initial lock state if no password is set
  useEffect(() => {
    if (!hasPasswordSet) {
      console.log("No password set, forcing locked state");
      dispatch(lockCredentials());
    }
  }, [hasPasswordSet, dispatch]);

  const handleUnlock = (password) => {
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your master password",
        variant: "destructive",
      });
      return;
    }

    if (!hasPasswordSet) {
      // Initial password setup
      dispatch(setMasterPassword(password));
      setMasterPasswordValue(password);
      dispatch(unlockCredentials(password));
      toast({ title: "Vault Unlocked", description: "Your master password has been set" });
      return;
    }

    // Password verification
    const { hash, salt } = masterPasswordHash;
    const inputHash = CryptoJS.SHA256(salt + password).toString();

    if (inputHash === hash) {
      setMasterPasswordValue(password);
      dispatch(unlockCredentials(password));
      toast({ title: "Vault Unlocked", description: "Access granted" });
    } else {
      toast({ title: "Error", description: "Incorrect master password", variant: "destructive" });
    }
  };

  // Sync local search query with global search query
  useEffect(() => {
    setLocalSearchQuery(globalSearchQuery || "");
  }, [globalSearchQuery]);

  // Update global search when local search changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
  };

  // Filter credentials based on search query (title or username)
  const filteredCredentials = credentials.filter(cred => {
    const decryptedTitle = cred.title;
    const decryptedUsername = decryptField(cred.username, masterPassword, cred.usernameSalt);
    return decryptedTitle?.toLowerCase().includes(localSearchQuery.toLowerCase()) || 
           decryptedUsername?.toLowerCase().includes(localSearchQuery.toLowerCase());
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCredential(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
  if (isEditing && editingId) {
    dispatch(updateCredential({
      id: editingId,
      ...newCredential,
      masterPassword,
    }));
  } else {
    dispatch(addCredential({ ...newCredential, masterPassword }));
  }
  setNewCredential({
    title: "",
    username: "",
    password: "",
    url: "",
    notes: ""
  });
  setIsDialogOpen(false);
  setIsEditing(false);
  setEditingId(null);
};

  if (isLocked) {
    return (
      <LockScreen 
        onUnlock={handleUnlock} 
        reason={hasPasswordSet ? "Enter your master password to access your credentials" : "Create a master password to secure your credentials"}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Password Vault</h2>
        <div className="w-full md:w-auto flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Search by title or username..." 
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="md:w-64"
          />
          <Button onClick={() => setIsDialogOpen(true)} className="flex-shrink-0">
            <i className="fas fa-plus mr-2"></i> Add
          </Button>
          <Button onClick={() => dispatch(lockCredentials())} variant="outline" className="flex-shrink-0">
            <i className="fas fa-lock mr-2"></i> Lock
          </Button>
        </div>
      </div>
      
      {credentials.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-lg overflow-hidden"
            >
              <svg className="w-40 h-40 md:w-56 md:h-56 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Simple Vault Outline */}
                <rect 
                  x="3" 
                  y="6" 
                  width="18" 
                  height="15" 
                  rx="2" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                />
                <path 
                  d="M7 6V4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                />
              </svg>
            </motion.div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Your Vault is Empty</h3>
          <p className="text-muted-foreground mb-6">Add passwords to your vault to keep them secure and easily accessible.</p>
          <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
            <i className="fas fa-plus mr-2"></i> Add Password
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCredentials.map(credential => (
            <motion.div
              key={credential.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="truncate">{credential.title}</CardTitle>
                    {/* <div className="text-primary">
                      <i className="fas fa-lock"></i>
                    </div> */}
                  </div>
                  {credential.url && (
                    <CardDescription className="truncate">
                      <i className="fas fa-globe mr-1"></i> {decryptField(credential.url, masterPassword, credential.urlSalt)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Username</div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium truncate">{decryptField(credential.username, masterPassword, credential.usernameSalt)}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <i className="fas fa-copy text-xs"></i>
                        </Button>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Password</div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">••••••••</span>
                        <div className="flex items-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <i className="fas fa-eye text-xs"></i>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <i className="fas fa-copy text-xs"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1 flex justify-end">
                  <Button
    variant="ghost"
    size="icon"
    className="p-1 h-auto w-auto text-red-500"
    onClick={() => {
      // If no master password set, show password requirement toast
      if (!hasPasswordSet) {
        toast({
          title: "Password Required",
          description: "Please set a master password to manage encrypted credentials.",
          action: (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => dispatch(lockCredentials())}
            >
              Set Password
            </Button>
          ),
        });
        return;
      }
      
      // Otherwise show delete confirmation dialog
      setCredentialToDelete(credential.id);
    }}
  >
    <i className="fas fa-trash-alt"></i>
  </Button>
                  <Button
  variant="ghost"
  size="sm"
  onClick={() => {
    setIsEditing(true);
    setEditingId(credential.id);
    setNewCredential({
      title: credential.title,
      username: decryptField(credential.username, masterPassword, credential.usernameSalt),
      password: decryptField(credential.password, masterPassword, credential.passwordSalt),
      url: decryptField(credential.url, masterPassword, credential.urlSalt),
      notes: decryptField(credential.notes, masterPassword, credential.notesSalt),
    });
    setIsDialogOpen(true);
  }}
>
  <i className="fas fa-pencil-alt mr-1"></i> Edit
</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Password Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
  setIsDialogOpen(open);
  if (!open) {
    setIsEditing(false);
    setEditingId(null);
    setNewCredential({
      title: "",
      username: "",
      password: "",
      url: "",
      notes: ""
    });
  }
}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Add a new password to your secure vault. All data is encrypted with your master password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={newCredential.title} 
                onChange={handleInputChange} 
                placeholder="e.g. Gmail, Netflix, Bank" 
              />
            </div>
            <div>
              <Label htmlFor="username">Username / Email</Label>
              <Input 
                id="username" 
                name="username" 
                value={newCredential.username} 
                onChange={handleInputChange} 
                placeholder="your@email.com" 
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={newCredential.password} 
                onChange={handleInputChange} 
                placeholder="Enter secure password" 
              />
            </div>
            <div>
              <Label htmlFor="url">Website</Label>
              <Input 
                id="url" 
                name="url" 
                value={newCredential.url} 
                onChange={handleInputChange} 
                placeholder="https://example.com" 
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                name="notes" 
                value={newCredential.notes} 
                onChange={handleInputChange} 
                placeholder="Additional information..." 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!credentialToDelete} onOpenChange={() => setCredentialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              secured credential.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                dispatch(deleteCredential(credentialToDelete));
                setCredentialToDelete(null);
                toast({
                  title: "Credential Deleted",
                  description: "Your credential has been permanently deleted",
                });
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Vault;
