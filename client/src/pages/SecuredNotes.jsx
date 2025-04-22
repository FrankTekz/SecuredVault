import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
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
  setMasterPassword,
  unlockNotes,
  lockNotes,
  addNote,
  updateNote,
  deleteNote,
  decryptNote,
} from "@/slices/notesSlice";
import { LOCK_INTERVALS } from "@/slices/userSlice";
import { useLockInterval } from "@/hooks/use-lock-interval";
import LockScreen from "@/components/LockScreen";
import { motion, AnimatePresence } from "framer-motion";
import CryptoJS from "crypto-js";

const SecuredNotes = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { items: notes, isLocked: notesLocked, masterPasswordHash } = useSelector((state) => state.notes);
  const { lockInterval } = useSelector(state => state.user);
  
  // Use our custom lock interval hook
  const { isLocked: intervalLocked, unlock: unlockInterval } = useLockInterval(false);
  
  const [masterPassword, setMasterPasswordValue] = useState("");
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [editNoteOpen, setEditNoteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [currentNote, setCurrentNote] = useState({ id: null, title: "", content: "" });
  
  // Get the hasPasswordSet state from Redux
  const hasPasswordSet = useSelector(state => state.notes.hasPasswordSet);
  
  console.log("SecuredNotes rendering with Redux state:", { 
    hasPasswordSet, 
    masterPasswordHash 
  });
  
  // Add local state to track whether we should show the lock screen
  const [showLockScreen, setShowLockScreen] = useState(true);
  
  // Reset the lock screen state when the hasPasswordSet flag changes
  useEffect(() => {
    // If password is set, we need to show the lock screen to enter the password
    // If no password is set, we will show the lock screen to create a password
    console.log("✅ App loaded and running");
    setShowLockScreen(true);
  }, [hasPasswordSet]);
  
  // Determine if we should lock based on the local state and hasPasswordSet flag
  // If no password is set, we should show a different lock screen (for password creation)
  // Otherwise, show the regular lock screen for password entry
  const isLocked = showLockScreen;
  
  // Handle different lock messages based on the lock interval setting
  const getLockReason = () => {
    // If no password has been set yet, show message to create one
    if (!hasPasswordSet) {
      return "Create a master password to secure your notes";
    }
    
    // Otherwise, show regular locking messages
    if (notesLocked) {
      return "Enter your master password to access your secured notes";
    }
    
    switch(lockInterval) {
      case LOCK_INTERVALS.SESSION_END:
        return "Your session ended. Please enter your master password again.";
      case LOCK_INTERVALS.EVERY_USE:
        return "Password is required each time you access your notes.";
      case LOCK_INTERVALS.TIMEOUT_15:
        return "You've been inactive for 15 minutes. Please enter your password.";
      default:
        return "Enter your master password to continue.";
    }
  };
  
  const handleUnlock = (password = masterPassword) => {
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
      setShowLockScreen(false);
      unlockInterval();
      toast({ title: "Vault Unlocked", description: "Your master password has been set" });
      return;
    }
  
    // Password verification via dispatch
    dispatch(unlockNotes(password));
  
    // Do not compare hash in component, rely on reducer
    const storedHash = masterPasswordHash.hash;
    const salt = masterPasswordHash.salt;
    const inputHash = CryptoJS.SHA256(salt + password).toString();
  
    if (inputHash === storedHash) {
      setMasterPasswordValue(password);
      setShowLockScreen(false);
      unlockInterval();
      toast({ title: "Vault Unlocked", description: "Access granted" });
    } else {
      toast({ title: "Error", description: "Incorrect master password", variant: "destructive" });
    }
  };
  
  
  const handleAddNote = () => {
    setCurrentNote({ id: null, title: "", content: "" });
    setAddNoteOpen(true);
  };
  
  const handleEditNote = (note) => {
    // If no master password is set, we need to prompt the user to set one first
    if (!hasPasswordSet) {
      toast({
        title: "Password Required",
        description: "Please set a master password to edit encrypted notes.",
        action: (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              // Show the password setting dialog
              dispatch({ type: "notes/lockNotes" });
            }}
          >
            Set Password
          </Button>
        ),
      });
      return;
    }
    
    // Decrypt the note content
    const decryptedContent = decryptNote(note.content, masterPassword);
    
    // Set the current note with decrypted content for editing
    setCurrentNote({
      id: note.id,
      title: note.title,
      content: decryptedContent
    });
    
    setEditNoteOpen(true);
  };
  
  const handleSaveNote = () => {
    if (!currentNote.title || !currentNote.content) {
      toast({
        title: "Error",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }
    
    // If no master password is set, we need to prompt the user to set one first
    if (!hasPasswordSet) {
      // First we'll close the current dialog
      setAddNoteOpen(false);
      setEditNoteOpen(false);
      
      // Show a custom toast prompting to set a password
      toast({
        title: "Password Required",
        description: "Please set a master password to encrypt your notes.",
        action: (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              // Show the password setting dialog (reusing the lock screen)
              dispatch({ type: "notes/lockNotes" });
            }}
          >
            Set Password
          </Button>
        ),
      });
      return;
    }
    
    // For new notes
    if (!currentNote.id) {
      dispatch(addNote({
        title: currentNote.title,
        content: currentNote.content,
        masterPassword
      }));
      
      toast({
        title: "Note Saved",
        description: "Your note has been encrypted and saved",
      });
    } 
    // For editing existing notes
    else {
      dispatch(updateNote({
        id: currentNote.id,
        title: currentNote.title,
        content: currentNote.content,
        masterPassword
      }));
      
      toast({
        title: "Note Updated",
        description: "Your note has been updated and encrypted",
      });
    }
    
    // Reset form and close dialogs
    setCurrentNote({ id: null, title: "", content: "" });
    setAddNoteOpen(false);
    setEditNoteOpen(false);
  };
  
  const handleDeleteNote = (id) => {
    // If no master password is set, we need to prompt the user to set one first
    if (!hasPasswordSet) {
      setNoteToDelete(null);
      toast({
        title: "Password Required",
        description: "Please set a master password to manage encrypted notes.",
        action: (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              // Show the password setting dialog
              dispatch({ type: "notes/lockNotes" });
            }}
          >
            Set Password
          </Button>
        ),
      });
      return;
    }
    
    dispatch(deleteNote(id));
    setNoteToDelete(null);
    
    toast({
      title: "Note Deleted",
      description: "Your note has been permanently deleted",
    });
  };
  
  const handleExportNotes = () => {
    // Check if master password exists
    if (!hasPasswordSet) {
      toast({
        title: "Password Required",
        description: "Please set a master password to export encrypted notes.",
        action: (
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => {
              // Show the password setting dialog
              dispatch({ type: "notes/lockNotes" });
            }}
          >
            Set Password
          </Button>
        ),
      });
      return;
    }
    
    // Create a simple PDF-like export (text format)
    let exportContent = "SECURED NOTES EXPORT\n\n";
    
    notes.forEach((note) => {
      const decryptedContent = decryptNote(note.content, masterPassword);
      exportContent += `Title: ${note.title}\n`;
      exportContent += `Date: ${new Date(note.createdAt).toLocaleDateString()}\n`;
      exportContent += `Content: ${decryptedContent}\n\n`;
      exportContent += "------------------------\n\n";
    });
    
    // Create a blob and download
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "secured-notes-export.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Notes Exported",
      description: "Your notes have been exported as a text file",
    });
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* New lock screen component - shown when either notesLocked or intervalLocked is true */}
      {isLocked && (
        <LockScreen 
          onUnlock={handleUnlock}
          reason={getLockReason()}
        />
      )}
      
      {/* Notes Content - only shown when not locked */}
      {!isLocked && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Secured Notes</h2>
            <Button onClick={handleAddNote}>
              <i className="fas fa-plus mr-2"></i> New Note
            </Button>
          </div>
          
          <AnimatePresence>
            {notes.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {notes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{note.title}</h3>
                          <div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="p-1 h-auto w-auto"
                              onClick={() => handleEditNote(note)}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="p-1 h-auto w-auto text-red-500"
                              onClick={() => setNoteToDelete(note.id)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">
                          Last updated: {formatDate(note.updatedAt || note.createdAt)}
                        </p>
                        <p className="text-sm">
                          {decryptNote(note.content, masterPassword).substring(0, 100)}
                          {decryptNote(note.content, masterPassword).length > 100 ? '...' : ''}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="py-8">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-4xl text-muted-foreground mb-4"
                    >
                      <i className="fas fa-sticky-note"></i>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">No Notes Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first secure note by clicking the "New Note" button
                    </p>
                    
                    {!hasPasswordSet && (
                      <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md mb-4 text-sm">
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          <i className="fas fa-info-circle mr-2"></i>
                          You'll need to set a master password when creating your first note.
                          This password will be used to encrypt all your secure notes.
                        </p>
                      </div>
                    )}
                    
                    <Button onClick={handleAddNote}>
                      <i className="fas fa-plus mr-2"></i> Add Your First Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
          
          {notes.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                <span>{notes.length}</span> notes stored • All notes are encrypted
              </p>
              <Button variant="secondary" onClick={handleExportNotes}>
                <i className="fas fa-file-export mr-1"></i> Export Notes
              </Button>
            </div>
          )}
          
          {/* Add Note Dialog */}
          <Dialog open={addNoteOpen} onOpenChange={setAddNoteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Note</DialogTitle>
                <DialogDescription>
                  Create a new encrypted secure note.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="noteTitle">Title</Label>
                  <Input
                    id="noteTitle"
                    placeholder="Note Title"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noteContent">Content</Label>
                  <Textarea
                    id="noteContent"
                    placeholder="Enter your secured note content..."
                    rows={6}
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveNote}>Save Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Edit Note Dialog */}
          <Dialog open={editNoteOpen} onOpenChange={setEditNoteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Note</DialogTitle>
                <DialogDescription>
                  Make changes to your encrypted note.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editNoteTitle">Title</Label>
                  <Input
                    id="editNoteTitle"
                    placeholder="Note Title"
                    value={currentNote.title}
                    onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editNoteContent">Content</Label>
                  <Textarea
                    id="editNoteContent"
                    placeholder="Enter your secured note content..."
                    rows={6}
                    value={currentNote.content}
                    onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveNote}>Update Note</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={!!noteToDelete} onOpenChange={() => setNoteToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  secured note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => handleDeleteNote(noteToDelete)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </motion.div>
  );
};

export default SecuredNotes;
