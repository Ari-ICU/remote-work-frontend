"use client";

import { useState, useEffect, useRef } from "react";
import { adminService } from "@/lib/services/admin";
import {
    Save,
    Bell,
    Lock,
    Globe,
    Shield,
    Zap,
    Cpu,
    Database,
    Cloud,
    Mail,
    Smartphone,
    Server,
    Clock,
    Palette,
    Upload,
    Image as ImageIcon,
    FileText,
    Monitor,
    Key,
    Trash2,
    RefreshCw,
    Users,
    CheckCircle,
    DollarSign,
    AlertCircle,
    ShieldCheck,
    Plus,
    Trash
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminSettings() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Platform Protocol Updated", {
                description: "New configuration settings are now propagate across all nodes.",
                style: { background: '#111', color: '#fff', border: '1px solid color-mix(in srgb, var(--primary), transparent 80%)' }
            });
        }, 1500);
    };

    return (
        <div className="space-y-10 pb-20 selection:bg-primary/30">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                        <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">Global Core Settings</h1>
                </div>
                <p className="text-gray-500 font-medium max-w-2xl mt-3">
                    Modify the platform's architectural parameters, security protocols, and external service integrations.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-white/5 border border-white/5 p-1.5 rounded-2xl mb-8 flex w-full overflow-x-auto custom-scrollbar whitespace-nowrap justify-start lg:justify-center">
                    <TabsTrigger value="general" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black font-bold transition-all">
                        <div className="flex items-center gap-2">
                            <Globe size={16} /> General
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black font-bold transition-all">
                        <div className="flex items-center gap-2">
                            <Bell size={16} /> Intelligence
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black font-bold transition-all">
                        <div className="flex items-center gap-2">
                            <Shield size={16} /> Security
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="api" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black font-bold transition-all">
                        <div className="flex items-center gap-2">
                            <Cloud size={16} /> Integrations
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black font-bold transition-all">
                        <div className="flex items-center gap-2">
                            <Palette size={16} /> Brand & Theme
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-black font-bold transition-all">
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} /> Pricing Plans
                        </div>
                    </TabsTrigger>
                </TabsList>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <TabsContent value="general" className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/10 transition-colors"></div>
                                    <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <Server className="w-5 h-5 text-primary" />
                                            </div>
                                            <CardTitle className="text-xl font-bold">Base Configuration</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="site-name" className="text-xs font-black uppercase tracking-widest text-gray-400">Platform Identity</Label>
                                                <Input id="site-name" defaultValue="KhmerWork" className="h-12 bg-black/40 border-white/10 rounded-xl focus:border-primary/50 font-bold" />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="support-email" className="text-xs font-black uppercase tracking-widest text-gray-400">Operations Email</Label>
                                                <Input id="support-email" defaultValue="ops@khmerwork.com" className="h-12 bg-black/40 border-white/10 rounded-xl focus:border-primary/50 font-bold" />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 block">System Status</Label>
                                            <div className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-colors group/status">
                                                <div className="flex gap-4 items-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover/status:bg-primary/20 transition-colors">
                                                        <Zap className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black uppercase">Stealth Maintenance Mode</p>
                                                        <p className="text-xs text-gray-500 font-medium">Render platform invisible to all non-privileged personnel.</p>
                                                    </div>
                                                </div>
                                                <Switch id="maintenance" className="data-[state=checked]:bg-primary" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="flex justify-end gap-4 pb-10">
                                    <Button variant="outline" className="h-12 px-8 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 font-bold">Discard</Button>
                                    <Button onClick={handleSave} disabled={loading} className="h-12 px-10 bg-primary text-black font-black rounded-xl hover:bg-primary/90 shadow-[0_10px_30px_color-mix(in_srgb,var(--primary),transparent_70%)] gap-3">
                                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                        {loading ? "Syncing..." : "Update Protocol"}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden border-l-4 border-l-primary/40">
                                    <CardHeader className="p-6">
                                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Node Statistics</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6 pt-0">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                                <span>Core CPU Load</span>
                                                <span className="text-primary">12%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[12%] rounded-full shadow-[0_0_10px_color-mix(in_srgb,var(--primary),transparent_50%)]"></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                                <span>Neural Mesh Buffer</span>
                                                <span className="text-blue-400">42%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[42%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden p-6 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-rose-500/10 flex items-center justify-center mx-auto text-rose-500 mb-2">
                                        <Trash2 size={32} />
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight">Zone Purge</h3>
                                    <p className="text-xs text-gray-500 font-medium">Permanently deletes all platform activity and reset ecosystem cache.</p>
                                    <Button variant="outline" className="w-full h-11 border-rose-500/20 text-rose-500 bg-rose-500/5 hover:bg-rose-500 hover:text-white rounded-xl font-black">PURGE DATA</Button>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                        <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden">
                            <CardHeader className="p-8 bg-white/[0.02] border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                                        <Bell size={24} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold">Operational Intelligence</CardTitle>
                                        <CardDescription className="text-gray-500">Configure real-time alerts and system notifications.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-2">
                                {[
                                    { label: "Entity Ingress", desc: "Notify when a new user joins the platform mesh.", icon: Users },
                                    { label: "Mission Verification", desc: "Notify when a new job mission is staged for review.", icon: CheckCircle },
                                    { label: "Financial Event", desc: "Notify on every successful credit transfer.", icon: DollarSign },
                                    { label: "Neural Drift Alert", desc: "Immediate notification for critical matching engine failure.", icon: AlertCircle }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 hover:bg-white/[0.02] rounded-2xl transition-colors border border-transparent hover:border-white/5 group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <item.icon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black uppercase italic tracking-wider">{item.label}</p>
                                                <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-6">
                        <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden p-8 space-y-10">
                            <div>
                                <h3 className="text-xl font-black mb-1 flex items-center gap-3 italic tracking-tight">
                                    <Lock className="text-primary" /> Perimeter Defense
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">Global access control and encryption protocols.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Smartphone className="text-gray-500" />
                                            <p className="text-sm font-bold">Biometric / Two-Factor Auth</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <p className="text-xs text-gray-600">Force multi-layered verification for all Level 10 personnel.</p>
                                </div>
                                <div className="space-y-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Clock className="text-gray-500" />
                                            <p className="text-sm font-bold">Automated Session Purge</p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <p className="text-xs text-gray-600">Terminate inactive privileged sessions after 600 seconds.</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button variant="outline" className="w-full h-14 border-dashed border-white/10 text-gray-500 font-black hover:text-primary hover:border-primary/40 rounded-2xl uppercase tracking-[0.2em] text-[10px]">
                                    Configure Firewall Rules
                                </Button>
                            </div>
                        </Card>
                    </TabsContent>

                    <TabsContent value="api" className="space-y-6">
                        <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden">
                            <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                                <CardTitle className="text-xl font-bold flex items-center gap-3">
                                    <Key size={24} className="text-amber-400" />
                                    Credential Vault
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <Label htmlFor="stripe-key" className="text-xs font-black uppercase tracking-widest text-gray-500">Stripe Secret Matrix</Label>
                                    <div className="relative group/key">
                                        <Input id="stripe-key" type="password" value="sk_test_••••••••••••••••••••" readOnly className="h-14 bg-black/40 border-white/10 rounded-xl pr-32 font-mono group-hover/key:border-primary/30 transition-all" />
                                        <Button variant="ghost" className="absolute right-2 top-2 h-10 text-[10px] font-black uppercase text-gray-500 hover:text-white">Rotate Key</Button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label htmlFor="openai-key" className="text-xs font-black uppercase tracking-widest text-gray-500">OpenAI Neural Processor (Match Engine)</Label>
                                    <div className="relative group/key">
                                        <Input id="openai-key" type="password" value="sk_test_••••••••••••••••••••" readOnly className="h-14 bg-black/40 border-white/10 rounded-xl pr-32 font-mono group-hover/key:border-primary/30 transition-all" />
                                        <Button variant="ghost" className="absolute right-2 top-2 h-10 text-[10px] font-black uppercase text-gray-500 hover:text-white">Rotate Key</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="branding" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden">
                                <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <ImageIcon className="w-5 h-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl font-bold">Visual Identity</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Platform Logo</Label>
                                        <div className="border-2 border-dashed border-white/5 rounded-3xl p-10 text-center hover:border-primary/20 transition-all group/upload cursor-pointer">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover/upload:bg-primary/10 transition-colors">
                                                <Upload className="w-8 h-8 text-gray-500 group-hover/upload:text-primary transition-colors" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-300">Drop your logo here</p>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">SVG, PNG or WEBP (Max 2MB)</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Favicon Matrix</Label>
                                        <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                                <ShieldCheck className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold uppercase">favicon_shield_v2.ico</p>
                                                <p className="text-[10px] text-gray-500">32x32 pixels • System Default</p>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-xs font-bold hover:text-red-400">Remove</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden">
                                <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <Monitor className="w-5 h-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl font-bold">Interface Chromatics</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="space-y-6">
                                        <Label className="text-xs font-black uppercase tracking-widest text-gray-500">Primary Theme Color</Label>
                                        <div className="grid grid-cols-5 gap-4">
                                            {[
                                                { name: "Neon Mint", color: "#10b981", active: true },
                                                { name: "Cyber Blue", color: "#3b82f6", active: false },
                                                { name: "Electric Purple", color: "#8b5cf6", active: false },
                                                { name: "Sunset Orange", color: "#f59e0b", active: false },
                                                { name: "Rose Void", color: "#f43f5e", active: false }
                                            ].map((color, i) => (
                                                <button key={i} className={`h-12 w-full rounded-xl border-2 transition-all ${color.active ? 'border-primary scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-white/5 hover:border-white/20'}`} style={{ backgroundColor: color.color }}>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold uppercase">Dynamic Glassmorphism</p>
                                                <p className="text-xs text-gray-500">Enable neural blur on all interface panels.</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold uppercase">High Contrast Text</p>
                                                <p className="text-xs text-gray-500">Enhance legibility for mission-critical data.</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    <TabsContent value="pricing" className="space-y-6">
                        <PricingSettings />
                    </TabsContent>
                </motion.div>
            </Tabs>
        </div>
    );
}

function PricingSettings() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const plansEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const data = await adminService.getPricingPlans();
            setPlans(data);
        } catch (error) {
            toast.error("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePlan = async (id: string, field: string, value: any) => {
        try {
            await adminService.updatePricingPlan(id, { [field]: value });
            toast.success("Plan updated successfully");
            fetchPlans();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!confirm("Are you sure you want to delete this plan? This will affect the frontend pricing page.")) return;
        try {
            await adminService.deletePricingPlan(id);
            toast.success("Plan deleted");
            fetchPlans();
        } catch (error) {
            toast.error("Deletion failed");
        }
    };

    const handleCreatePlan = async () => {
        setIsCreating(true);
        try {
            const newPlan = {
                name: `New Tier ${Math.floor(Math.random() * 1000)}`,
                price: 0,
                description: "New subscription level description",
                features: ["Basic Feature"],
                highlight: false,
                cta: "Subscribe",
                href: "/checkout?plan=new",
                order: plans.length + 1
            };
            await adminService.createPricingPlan(newPlan);
            toast.success("New tier initialized", {
                description: "Scrolling you to the new plan matrix."
            });
            await fetchPlans();
            setTimeout(() => {
                plansEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
        } catch (error) {
            toast.error("Creation failed");
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) return (
        <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-gray-400 animate-pulse uppercase tracking-widest">Synchronizing Market Matrix...</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 gap-8">
            <Card className="bg-white/[0.03] border-white/[0.08] backdrop-blur-xl rounded-3xl overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                                <DollarSign size={24} className="text-primary" />
                                Dynamic Market Plans
                            </CardTitle>
                            <CardDescription>Configure the subscription tiers and features available to employers.</CardDescription>
                        </div>
                        <Button
                            onClick={handleCreatePlan}
                            disabled={isCreating}
                            className="bg-primary text-black hover:bg-primary/90 font-bold rounded-xl px-6 disabled:opacity-50"
                        >
                            {isCreating ? (
                                <RefreshCw size={18} className="mr-2 animate-spin" />
                            ) : (
                                <Plus size={18} className="mr-2" />
                            )}
                            {isCreating ? "Initializing..." : "Launch New Tier"}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="space-y-12">
                        {plans.map((plan) => (
                            <div key={plan.id} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeletePlan(plan.id)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash size={18} />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Tier Name</Label>
                                        <Input
                                            defaultValue={plan.name}
                                            onBlur={(e) => handleUpdatePlan(plan.id, 'name', e.target.value)}
                                            className="h-12 bg-black/40 border-white/10 rounded-xl font-bold focus:border-primary"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Unit Price ($)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <Input
                                                type="number"
                                                defaultValue={plan.price}
                                                onBlur={(e) => handleUpdatePlan(plan.id, 'price', parseFloat(e.target.value))}
                                                className="h-12 bg-black/40 border-white/10 rounded-xl pl-10 font-bold focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Highlight State</Label>
                                        <div className="flex items-center h-12 px-4 bg-black/40 border border-white/10 rounded-xl">
                                            <Switch
                                                defaultChecked={plan.highlight}
                                                onCheckedChange={(checked) => handleUpdatePlan(plan.id, 'highlight', checked)}
                                                className="data-[state=checked]:bg-primary"
                                            />
                                            <span className="ml-3 text-xs font-bold text-gray-400">Featured Tier</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Listing Badge</Label>
                                        <Input
                                            defaultValue={plan.badge || ""}
                                            placeholder="e.g. Most Popular"
                                            onBlur={(e) => handleUpdatePlan(plan.id, 'badge', e.target.value)}
                                            className="h-12 bg-black/40 border-white/10 rounded-xl font-bold focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Proposition Summary</Label>
                                    <Input
                                        defaultValue={plan.description}
                                        onBlur={(e) => handleUpdatePlan(plan.id, 'description', e.target.value)}
                                        className="h-12 bg-black/40 border-white/10 rounded-xl font-medium focus:border-primary"
                                    />
                                </div>
                                <div className="mt-8 space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Feature Matrix (Comma Separated)</Label>
                                    <Textarea
                                        defaultValue={plan.features?.join(", ") || ""}
                                        onBlur={(e) => handleUpdatePlan(plan.id, 'features', e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                                        className="min-h-[100px] bg-black/40 border-white/10 rounded-2xl p-4 font-medium focus:border-primary resize-none text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                        <div ref={plansEndRef} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
