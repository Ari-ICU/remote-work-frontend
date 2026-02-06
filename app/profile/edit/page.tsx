"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    User,
    Mail,
    MapPin,
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
    Save,
    ArrowLeft,
    Plus,
    Trash2,
    GraduationCap,
    Languages,
    FileText,
    Upload,
    CheckCircle2,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { authService } from "@/lib/services/auth";
import api from "@/lib/api";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { User as UserType, Experience, Education } from "@/types/user";

export default function EditProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resumeInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        location: "",
        headline: "",
        website: "",
        github: "",
        linkedin: "",
        hourlyRate: "",
        skills: [] as string[],
        languages: [] as string[],
        experience: [] as Experience[],
        education: [] as Education[],
        avatar: "",
        resumeUrl: "",
        resumeTemplate: ""
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                router.push("/login?redirect=/profile/edit");
                return;
            }

            try {
                const response = await api.get("/users/profile/me");
                const userData = response.data;
                setUser(userData);
                setFormData({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    bio: userData.bio || "",
                    location: userData.location || "",
                    headline: userData.headline || "",
                    website: userData.website || "",
                    github: userData.github || "",
                    linkedin: userData.linkedin || "",
                    hourlyRate: userData.hourlyRate?.toString() || "",
                    skills: userData.skills || [],
                    languages: userData.languages || [],
                    experience: userData.experience || [],
                    education: userData.education || [],
                    avatar: userData.avatar || "",
                    resumeUrl: userData.resumeUrl || "",
                    resumeTemplate: userData.resumeTemplate || ""
                });
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                router.push("/profile");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await api.post('/users/avatar', uploadData);
            setFormData(prev => ({ ...prev, avatar: response.data.avatar }));
            toast.success("Avatar updated");
        } catch (error) {
            toast.error("Failed to upload avatar");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingResume(true);
        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const response = await api.post('/users/resume', uploadData);
            setFormData(prev => ({ ...prev, resumeUrl: response.data.resumeUrl }));
            toast.success("Resume uploaded");
        } catch (error) {
            toast.error("Failed to upload resume");
        } finally {
            setUploadingResume(false);
        }
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
            };
            const response = await api.patch("/users/profile", payload);
            localStorage.setItem("user", JSON.stringify(response.data));
            toast.success("Profile saved successfully");
            router.push("/profile");
        } catch (error) {
            toast.error("Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    const addItem = (field: 'experience' | 'education') => {
        if (field === 'experience') {
            setFormData(prev => ({
                ...prev,
                experience: [...prev.experience, { company: "", role: "", duration: "", description: "" }]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                education: [...prev.education, { school: "", degree: "", year: "" }]
            }));
        }
    };

    const removeItem = (field: 'experience' | 'education', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateItem = (field: 'experience' | 'education', index: number, key: string, value: string) => {
        setFormData(prev => {
            const newItems = [...prev[field]];
            (newItems[index] as any)[key] = value;
            return { ...prev, [field]: newItems };
        });
    };

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const val = e.currentTarget.value.trim();
            if (val && !formData.skills.includes(val)) {
                setFormData(prev => ({ ...prev, skills: [...prev.skills, val] }));
                e.currentTarget.value = "";
            }
        }
    };

    const getAvatarUrl = (path: string) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        return `${baseUrl}${path}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background/50">
            <Header />

            <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
                                <p className="text-muted-foreground">Manage your professional identity and presence.</p>
                            </div>
                        </div>
                        <Button onClick={handleSubmit} disabled={isSaving} className="rounded-xl px-6 shadow-lg shadow-primary/20">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>

                    <Tabs defaultValue="general" className="space-y-8">
                        <TabsList className="bg-card border border-border p-1 rounded-2xl w-full sm:w-auto h-auto grid grid-cols-2 sm:flex sm:flex-wrap gap-1">
                            <TabsTrigger value="general" className="rounded-xl px-6 py-2">General</TabsTrigger>
                            <TabsTrigger value="experience" className="rounded-xl px-6 py-2">Experience</TabsTrigger>
                            <TabsTrigger value="skills" className="rounded-xl px-6 py-2">Skills & Langs</TabsTrigger>
                            <TabsTrigger value="resume" className="rounded-xl px-6 py-2">CV / Resume</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-6">
                            <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Your public profile details seen by others.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/50">
                                        <div className="relative group">
                                            <div className="h-24 w-24 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-border shadow-inner">
                                                {formData.avatar ? (
                                                    <img src={getAvatarUrl(formData.avatar) || ''} className="h-full w-full object-cover" alt="Avatar" />
                                                ) : (
                                                    <User className="h-10 w-10 text-muted-foreground" />
                                                )}
                                                {uploadingAvatar && (
                                                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg border border-border"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploadingAvatar}
                                            >
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                        </div>
                                        <div className="flex-1 space-y-1 text-center sm:text-left">
                                            <h4 className="font-semibold text-lg">Profile Picture</h4>
                                            <p className="text-sm text-muted-foreground">Upload a clear photo for better recognition.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="rounded-xl" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="headline">Headline</Label>
                                        <Input id="headline" name="headline" value={formData.headline} onChange={handleInputChange} placeholder="e.g. Senior Product Designer" className="rounded-xl" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about yourself..." className="rounded-xl min-h-[120px]" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="location">Location</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="location" name="location" value={formData.location} onChange={handleInputChange} className="rounded-xl pl-10" placeholder="Phnom Penh" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="hourlyRate" name="hourlyRate" type="number" value={formData.hourlyRate} onChange={handleInputChange} className="rounded-xl pl-10" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border-border/50 shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle>Professional Links</CardTitle>
                                    <CardDescription>Where else can clients find you?</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="website" name="website" value={formData.website} onChange={handleInputChange} className="rounded-xl pl-10" placeholder="https://..." />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="github">GitHub</Label>
                                            <div className="relative">
                                                <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="github" name="github" value={formData.github} onChange={handleInputChange} className="rounded-xl pl-10" placeholder="username" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="linkedin">LinkedIn</Label>
                                            <div className="relative">
                                                <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="rounded-xl pl-10" placeholder="username" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="experience" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Work History</h3>
                                <Button onClick={() => addItem('experience')} variant="outline" className="rounded-xl border-dashed">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Position
                                </Button>
                            </div>

                            {formData.experience.length === 0 ? (
                                <div className="bg-card border-2 border-dashed border-border rounded-3xl p-12 text-center">
                                    <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground">No experience items added yet.</p>
                                    <Button variant="link" onClick={() => addItem('experience')} className="text-primary mt-2">Add your first role</Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.experience.map((exp, index) => (
                                        <Card key={index} className="rounded-3xl border-border/50 relative group">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeItem('experience', index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Company</Label>
                                                        <Input value={exp.company} onChange={(e) => updateItem('experience', index, 'company', e.target.value)} placeholder="e.g. Acme Inc" className="rounded-xl" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Role</Label>
                                                        <Input value={exp.role} onChange={(e) => updateItem('experience', index, 'role', e.target.value)} placeholder="e.g. Frontend Developer" className="rounded-xl" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Duration</Label>
                                                    <Input value={exp.duration} onChange={(e) => updateItem('experience', index, 'duration', e.target.value)} placeholder="e.g. Jan 2022 - Present" className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea value={exp.description} onChange={(e) => updateItem('experience', index, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." className="rounded-xl min-h-[80px]" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            <div className="pt-8 flex items-center justify-between border-t border-border/50">
                                <h3 className="text-xl font-bold">Education</h3>
                                <Button onClick={() => addItem('education')} variant="outline" className="rounded-xl border-dashed">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Education
                                </Button>
                            </div>

                            {formData.education.length === 0 ? (
                                <div className="bg-card border-2 border-dashed border-border rounded-3xl p-12 text-center">
                                    <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                    <p className="text-muted-foreground">No education items added yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {formData.education.map((edu, index) => (
                                        <Card key={index} className="rounded-3xl border-border/50 relative group">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeItem('education', index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <CardContent className="pt-6 space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>School / University</Label>
                                                        <Input value={edu.school} onChange={(e) => updateItem('education', index, 'school', e.target.value)} placeholder="e.g. University of Cambodia" className="rounded-xl" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Degree / Certificate</Label>
                                                        <Input value={edu.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} placeholder="e.g. Bachelor in CS" className="rounded-xl" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Year</Label>
                                                    <Input value={edu.year} onChange={(e) => updateItem('education', index, 'year', e.target.value)} placeholder="e.g. 2018 - 2022" className="rounded-xl" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="skills" className="space-y-6">
                            <Card className="rounded-3xl border-border/50 shadow-sm">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2">
                                        <BadgeCheck className="h-5 w-5 text-primary" />
                                        Tags & Skills
                                    </CardTitle>
                                    <CardDescription>Add keywords that best describe your expertise.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-4">
                                        <Label>Add Skills</Label>
                                        <div className="flex flex-wrap gap-2 p-3 bg-muted/20 rounded-2xl min-h-[50px] border border-border/50">
                                            {formData.skills.map(skill => (
                                                <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1.5 flex items-center gap-1.5 bg-background border-border group">
                                                    {skill}
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-4 w-4 rounded-full p-0 flex items-center justify-center opacity-60 group-hover:opacity-100"
                                                        onClick={() => toggleSkill(skill)}
                                                    >
                                                        <Plus className="h-3 w-3 rotate-45" />
                                                    </Button>
                                                </Badge>
                                            ))}
                                            <input
                                                onKeyDown={addSkill}
                                                className="bg-transparent border-none outline-none text-sm ml-2 flex-1 min-w-[120px]"
                                                placeholder="Type and press Enter..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-border/50">
                                        <Label className="flex items-center gap-2">
                                            <Languages className="h-4 w-4 text-primary" />
                                            Languages
                                        </Label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {['English', 'Khmer', 'Chinese', 'French', 'Japanese', 'Korean'].map(lang => (
                                                <div
                                                    key={lang}
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            languages: prev.languages.includes(lang)
                                                                ? prev.languages.filter(l => l !== lang)
                                                                : [...prev.languages, lang]
                                                        }))
                                                    }}
                                                    className={`
                                                        px-4 py-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between
                                                        ${formData.languages.includes(lang)
                                                            ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                                                            : 'border-border bg-card'
                                                        }
                                                    `}
                                                >
                                                    <span className="text-sm font-medium">{lang}</span>
                                                    {formData.languages.includes(lang) && <CheckCircle2 className="h-4 w-4" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="resume" className="space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col">
                                    <CardHeader className="bg-muted/30">
                                        <CardTitle className="flex items-center gap-2">
                                            <Upload className="h-5 w-5 text-primary" />
                                            Upload Resume
                                        </CardTitle>
                                        <CardDescription>Upload your own PDF or Word document.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-8 flex-1 flex flex-col items-center justify-center space-y-6">
                                        <div
                                            className="w-full max-w-xs aspect-[4/5] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-muted/5 group hover:border-primary/50 transition-colors cursor-pointer"
                                            onClick={() => resumeInputRef.current?.click()}
                                        >
                                            {formData.resumeUrl ? (
                                                <div className="space-y-4">
                                                    <div className="h-20 w-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto shadow-sm">
                                                        <FileText className="h-10 w-10 text-primary" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-sm truncate max-w-[180px]">
                                                            {formData.resumeUrl.split('/').pop()}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">Resume uploaded</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary/10 transition-colors">
                                                        <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="font-semibold text-sm">Click to upload</p>
                                                        <p className="text-xs text-muted-foreground">PDF or DOCX max 10MB</p>
                                                    </div>
                                                </div>
                                            )}
                                            {uploadingResume && (
                                                <div className="absolute inset-0 bg-background/60 rounded-3xl flex items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                </div>
                                            )}
                                        </div>
                                        <input type="file" ref={resumeInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />

                                        {formData.resumeUrl && (
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl"
                                                    onClick={() => window.open(getAvatarUrl(formData.resumeUrl) || '', '_blank')}
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    View File
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="rounded-xl text-destructive hover:bg-destructive/10"
                                                    onClick={() => setFormData(prev => ({ ...prev, resumeUrl: "" }))}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden flex flex-col">
                                    <CardHeader className="bg-muted/30">
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-primary" />
                                            Resume Templates
                                        </CardTitle>
                                        <CardDescription>Select a professional template and build it here.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6 grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'modern', name: 'Modern', color: 'bg-blue-500' },
                                            { id: 'minimal', name: 'Minimalist', color: 'bg-slate-800' },
                                            { id: 'creative', name: 'Creative', color: 'bg-purple-600' },
                                            { id: 'classic', name: 'Executive', color: 'bg-amber-800' }
                                        ].map(template => (
                                            <div
                                                key={template.id}
                                                onClick={() => setFormData(prev => ({ ...prev, resumeTemplate: template.id }))}
                                                className={`
                                                    relative group cursor-pointer rounded-2xl border-2 transition-all p-4 flex flex-col gap-3
                                                    ${formData.resumeTemplate === template.id ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'}
                                                `}
                                            >
                                                <div className={`aspect-[4/3] w-full rounded-lg ${template.color}/20 flex items-center justify-center overflow-hidden border border-border/50`}>
                                                    <div className="w-12 h-16 bg-white overflow-hidden shadow-sm flex flex-col p-1 gap-1">
                                                        <div className={`w-full h-2 ${template.color}`}></div>
                                                        <div className="w-full h-1 bg-muted"></div>
                                                        <div className="w-2/3 h-1 bg-muted"></div>
                                                        <div className="grid grid-cols-2 gap-1 mt-1">
                                                            <div className="h-4 bg-muted/40"></div>
                                                            <div className="h-4 bg-muted/40"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-center">{template.name}</span>
                                                {formData.resumeTemplate === template.id && (
                                                    <div className="absolute top-2 right-2 h-5 w-5 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                    <CardFooter className="bg-muted/10 p-4 border-t border-border/50">
                                        <p className="text-xs text-muted-foreground text-center w-full">
                                            Templates will automatically use your profile information.
                                        </p>
                                    </CardFooter>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Toaster position="top-center" />
            <Footer />
        </div>
    );
}
