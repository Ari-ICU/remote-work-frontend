"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    MapPin,
    Calendar,
    ShieldCheck,
    Briefcase,
    BadgeCheck,
    Settings,
    Edit3,
    Clock,
    DollarSign,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { authService } from "@/lib/services/auth";
import api from "@/lib/api";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { ProfileEditModal } from "@/components/profile-edit-modal";
import { Toaster } from "@/components/ui/sonner";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                setIsLoading(false);
                router.push("/login?redirect=/profile");
                return;
            }

            try {
                const response = await api.get("/users/profile/me");
                if (response.data) {
                    setUser(response.data);
                } else {
                    // Token might be valid but user does not exist in DB
                    authService.logout();
                    router.push("/login?redirect=/profile");
                }
            } catch (error: any) {
                console.error("Failed to fetch user profile:", error);
                if (error.response?.status === 401 || error.response?.status === 404) {
                    authService.logout();
                    router.push("/login?redirect=/profile");
                } else {
                    // Fallback to local storage if it's just a network error
                    setUser(currentUser);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [router]);

    // Helper to get full avatar URL
    const getAvatarUrl = (path: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        return `${baseUrl}${path}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background/50">
            <Header />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Profile Section */}
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={fadeIn}
                        className="relative mb-8"
                    >
                        <div className="h-48 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 rounded-t-3xl border border-border"></div>
                        <div className="bg-card border-x border-b border-border rounded-b-3xl p-6 sm:p-10 shadow-sm relative pt-16 sm:pt-6">
                            <div className="absolute -top-16 left-6 sm:left-10 p-1 bg-background rounded-2xl border border-border shadow-xl">
                                <div className="h-32 w-32 rounded-xl bg-muted flex items-center justify-center overflow-hidden relative group">
                                    {user.avatar ? (
                                        <img src={getAvatarUrl(user.avatar) || ''} alt={user.firstName} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-16 w-16 text-muted-foreground" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                        <Edit3 className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 ml-0 sm:ml-40">
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                            {user.firstName} {user.lastName}
                                        </h1>
                                        {user.verified && (
                                            <BadgeCheck className="h-6 w-6 text-primary fill-primary/10" />
                                        )}
                                        <Badge variant="secondary" className="bg-primary/10 text-primary capitalize">
                                            {user.role?.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <p className="mt-2 text-muted-foreground flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {user.location || "Location not set"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" size="sm" className="rounded-xl">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
                                        onClick={() => setIsEditModalOpen(true)}
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Details
                                </h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Mail className="h-4 w-4" /> Email
                                        </span>
                                        <span className="font-medium text-foreground">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Member since
                                        </span>
                                        <span className="font-medium text-foreground">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border/50">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <BadgeCheck className="h-4 w-4" /> Status
                                        </span>
                                        <Badge variant={user.verified ? "default" : "secondary"} className="h-5">
                                            {user.verified ? "Verified" : "Pending"}
                                        </Badge>
                                    </div>
                                    {user.hourlyRate && (
                                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" /> Hourly Rate
                                            </span>
                                            <span className="font-bold text-primary">${user.hourlyRate}/hr</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill: string) => (
                                            <Badge key={skill} variant="secondary" className="px-3 py-1 bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 cursor-default">
                                                {skill}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Content Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2 space-y-8"
                        >
                            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-bold mb-4">About Me</h3>
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                    {user.bio || "No bio information provided. Tell the world about yourself!"}
                                </p>
                            </div>

                            {/* Recent Activity or Projects could go here */}
                            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Briefcase className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Manage Your Activity</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
                                        View and manage your job applications, postings and messages in one place.
                                    </p>
                                </div>
                                <Button variant="secondary" className="rounded-xl">
                                    Go to Dashboard
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <ProfileEditModal
                user={user}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={(updatedUser) => setUser(updatedUser)}
            />

            <Toaster position="top-center" />
            <Footer />
        </div>
    );
}
