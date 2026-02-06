"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminService } from "@/lib/services/admin";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: any;
    onSuccess: () => void;
}

export default function UserDialog({ open, onOpenChange, user, onSuccess }: UserDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "FREELANCER"
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: "", // Don't fill password on edit
                role: user.role
            });
        } else {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "FREELANCER"
            });
        }
    }, [user, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (user) {
                const updateData = { ...formData };
                if (!updateData.password) delete (updateData as any).password;

                await adminService.updateUser(user.id, updateData);
                toast.success("User updated successfully");
            } else {
                await adminService.createUser(formData);
                toast.success("User created successfully");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 text-gray-100">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="bg-white/5 border-white/10 focus-visible:border-primary/50"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="bg-white/5 border-white/10 focus-visible:border-primary/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-white/5 border-white/10 focus-visible:border-primary/50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{user ? "Password (leave blank to keep)" : "Password"}</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="bg-white/5 border-white/10 focus-visible:border-primary/50"
                            required={!user}
                            minLength={8}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(val) => setFormData({ ...formData, role: val })}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] border-white/10 text-gray-100">
                                <SelectItem value="FREELANCER">Freelancer</SelectItem>
                                <SelectItem value="EMPLOYER">Employer</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="bg-transparent border-white/10 hover:bg-white/5 text-gray-400 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-black hover:bg-primary/90 font-bold"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {user ? "Save Changes" : "Create User"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
