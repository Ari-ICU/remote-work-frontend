"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Target,
    Zap,
    Shield,
    Users,
    CheckCircle2,
    Clock,
    Award,
    Sparkles,
    MousePointer2,
    Layout,
    HelpCircle,
} from "lucide-react";
import {
    hiringSolutionsService,
    HiringSolution,
    HiringStat,
    HiringPlan,
} from "@/lib/services/hiring-solutions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

const IconMap: { [key: string]: any } = {
    Target,
    Zap,
    Shield,
    Users,
    CheckCircle2,
    Clock,
    Award,
    Sparkles,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const Icon = IconMap[name] || HelpCircle;
    return <Icon className={className} />;
}

export default function AdminHiringSolutionsPage() {
    const [solutions, setSolutions] = useState<HiringSolution[]>([]);
    const [stats, setStats] = useState<HiringStat[]>([]);
    const [plans, setPlans] = useState<HiringPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog states
    const [isSolutionDialogOpen, setIsSolutionDialogOpen] = useState(false);
    const [isStatDialogOpen, setIsStatDialogOpen] = useState(false);
    const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);

    // Form states
    const [editingSolution, setEditingSolution] = useState<HiringSolution | null>(null);
    const [editingStat, setEditingStat] = useState<HiringStat | null>(null);
    const [editingPlan, setEditingPlan] = useState<HiringPlan | null>(null);

    const fetchData = async () => {
        try {
            const [sols, stts, plns] = await Promise.all([
                hiringSolutionsService.getSolutions(),
                hiringSolutionsService.getStats(),
                hiringSolutionsService.getPlans(),
            ]);
            setSolutions(sols);
            setStats(stts);
            setPlans(plns);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch hiring solutions data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveSolution = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            icon: formData.get("icon") as string,
            color: formData.get("color") as string,
            bg: formData.get("bg") as string,
            order: parseInt(formData.get("order") as string) || 0,
            features: (formData.get("features") as string).split("\n").filter(f => f.trim()),
        };

        try {
            if (editingSolution) {
                await hiringSolutionsService.updateSolution(editingSolution.id, data);
            } else {
                await hiringSolutionsService.createSolution(data);
            }
            toast({ title: "Success", description: "Solution saved successfully" });
            setIsSolutionDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save solution",
                variant: "destructive",
            });
        }
    };

    const handleSaveStat = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            label: formData.get("label") as string,
            value: formData.get("value") as string,
            icon: formData.get("icon") as string,
            order: parseInt(formData.get("order") as string) || 0,
        };

        try {
            if (editingStat) {
                await hiringSolutionsService.updateStat(editingStat.id, data);
            } else {
                await hiringSolutionsService.createStat(data);
            }
            toast({ title: "Success", description: "Stat saved successfully" });
            setIsStatDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save stat",
                variant: "destructive",
            });
        }
    };

    const handleSavePlan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            price: formData.get("price") as string,
            period: formData.get("period") as string,
            description: formData.get("description") as string,
            cta: formData.get("cta") as string,
            popular: formData.get("popular") === "on",
            order: parseInt(formData.get("order") as string) || 0,
            features: (formData.get("features") as string).split("\n").filter(f => f.trim()),
        };

        try {
            if (editingPlan) {
                await hiringSolutionsService.updatePlan(editingPlan.id, data);
            } else {
                await hiringSolutionsService.createPlan(data);
            }
            toast({ title: "Success", description: "Plan saved successfully" });
            setIsPlanDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save plan",
                variant: "destructive",
            });
        }
    };

    const handleDeleteSolution = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await hiringSolutionsService.deleteSolution(id);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    const handleDeleteStat = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await hiringSolutionsService.deleteStat(id);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await hiringSolutionsService.deletePlan(id);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Delete failed", variant: "destructive" });
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Hiring Solutions Management
                    </h1>
                    <p className="text-gray-400">
                        Manage content for the /hiring-solutions page.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="solutions" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 rounded-2xl">
                    <TabsTrigger value="solutions" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-black">
                        Solutions
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-black">
                        Stats
                    </TabsTrigger>
                    <TabsTrigger value="plans" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-black">
                        Plans
                    </TabsTrigger>
                </TabsList>

                {/* Solutions Tab */}
                <TabsContent value="solutions" className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingSolution(null); setIsSolutionDialogOpen(true); }} className="bg-primary text-black">
                            <Plus className="mr-2 h-4 w-4" /> Add Solution
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {solutions.map((sol) => (
                            <Card key={sol.id} className="bg-black/40 border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm group">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-14 h-14 rounded-2xl ${sol.bg} flex items-center justify-center`}>
                                            <div className={sol.color}>
                                                <DynamicIcon name={sol.icon} className="w-7 h-7" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => { setEditingSolution(sol); setIsSolutionDialogOpen(true); }}>
                                                <Pencil size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-500" onClick={() => handleDeleteSolution(sol.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{sol.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{sol.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {sol.features.map((f, i) => (
                                            <Badge key={i} variant="secondary" className="bg-white/5 border-white/10 text-gray-300">
                                                {f}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingStat(null); setIsStatDialogOpen(true); }} className="bg-primary text-black">
                            <Plus className="mr-2 h-4 w-4" /> Add Stat
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {stats.map((stat) => (
                            <Card key={stat.id} className="bg-black/40 border-white/5 rounded-2xl backdrop-blur-sm p-6 text-center group">
                                <div className="absolute top-2 right-2 flex gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingStat(stat); setIsStatDialogOpen(true); }}>
                                        <Pencil size={14} />
                                    </Button>
                                </div>
                                <DynamicIcon name={stat.icon} className="h-8 w-8 text-primary mx-auto mb-3" />
                                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-400">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Plans Tab */}
                <TabsContent value="plans" className="space-y-6">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingPlan(null); setIsPlanDialogOpen(true); }} className="bg-primary text-black">
                            <Plus className="mr-2 h-4 w-4" /> Add Plan
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <Card key={plan.id} className={`bg-black/40 border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm p-8 flex flex-col ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                        <div className="text-primary text-2xl font-bold mt-1">{plan.price}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest">{plan.period}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingPlan(plan); setIsPlanDialogOpen(true); }}>
                                            <Pencil size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm mb-6 flex-grow">{plan.description}</p>
                                <ul className="space-y-2 mb-8">
                                    {plan.features.slice(0, 5).map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                            <CheckCircle2 size={12} className="text-green-500" />
                                            {f}
                                        </li>
                                    ))}
                                    {plan.features.length > 5 && <li className="text-[10px] text-gray-500">+{plan.features.length - 5} more...</li>}
                                </ul>
                                <Button className={`w-full ${plan.popular ? 'bg-primary text-black' : 'bg-white/10 text-white'}`} disabled>
                                    {plan.cta}
                                </Button>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={isSolutionDialogOpen} onOpenChange={(open) => { setIsSolutionDialogOpen(open); if (!open) setEditingSolution(null); }}>
                <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl">
                    <DialogHeader><DialogTitle>{editingSolution ? "Edit Solution" : "Add Solution"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSaveSolution} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input name="title" defaultValue={editingSolution?.title} required className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label>Icon (Lucide name)</Label>
                                <Input name="icon" defaultValue={editingSolution?.icon} required className="bg-white/5 border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea name="description" defaultValue={editingSolution?.description} required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Text Color Class</Label>
                                <Input name="color" defaultValue={editingSolution?.color} required className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label>Background Class</Label>
                                <Input name="bg" defaultValue={editingSolution?.bg} required className="bg-white/5 border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Features (one per line)</Label>
                            <Textarea name="features" defaultValue={editingSolution?.features.join("\n")} required className="bg-white/5 border-white/10 h-32" />
                        </div>
                        <div className="space-y-2">
                            <Label>Order</Label>
                            <Input name="order" type="number" defaultValue={editingSolution?.order} className="bg-white/5 border-white/10" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-primary text-black">Save Solution</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isStatDialogOpen} onOpenChange={(open) => { setIsStatDialogOpen(open); if (!open) setEditingStat(null); }}>
                <DialogContent className="bg-[#111] border-white/10 text-white">
                    <DialogHeader><DialogTitle>{editingStat ? "Edit Stat" : "Add Stat"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSaveStat} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Label</Label>
                            <Input name="label" defaultValue={editingStat?.label} required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Value (e.g., 2,500+)</Label>
                            <Input name="value" defaultValue={editingStat?.value} required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Icon (Lucide name)</Label>
                            <Input name="icon" defaultValue={editingStat?.icon} required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Order</Label>
                            <Input name="order" type="number" defaultValue={editingStat?.order} className="bg-white/5 border-white/10" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-primary text-black">Save Stat</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isPlanDialogOpen} onOpenChange={(open) => { setIsPlanDialogOpen(open); if (!open) setEditingPlan(null); }}>
                <DialogContent className="bg-[#111] border-white/10 text-white max-w-2xl">
                    <DialogHeader><DialogTitle>{editingPlan ? "Edit Plan" : "Add Plan"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSavePlan} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input name="name" defaultValue={editingPlan?.name} required className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label>Price</Label>
                                <Input name="price" defaultValue={editingPlan?.price} required className="bg-white/5 border-white/10" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Period</Label>
                                <Input name="period" defaultValue={editingPlan?.period} required className="bg-white/5 border-white/10" />
                            </div>
                            <div className="space-y-2">
                                <Label>CTA Text</Label>
                                <Input name="cta" defaultValue={editingPlan?.cta} required className="bg-white/5 border-white/10" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea name="description" defaultValue={editingPlan?.description} required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label>Features (one per line)</Label>
                            <Textarea name="features" defaultValue={editingPlan?.features.join("\n")} required className="bg-white/5 border-white/10 h-32" />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="popular" defaultChecked={editingPlan?.popular} id="pop" />
                                <Label htmlFor="pop">Most Popular / Highlight</Label>
                            </div>
                            <div className="space-y-2 flex-grow">
                                <Label>Order</Label>
                                <Input name="order" type="number" defaultValue={editingPlan?.order} className="bg-white/5 border-white/10" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="bg-primary text-black">Save Plan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
