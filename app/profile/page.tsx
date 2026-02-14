"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    Loader2,
    Globe,
    Github,
    Linkedin,
    GraduationCap,
    Languages,
    FileText,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { authService } from "@/lib/services/auth";
import api from "@/lib/api";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { User as UserType, Experience, Education } from "@/types/user";

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser, isLoading: authLoading, logout } = useAuth();
    const [user, setUser] = useState<UserType | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (authLoading) return;

            if (!authUser) {
                setIsProfileLoading(false);
                router.push("/login?redirect=/profile");
                return;
            }

            try {
                const response = await api.get("/users/profile/me");
                if (response.data) {
                    setUser(response.data);
                } else {
                    await logout();
                    router.push("/login?redirect=/profile");
                }
            } catch (error: any) {
                console.error("Failed to fetch user profile:", error);
                if (error.response?.status === 401 || error.response?.status === 404) {
                    await logout();
                    router.push("/login?redirect=/profile");
                } else {
                    setUser(authUser as any);
                }
            } finally {
                setIsProfileLoading(false);
            }
        };

        if (!authLoading) {
            fetchUserProfile();
        }
    }, [router, authLoading, authUser, logout]);

    const getAvatarUrl = (path: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        return `${baseUrl}${path}`;
    };

    if (authLoading || isProfileLoading) {
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
                                    {user.headline && (
                                        <p className="text-lg text-muted-foreground font-medium mt-1">
                                            {user.headline}
                                        </p>
                                    )}
                                    <p className="mt-2 text-muted-foreground flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {user.location || "Location not set"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        size="sm"
                                        className="rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
                                        onClick={() => router.push("/profile/edit")}
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
                            className="space-y-6"
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
                                    {user.hourlyRate && (
                                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" /> Hourly Rate
                                            </span>
                                            <span className="font-bold text-primary">${user.hourlyRate}/hr</span>
                                        </div>
                                    )}
                                    {user.website && (
                                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Globe className="h-4 w-4" /> Website
                                            </span>
                                            <a href={user.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate max-w-[150px]">
                                                {user.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                    {user.github && (
                                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Github className="h-4 w-4" /> GitHub
                                            </span>
                                            <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                                                {user.github}
                                            </a>
                                        </div>
                                    )}
                                    {user.linkedin && (
                                        <div className="flex items-center justify-between py-2 border-b border-border/50">
                                            <span className="text-muted-foreground flex items-center gap-2">
                                                <Linkedin className="h-4 w-4" /> LinkedIn
                                            </span>
                                            <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                                                {user.linkedin}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-hidden relative">
                                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                    <BadgeCheck className="h-5 w-5 text-primary" />
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill: string) => (
                                            <Badge key={skill} variant="secondary" className="px-3 py-1 bg-primary/5 text-primary border-primary/10">
                                                {skill}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
                                    )}
                                </div>
                            </div>

                            {user.languages && user.languages.length > 0 && (
                                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <Languages className="h-5 w-5 text-primary" />
                                        Languages
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.languages.map((lang: string) => (
                                            <Badge key={lang} variant="outline" className="px-3 py-1">
                                                {lang}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {user.resumeUrl && (
                                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Resume
                                    </h3>
                                    <Button
                                        variant="default"
                                        className="w-full rounded-xl bg-primary shadow-lg shadow-primary/20"
                                        onClick={() => window.open(getAvatarUrl(user.resumeUrl!) || '', '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View Resume
                                    </Button>
                                </div>
                            )}
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

                            {user.experience && user.experience.length > 0 && (
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Briefcase className="h-6 w-6 text-primary" />
                                        Experience
                                    </h3>
                                    <div className="space-y-8">
                                        {user.experience.map((exp: Experience, index: number) => (
                                            <div key={index} className="relative pl-8 border-l-2 border-primary/20 last:border-0 pb-8 last:pb-0">
                                                <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-primary border-4 border-background shadow-sm"></div>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                    <h4 className="text-lg font-bold text-foreground">{exp.role}</h4>
                                                    <span className="text-sm font-medium px-3 py-1 bg-muted rounded-lg text-muted-foreground">
                                                        {exp.duration}
                                                    </span>
                                                </div>
                                                <p className="text-primary font-semibold mb-2">{exp.company}</p>
                                                <p className="text-muted-foreground text-sm leading-relaxed">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {user.education && user.education.length > 0 && (
                                <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <GraduationCap className="h-6 w-6 text-primary" />
                                        Education
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {user.education.map((edu: Education, index: number) => (
                                            <div key={index} className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                <h4 className="font-bold text-foreground mb-1">{edu.degree}</h4>
                                                <p className="text-muted-foreground text-sm mb-2">{edu.school}</p>
                                                <Badge variant="secondary" className="font-medium">
                                                    {edu.year}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                <Button
                                    variant="secondary"
                                    className="rounded-xl"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Toaster position="top-center" />
            <Footer />
        </div>
    );
}
