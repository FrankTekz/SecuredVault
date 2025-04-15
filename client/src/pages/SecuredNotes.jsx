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
import { motion, AnimatePresence } from "framer-motion";

const SecuredNotes = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { items: notes, isLocked, masterPasswordHash } = useSelector((state) => state.notes);
  
  const [masterPassword, setMasterPasswordValue] = useState("");
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  
  const handleUnlock = () => {
    if (!masterPassword) {
      toast({
        title: "Error",
        description: "Please enter your master password",
        variant: "destructive",
      });
      return;
    }
    
    if (!masterPasswordHash) {
      // First time setup - set master password
      dispatch(setMasterPassword(masterPassword));
      toast({
        title: "Vault Unlocked",
        description: "Your master password has been set",
      });
    } else {
      // Unlock with existing password
      const result = dispatch(unlockNotes(masterPassword));
      
      if (result.payload?.isLocked === false) {
        toast({
          title: "Vault Unlocked",
          description: "Your notes are now accessible",
        });
      } else {
        toast({
          title: "Error",
          description: "Incorrect master password",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleSaveNote = () => {
    if (!newNote.title || !newNote.content) {
      toast({
        title: "Error",
        description: "Please provide both title and content",
        variant: "destructive",
      });
      return;
    }
    
    dispatch(addNote({
      ...newNote,
      masterPassword
    }));
    
    toast({
      title: "Note Saved",
      description: "Your note has been encrypted and saved",
    });
    
    setNewNote({ title: "", content: "" });
    setAddNoteOpen(false);
  };
  
  const handleDeleteNote = (id) => {
    dispatch(deleteNote(id));
    setNoteToDelete(null);
    
    toast({
      title: "Note Deleted",
      description: "Your note has been permanently deleted",
    });
  };
  
  const handleExportNotes = () => {
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
      {isLocked ? (
        // Lock Screen
        <Card className="max-w-md mx-auto mt-16">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: [0.9, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <i className="fas fa-lock text-4xl text-primary mb-4"></i>
              </motion.div>
              <h3 className="text-xl font-semibold">Secured Notes Vault</h3>
              <p className="text-muted-foreground text-sm mt-2">
                {!masterPasswordHash
                  ? "Create a master password to secure your notes"
                  : "Enter your master password to access your secured notes"}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  id="masterPassword"
                  placeholder="Master Password"
                  value={masterPassword}
                  onChange={(e) => setMasterPasswordValue(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleUnlock}>
                {!masterPasswordHash ? "Create Vault" : "Unlock Vault"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Notes Content
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Secured Notes</h2>
            <Button onClick={() => setAddNoteOpen(true)}>
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
                            <Button variant="ghost" size="icon" className="p-1 h-auto w-auto">
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
                    <p className="text-muted-foreground mb-6">
                      Add your first secure note by clicking the "New Note" button
                    </p>
                    <Button onClick={() => setAddNoteOpen(true)}>
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
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="noteTitle">Title</Label>
                  <Input
                    id="noteTitle"
                    placeholder="Note Title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noteContent">Content</Label>
                  <Textarea
                    id="noteContent"
                    placeholder="Enter your secured note content..."
                    rows={6}
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
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
