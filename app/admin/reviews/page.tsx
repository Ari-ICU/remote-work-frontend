"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin";
import {
    Star,
    RefreshCw,
    Trash2,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    User,
    ShieldAlert
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllReviews(page);
            setReviews(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error("Failed to load feedback logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page]);

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm("Remove this feedback from the ecosystem?")) return;
        try {
            await adminService.deleteReview(reviewId);
            toast.success("Feedback purged");
            fetchReviews();
        } catch (error) {
            toast.error("Failed to remove feedback");
        }
    };

    return (
        <div className="space-y-10 pb-10">
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                                <Star className="w-5 h-5 text-primary" fill="currentColor" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white">Trust & Moderation</h1>
                        </div>
                        <p className="text-gray-500 font-medium">
                            Monitor user feedback, moderate ratings, and maintain professional quality.
                        </p>
                    </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md">
                    <Table>
                        <TableHeader className="bg-white/[0.04]">
                            <TableRow className="border-white/[0.08]">
                                <TableHead className="py-5 px-6 text-[10px] uppercase tracking-widest text-gray-500">Subject</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Rating</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Comment</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Reviewer</TableHead>
                                <TableHead className="py-5 pr-6 text-right text-[10px] uppercase tracking-widest text-gray-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse border-white/[0.08]">
                                        <TableCell colSpan={5} className="h-16 bg-white/5" />
                                    </TableRow>
                                ))
                            ) : reviews.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-500 opacity-30">
                                            <ShieldAlert size={48} />
                                            <p className="text-sm font-bold uppercase tracking-widest">No feedback detected in transmission</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : reviews.map((r) => (
                                <TableRow key={r.id} className="hover:bg-white/[0.02] border-white/[0.08]">
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-gray-600" />
                                            <span className="font-bold text-gray-200">{r.reviewee.firstName} {r.reviewee.lastName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={12} className={i < r.rating ? "text-primary" : "text-gray-800"} fill={i < r.rating ? "currentColor" : "none"} />
                                            ))}
                                            <span className="ml-2 text-xs font-black text-white">{r.rating}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        <p className="text-sm text-gray-400 font-medium line-clamp-2">{r.comment || 'No textual data provided.'}</p>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-gray-500 italic">By {r.reviewer.firstName} {r.reviewer.lastName}</span>
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteReview(r.id)}
                                            className="text-gray-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        className="bg-white/5 border-white/10"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <span className="text-sm font-bold text-gray-400">Scan Results: {page} of {meta?.lastPage || 1}</span>
                    <Button
                        variant="outline"
                        className="bg-white/5 border-white/10"
                        disabled={page >= (meta?.lastPage || 1)}
                        onClick={() => setPage(p => p + 1)}
                    >
                        <ChevronRight size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
