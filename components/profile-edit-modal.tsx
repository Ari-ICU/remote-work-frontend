"use client";

import { useEffect, useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, User as UserIcon } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface ProfileEditModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedUser: any) => void;
}

export function ProfileEditModal({ user, isOpen, onClose, onSuccess }: ProfileEditModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        location: "",
        hourlyRate: "",
        skills: "",
        avatar: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                bio: user.bio || "",
                location: user.location || "",
                hourlyRate: user.hourlyRate || "",
                skills: user.skills?.join(", ") || "",
                avatar: user.avatar || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error("File size should be less than 5MB");
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await api.post('/users/upload-avatar', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedUser = response.data;
            setFormData(prev => ({ ...prev, avatar: updatedUser.avatar }));
            onSuccess(updatedUser);
            toast.success("Avatar uploaded successfully");
        } catch (error) {
            console.error("Avatar upload failed:", error);
            toast.error("Failed to upload avatar");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate.toString()) : undefined,
                skills: formData.skills ? formData.skills.split(",").map((s: string) => s.trim()) : [],
            };

            const response = await api.patch("/users/profile", payload);

            // Update local storage
            const updatedUser = response.data;
            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully");
            onSuccess(updatedUser);
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to get full avatar URL
    const getAvatarUrl = (path: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        return `${baseUrl}${path}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your professional profile information.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4 max-h-[80vh] overflow-y-auto px-1">
                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="relative group">
                            <div className="h-28 w-28 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-border transition-colors group-hover:border-primary/50">
                                {formData.avatar ? (
                                    <img
                                        src={getAvatarUrl(formData.avatar) || ''}
                                        alt="Avatar Preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="h-12 w-12 text-muted-foreground" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                )}
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg border border-border"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG or GIF. Max 5MB.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="John"
                                className="rounded-xl"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Doe"
                                className="rounded-xl"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Phnom Penh, Cambodia"
                            className="rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us about yourself..."
                            className="rounded-xl min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="skills">Skills (comma separated)</Label>
                        <Input
                            id="skills"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, TypeScript, Node.js"
                            className="rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                        <Input
                            id="hourlyRate"
                            name="hourlyRate"
                            type="number"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            placeholder="25"
                            className="rounded-xl"
                        />
                    </div>

                    <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-1">
                        <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading || uploading} className="rounded-xl shadow-lg shadow-primary/20">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
