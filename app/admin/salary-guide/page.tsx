"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Briefcase,
    TrendingUp,
    DollarSign,
    Users,
    Award,
    BarChart3,
    HelpCircle,
} from "lucide-react";
import {
    salaryGuideService,
    SalaryGuideData,
    SalaryCategory,
    SalaryInsight,
    SalaryRole,
} from "@/lib/services/salary-guide";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const IconMap: { [key: string]: any } = {
    TrendingUp,
    DollarSign,
    Users,
    Award,
    Briefcase,
    BarChart3,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const Icon = IconMap[name] || HelpCircle;
    return <Icon className={className} />;
}

export default function AdminSalaryGuidePage() {
    const [data, setData] = useState<SalaryGuideData | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog states
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isInsightDialogOpen, setIsInsightDialogOpen] = useState(false);

    // Form states
    const [editingCategory, setEditingCategory] = useState<SalaryCategory | null>(
        null,
    );
    const [editingRole, setEditingRole] = useState<SalaryRole | null>(null);
    const [editingInsight, setEditingInsight] = useState<SalaryInsight | null>(
        null,
    );
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

    const fetchData = async () => {
        try {
            const result = await salaryGuideService.getSalaryData();
            setData(result);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch salary guide data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const order = parseInt(formData.get("order") as string) || 0;

        try {
            if (editingCategory) {
                await salaryGuideService.updateCategory(editingCategory.id, {
                    name,
                    order,
                });
            } else {
                await salaryGuideService.createCategory({ name, order });
            }
            toast({ title: "Success", description: "Category saved successfully" });
            setIsCategoryDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save category",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (
            !confirm("Are you sure you want to delete this category and all its roles?")
        )
            return;
        try {
            await salaryGuideService.deleteCategory(id);
            toast({ title: "Success", description: "Category deleted" });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete category",
                variant: "destructive",
            });
        }
    };

    const handleSaveRole = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const range = formData.get("range") as string;
        const experience = formData.get("experience") as string;
        const categoryId = formData.get("categoryId") as string || selectedCategoryId;

        try {
            if (editingRole) {
                await salaryGuideService.updateRole(editingRole.id, {
                    title,
                    range,
                    experience,
                });
            } else {
                await salaryGuideService.createRole({
                    title,
                    range,
                    experience,
                    categoryId,
                });
            }
            toast({ title: "Success", description: "Role saved successfully" });
            setIsRoleDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save role",
                variant: "destructive",
            });
        }
    };

    const handleDeleteRole = async (id: string) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
        try {
            await salaryGuideService.deleteRole(id);
            toast({ title: "Success", description: "Role deleted" });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete role",
                variant: "destructive",
            });
        }
    };

    const handleSaveInsight = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const icon = formData.get("icon") as string;
        const color = formData.get("color") as string;
        const bg = formData.get("bg") as string;
        const order = parseInt(formData.get("order") as string) || 0;

        try {
            if (editingInsight) {
                await salaryGuideService.updateInsight(editingInsight.id, {
                    title,
                    description,
                    icon,
                    color,
                    bg,
                    order,
                });
            } else {
                await salaryGuideService.createInsight({
                    title,
                    description,
                    icon,
                    color,
                    bg,
                    order,
                });
            }
            toast({ title: "Success", description: "Insight saved successfully" });
            setIsInsightDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save insight",
                variant: "destructive",
            });
        }
    };

    const handleDeleteInsight = async (id: string) => {
        if (!confirm("Are you sure you want to delete this insight?")) return;
        try {
            await salaryGuideService.deleteInsight(id);
            toast({ title: "Success", description: "Insight deleted" });
            fetchData();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete insight",
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">
                Loading management console...
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                        Salary Guide Management
                    </h1>
                    <p className="text-gray-400">
                        Control market insights and role-based salary ranges.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="roles" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 mb-6 rounded-2xl">
                    <TabsTrigger
                        value="roles"
                        className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
                    >
                        Categories & Roles
                    </TabsTrigger>
                    <TabsTrigger
                        value="insights"
                        className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
                    >
                        Market Insights
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="roles" className="space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Categories</h2>
                                <p className="text-sm text-gray-400">
                                    Define job groups and hierarchical groupings.
                                </p>
                            </div>
                        </div>
                        <Dialog
                            open={isCategoryDialogOpen}
                            onOpenChange={(open) => {
                                setIsCategoryDialogOpen(open);
                                if (!open) setEditingCategory(null);
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-black hover:bg-primary/90 rounded-xl font-bold px-6">
                                    <Plus className="mr-2 h-4 w-4" /> Add Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#111] border-white/10 text-white rounded-3xl sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingCategory ? "Edit Category" : "New Salary Category"}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSaveCategory} className="space-y-6 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cat-name">Category Name</Label>
                                        <Input
                                            id="cat-name"
                                            name="name"
                                            defaultValue={editingCategory?.name}
                                            className="bg-white/5 border-white/10 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cat-order">Display Order</Label>
                                        <Input
                                            id="cat-order"
                                            name="order"
                                            type="number"
                                            defaultValue={editingCategory?.order}
                                            className="bg-white/5 border-white/10 rounded-xl"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsCategoryDialogOpen(false)}
                                            className="rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-primary text-black hover:bg-primary/90 rounded-xl font-bold px-8"
                                        >
                                            Save Category
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {data?.categories.map((category) => (
                            <Card
                                key={category.id}
                                className="bg-black/40 border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm group"
                            >
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <Briefcase size={20} />
                                            </div>
                                            <CardTitle className="text-2xl">{category.name}</CardTitle>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-primary/20 hover:text-primary rounded-xl"
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    setIsCategoryDialogOpen(true);
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-red-500/20 hover:text-red-400 rounded-xl"
                                                onClick={() => handleDeleteCategory(category.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-white/10 rounded-xl"
                                                onClick={() => {
                                                    setEditingRole(null);
                                                    setSelectedCategoryId(category.id);
                                                    setIsRoleDialogOpen(true);
                                                }}
                                            >
                                                <Plus className="mr-2 h-4 w-4" /> Add Role
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/5 hover:bg-transparent">
                                                <TableHead className="text-gray-500 uppercase text-[10px] font-bold tracking-widest px-6">
                                                    Role Title
                                                </TableHead>
                                                <TableHead className="text-gray-500 uppercase text-[10px] font-bold tracking-widest px-6">
                                                    Salary Range
                                                </TableHead>
                                                <TableHead className="text-gray-500 uppercase text-[10px] font-bold tracking-widest px-6">
                                                    Experience
                                                </TableHead>
                                                <TableHead className="text-right text-gray-500 uppercase text-[10px] font-bold tracking-widest px-6">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {category.roles.length === 0 ? (
                                                <TableRow className="border-transparent hover:bg-transparent">
                                                    <TableCell
                                                        colSpan={4}
                                                        className="text-center py-8 text-gray-500 italic"
                                                    >
                                                        No roles defined in this category.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                category.roles.map((role) => (
                                                    <TableRow
                                                        key={role.id}
                                                        className="border-white/5 hover:bg-white/[0.02] transition-colors group/row"
                                                    >
                                                        <TableCell className="px-6 font-medium text-white">
                                                            {role.title}
                                                        </TableCell>
                                                        <TableCell className="px-6 text-primary font-bold">
                                                            {role.range}
                                                        </TableCell>
                                                        <TableCell className="px-6 text-gray-400">
                                                            {role.experience}
                                                        </TableCell>
                                                        <TableCell className="px-6 text-right">
                                                            <div className="flex justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 hover:bg-primary/20 hover:text-primary rounded-lg"
                                                                    onClick={() => {
                                                                        setEditingRole(role);
                                                                        setIsRoleDialogOpen(true);
                                                                    }}
                                                                >
                                                                    <Pencil size={14} />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 hover:bg-red-500/20 hover:text-red-400 rounded-lg"
                                                                    onClick={() => handleDeleteRole(role.id)}
                                                                >
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Dialog
                        open={isRoleDialogOpen}
                        onOpenChange={(open) => {
                            setIsRoleDialogOpen(open);
                            if (!open) {
                                setEditingRole(null);
                                setSelectedCategoryId("");
                            }
                        }}
                    >
                        <DialogContent className="bg-[#111] border-white/10 text-white rounded-3xl sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingRole ? "Edit Role" : "Add Role"}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSaveRole} className="space-y-6 pt-4">
                                {!editingRole && !selectedCategoryId && (
                                    <div className="space-y-2">
                                        <Label htmlFor="cat-id-select">Category</Label>
                                        <Select name="categoryId" required>
                                            <SelectTrigger className="bg-white/5 border-white/10 rounded-xl">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#111] border-white/10 text-white">
                                                {data?.categories.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="role-title">Role Title</Label>
                                    <Input
                                        id="role-title"
                                        name="title"
                                        defaultValue={editingRole?.title}
                                        className="bg-white/5 border-white/10 rounded-xl"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role-range">
                                        Salary Range (e.g., $1,000 - $2,000)
                                    </Label>
                                    <Input
                                        id="role-range"
                                        name="range"
                                        defaultValue={editingRole?.range}
                                        className="bg-white/5 border-white/10 rounded-xl"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role-exp">
                                        Experience Level (e.g., 2-5 years)
                                    </Label>
                                    <Input
                                        id="role-exp"
                                        name="experience"
                                        defaultValue={editingRole?.experience}
                                        className="bg-white/5 border-white/10 rounded-xl"
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsRoleDialogOpen(false)}
                                        className="rounded-xl"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-primary text-black hover:bg-primary/90 rounded-xl font-bold px-8"
                                    >
                                        Save Role
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                    <div className="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Market Insights</h2>
                                <p className="text-sm text-gray-400">
                                    Manage the highlight cards shown at the top of the guide.
                                </p>
                            </div>
                        </div>
                        <Dialog
                            open={isInsightDialogOpen}
                            onOpenChange={(open) => {
                                setIsInsightDialogOpen(open);
                                if (!open) setEditingInsight(null);
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-black hover:bg-primary/90 rounded-xl font-bold px-6">
                                    <Plus className="mr-2 h-4 w-4" /> Add Insight
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#111] border-white/10 text-white rounded-3xl sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingInsight ? "Edit Insight" : "New Market Insight"}
                                    </DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSaveInsight} className="space-y-6 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ins-title">Title</Label>
                                            <Input
                                                id="ins-title"
                                                name="title"
                                                defaultValue={editingInsight?.title}
                                                className="bg-white/5 border-white/10 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ins-icon">Icon (Lucide name)</Label>
                                            <Input
                                                id="ins-icon"
                                                name="icon"
                                                defaultValue={editingInsight?.icon}
                                                className="bg-white/5 border-white/10 rounded-xl"
                                                placeholder="TrendingUp, Users, etc."
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ins-desc">Description</Label>
                                        <Input
                                            id="ins-desc"
                                            name="description"
                                            defaultValue={editingInsight?.description}
                                            className="bg-white/5 border-white/10 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="ins-color">Text Color Class</Label>
                                            <Input
                                                id="ins-color"
                                                name="color"
                                                defaultValue={editingInsight?.color}
                                                className="bg-white/5 border-white/10 rounded-xl"
                                                placeholder="text-green-500"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="ins-bg">Background Class</Label>
                                            <Input
                                                id="ins-bg"
                                                name="bg"
                                                defaultValue={editingInsight?.bg}
                                                className="bg-white/5 border-white/10 rounded-xl"
                                                placeholder="bg-green-500/10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ins-order">Order</Label>
                                        <Input
                                            id="ins-order"
                                            name="order"
                                            type="number"
                                            defaultValue={editingInsight?.order}
                                            className="bg-white/5 border-white/10 rounded-xl"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsInsightDialogOpen(false)}
                                            className="rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-primary text-black hover:bg-primary/90 rounded-xl font-bold px-8"
                                        >
                                            Save Insight
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data?.insights.map((insight) => (
                            <Card
                                key={insight.id}
                                className="bg-black/40 border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-sm relative group"
                            >
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div
                                            className={`w-14 h-14 rounded-2xl ${insight.bg} flex items-center justify-center`}
                                        >
                                            <div className={insight.color}>
                                                <DynamicIcon name={insight.icon} className="w-7 h-7" />
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 hover:bg-primary/20 hover:text-primary rounded-xl"
                                                onClick={() => {
                                                    setEditingInsight(insight);
                                                    setIsInsightDialogOpen(true);
                                                }}
                                            >
                                                <Pencil size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-10 w-10 hover:bg-red-500/20 hover:text-red-400 rounded-xl"
                                                onClick={() => handleDeleteInsight(insight.id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {insight.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {insight.description}
                                    </p>
                                    <div className="mt-4 flex gap-4">
                                        <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500">
                                            {insight.color}
                                        </span>
                                        <span className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-gray-500">
                                            {insight.bg}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
