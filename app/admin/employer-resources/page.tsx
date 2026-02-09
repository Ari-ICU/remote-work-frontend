"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    Video,
    FileText,
    Download,
    TrendingUp,
    Users,
    Target,
    Lightbulb,
    CheckCircle2,
    HelpCircle,
    LayoutDashboard,
    Save,
    X,
    MessageSquare,
    Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    employerResourcesService,
    EmployerResourceCategory,
    EmployerFeaturedGuide,
    EmployerDownloadableResource,
    EmployerFAQ
} from "@/lib/services/employer-resources";

const IconList = [
    { name: "BookOpen", icon: BookOpen },
    { name: "Video", icon: Video },
    { name: "FileText", icon: FileText },
    { name: "Download", icon: Download },
    { name: "TrendingUp", icon: TrendingUp },
    { name: "Users", icon: Users },
    { name: "Target", icon: Target },
    { name: "Lightbulb", icon: Lightbulb },
    { name: "HelpCircle", icon: HelpCircle },
    { name: "LayoutDashboard", icon: LayoutDashboard },
    { name: "CheckCircle2", icon: CheckCircle2 },
    { name: "MessageSquare", icon: MessageSquare },
    { name: "Link", icon: LinkIcon }
];

export default function AdminEmployerResourcesPage() {
    const [categories, setCategories] = useState<EmployerResourceCategory[]>([]);
    const [guides, setGuides] = useState<EmployerFeaturedGuide[]>([]);
    const [downloads, setDownloads] = useState<EmployerDownloadableResource[]>([]);
    const [faqs, setFaqs] = useState<EmployerFAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog States
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isGuideDialogOpen, setIsGuideDialogOpen] = useState(false);
    const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
    const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false);

    // Edit States
    const [editingCategory, setEditingCategory] = useState<Partial<EmployerResourceCategory> | null>(null);
    const [editingGuide, setEditingGuide] = useState<Partial<EmployerFeaturedGuide> | null>(null);
    const [editingDownload, setEditingDownload] = useState<Partial<EmployerDownloadableResource> | null>(null);
    const [editingFaq, setEditingFaq] = useState<Partial<EmployerFAQ> | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [cats, gds, dls, fqs] = await Promise.all([
                employerResourcesService.getCategories(),
                employerResourcesService.getGuides(),
                employerResourcesService.getDownloads(),
                employerResourcesService.getFaqs()
            ]);
            setCategories(cats);
            setGuides(gds);
            setDownloads(dls);
            setFaqs(fqs);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch resource data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Category Handlers
    const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingCategory?.id) {
                await employerResourcesService.updateCategory(editingCategory.id, editingCategory);
                toast({ title: "Success", description: "Category updated successfully" });
            } else {
                await employerResourcesService.createCategory(editingCategory as any);
                toast({ title: "Success", description: "Category created successfully" });
            }
            setIsCategoryDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save category", variant: "destructive" });
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await employerResourcesService.deleteCategory(id);
            toast({ title: "Success", description: "Category deleted successfully" });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
        }
    };

    // Guide Handlers
    const handleSaveGuide = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingGuide?.id) {
                await employerResourcesService.updateGuide(editingGuide.id, editingGuide);
                toast({ title: "Success", description: "Guide updated successfully" });
            } else {
                await employerResourcesService.createGuide(editingGuide as any);
                toast({ title: "Success", description: "Guide created successfully" });
            }
            setIsGuideDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save guide", variant: "destructive" });
        }
    };

    const handleDeleteGuide = async (id: string) => {
        if (!confirm("Are you sure you want to delete this guide?")) return;
        try {
            await employerResourcesService.deleteGuide(id);
            toast({ title: "Success", description: "Guide deleted successfully" });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete guide", variant: "destructive" });
        }
    };

    // Download Handlers
    const handleSaveDownload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingDownload?.id) {
                await employerResourcesService.updateDownload(editingDownload.id, editingDownload);
                toast({ title: "Success", description: "Resource updated successfully" });
            } else {
                await employerResourcesService.createDownload(editingDownload as any);
                toast({ title: "Success", description: "Resource created successfully" });
            }
            setIsDownloadDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save resource", variant: "destructive" });
        }
    };

    const handleDeleteDownload = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;
        try {
            await employerResourcesService.deleteDownload(id);
            toast({ title: "Success", description: "Resource deleted successfully" });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete resource", variant: "destructive" });
        }
    };

    // FAQ Handlers
    const handleSaveFaq = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingFaq?.id) {
                await employerResourcesService.updateFaq(editingFaq.id, editingFaq);
                toast({ title: "Success", description: "FAQ updated successfully" });
            } else {
                await employerResourcesService.createFaq(editingFaq as any);
                toast({ title: "Success", description: "FAQ created successfully" });
            }
            setIsFaqDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save FAQ", variant: "destructive" });
        }
    };

    const handleDeleteFaq = async (id: string) => {
        if (!confirm("Are you sure you want to delete this FAQ?")) return;
        try {
            await employerResourcesService.deleteFaq(id);
            toast({ title: "Success", description: "FAQ deleted successfully" });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete FAQ", variant: "destructive" });
        }
    };

    if (loading) return <div className="p-8">Loading resources...</div>;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Employer Resources</h1>
                    <p className="text-muted-foreground">Manage guides, tools, and FAQs for employers</p>
                </div>
            </div>

            <Tabs defaultValue="categories" className="w-full">
                <TabsList className="bg-black/40 border border-white/5 p-1 rounded-xl">
                    <TabsTrigger value="categories" className="rounded-lg">Categories</TabsTrigger>
                    <TabsTrigger value="guides" className="rounded-lg">Featured Guides</TabsTrigger>
                    <TabsTrigger value="downloads" className="rounded-lg">Downloads</TabsTrigger>
                    <TabsTrigger value="faqs" className="rounded-lg">FAQs</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-4 pt-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingCategory({}); setIsCategoryDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Category
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((cat) => (
                            <Card key={cat.id} className="bg-black/40 border-white/5">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${cat.bg}`}>
                                            {(() => {
                                                const IconComponent = IconList.find(i => i.name === cat.icon)?.icon || HelpCircle;
                                                return <IconComponent className={`w-5 h-5 ${cat.color}`} />;
                                            })()}
                                        </div>
                                        <CardTitle className="text-lg">{cat.title}</CardTitle>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingCategory(cat); setIsCategoryDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteCategory(cat.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.resources.map((r, i) => (
                                            <Badge key={i} variant="outline" className="text-[10px]">{r}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="guides" className="space-y-4 pt-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingGuide({}); setIsGuideDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Guide
                        </Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Read Time</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guides.map((guide) => (
                                <TableRow key={guide.id}>
                                    <TableCell className="font-medium">{guide.title}</TableCell>
                                    <TableCell>{guide.category}</TableCell>
                                    <TableCell>{guide.readTime}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingGuide(guide); setIsGuideDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteGuide(guide.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="downloads" className="space-y-4 pt-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingDownload({}); setIsDownloadDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Resource
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {downloads.map((dl) => (
                            <Card key={dl.id} className="bg-black/40 border-white/5">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base">{dl.title}</CardTitle>
                                        <Badge>{dl.format}</Badge>
                                    </div>
                                    <CardDescription>{dl.size}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{dl.description}</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingDownload(dl); setIsDownloadDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteDownload(dl.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="faqs" className="space-y-4 pt-4">
                    <div className="flex justify-end">
                        <Button onClick={() => { setEditingFaq({}); setIsFaqDialogOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add FAQ
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <Card key={faq.id} className="bg-black/40 border-white/5">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-base">{faq.question}</CardTitle>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingFaq(faq); setIsFaqDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteFaq(faq.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-[#111] border-white/10">
                    <form onSubmit={handleSaveCategory}>
                        <DialogHeader>
                            <DialogTitle>{editingCategory?.id ? "Edit Category" : "Add Category"}</DialogTitle>
                            <DialogDescription>Configure resource category details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title</label>
                                    <Input value={editingCategory?.title || ""} onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Icon</label>
                                    <select
                                        className="w-full bg-background border border-input rounded-md p-2 text-sm"
                                        value={editingCategory?.icon || "BookOpen"}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                                    >
                                        {IconList.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                                <Textarea value={editingCategory?.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Text Color Class</label>
                                    <Input value={editingCategory?.color || "text-blue-500"} onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">BG Color Class</label>
                                    <Input value={editingCategory?.bg || "bg-blue-500/10"} onChange={(e) => setEditingCategory({ ...editingCategory, bg: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Resources (comma separated)</label>
                                <Input
                                    value={editingCategory?.resources?.join(", ") || ""}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, resources: e.target.value.split(",").map(s => s.trim()) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Display Order</label>
                                <Input type="number" value={editingCategory?.order || 0} onChange={(e) => setEditingCategory({ ...editingCategory, order: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Category</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Guide Dialog */}
            <Dialog open={isGuideDialogOpen} onOpenChange={setIsGuideDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-[#111] border-white/10">
                    <form onSubmit={handleSaveGuide}>
                        <DialogHeader>
                            <DialogTitle>{editingGuide?.id ? "Edit Guide" : "Add Guide"}</DialogTitle>
                            <DialogDescription>Configure featured guide details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title</label>
                                <Input value={editingGuide?.title || ""} onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                                <Textarea value={editingGuide?.description || ""} onChange={(e) => setEditingGuide({ ...editingGuide, description: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                                    <Input value={editingGuide?.category || ""} onChange={(e) => setEditingGuide({ ...editingGuide, category: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Read Time</label>
                                    <Input value={editingGuide?.readTime || ""} onChange={(e) => setEditingGuide({ ...editingGuide, readTime: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Icon</label>
                                    <select
                                        className="w-full bg-background border border-input rounded-md p-2 text-sm"
                                        value={editingGuide?.icon || "Users"}
                                        onChange={(e) => setEditingGuide({ ...editingGuide, icon: e.target.value })}
                                    >
                                        {IconList.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Color Class</label>
                                    <Input value={editingGuide?.color || "bg-blue-500"} onChange={(e) => setEditingGuide({ ...editingGuide, color: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Display Order</label>
                                <Input type="number" value={editingGuide?.order || 0} onChange={(e) => setEditingGuide({ ...editingGuide, order: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsGuideDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Guide</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Download Dialog */}
            <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-[#111] border-white/10">
                    <form onSubmit={handleSaveDownload}>
                        <DialogHeader>
                            <DialogTitle>{editingDownload?.id ? "Edit Resource" : "Add Resource"}</DialogTitle>
                            <DialogDescription>Configure downloadable resource details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Title</label>
                                <Input value={editingDownload?.title || ""} onChange={(e) => setEditingDownload({ ...editingDownload, title: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                                <Textarea value={editingDownload?.description || ""} onChange={(e) => setEditingDownload({ ...editingDownload, description: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Format</label>
                                    <Input value={editingDownload?.format || "PDF"} onChange={(e) => setEditingDownload({ ...editingDownload, format: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Size</label>
                                    <Input value={editingDownload?.size || ""} onChange={(e) => setEditingDownload({ ...editingDownload, size: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Display Order</label>
                                <Input type="number" value={editingDownload?.order || 0} onChange={(e) => setEditingDownload({ ...editingDownload, order: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsDownloadDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Resource</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* FAQ Dialog */}
            <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
                <DialogContent className="sm:max-w-[500px] bg-[#111] border-white/10">
                    <form onSubmit={handleSaveFaq}>
                        <DialogHeader>
                            <DialogTitle>{editingFaq?.id ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
                            <DialogDescription>Configure common questions</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Question</label>
                                <Input value={editingFaq?.question || ""} onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Answer</label>
                                <Textarea value={editingFaq?.answer || ""} onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })} required rows={5} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Display Order</label>
                                <Input type="number" value={editingFaq?.order || 0} onChange={(e) => setEditingFaq({ ...editingFaq, order: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setIsFaqDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save FAQ</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
