import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeMasterPassword } from "@/slices/authSlice";
import { updateAllCredentials } from "@/slices/credentialsSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ChangeMasterPasswordModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const credentials = useSelector((state) => state.credentials.items);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const reEncryptedCredentials = dispatch(
        changeMasterPassword({
          oldPassword: currentPassword,
          newPassword,
          credentials,
        })
      ).payload;

      dispatch(updateAllCredentials(reEncryptedCredentials));

      toast({
        title: "Master Password Changed",
        description: "All credentials have been re-encrypted.",
      });

      // Reset fields and close modal
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
    //   console.error("Error changing master password:", err.message);
      setError("Incorrect current master password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Master Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Current Master Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New Master Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeMasterPasswordModal;
