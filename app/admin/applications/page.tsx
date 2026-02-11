"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin";
import {
    FileText,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    Eye,
    Filter,
    RefreshCw,
    ExternalLink,
    Users,
    Clock,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    DollarSign,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function AdminApplications() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchApplications = async () => {
        setLoading(true);
        try {
            // Note: Assuming getAllApplications might support search in future, 
            // but for now we fetch and potentially filter client side if needed, 
            // or just display as is.
            const res = await adminService.getAllApplications(page);
            setApplications(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error("Protocol connection failed: Data retrieval interrupted");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [page]);

    const handleUpdateStatus = async (appId: string, status: string) => {
        try {
            await adminService.updateApplicationStatus(appId, status);
            toast.success(`Application status updated: ${status}`, {
                icon: status === 'ACCEPTED' ? <CheckCircle className="text-emerald-500" /> : <XCircle className="text-rose-500" />
            });
            fetchApplications();
        } catch (error) {
            toast.error("Moderation command failed");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Review Pending</Badge>
                    </div>
                );
            case 'ACCEPTED':
                return <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Approved</Badge>;
            case 'REJECTED':
                return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Declined</Badge>;
            default:
                return <Badge className="text-[10px]">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                            <FileText className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Application Protocol</h1>
                    </div>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Monitor talent proposals, review matches, and manage application lifecycles.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10 h-11 px-4 rounded-xl group transition-all"
                        onClick={fetchApplications}
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 h-11 px-6 rounded-xl font-bold flex gap-2">
                        <ExternalLink size={18} /> Export Data
                    </Button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <Input
                        className="pl-12 h-12 bg-black/40 border-white/[0.08] focus:border-primary/50 rounded-xl text-md transition-all placeholder:text-gray-600"
                        placeholder="Search by applicant, job title, or keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-5 bg-white/5 border-white/10 gap-2 hover:bg-white/10 rounded-xl font-semibold">
                        <Filter size={18} /> Status Filter
                    </Button>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md relative group/table">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none"></div>
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-white/[0.04]">
                            <TableRow className="hover:bg-transparent border-white/[0.08]">
                                <TableHead className="py-5 px-6 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Applicant Identity</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Target Mission</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Bid Amount</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Status</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Timestamp</TableHead>
                                <TableHead className="py-5 pr-6 text-right text-[10px] uppercase tracking-[2px] font-black text-gray-500">Control</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <TableRow key={i} className="animate-pulse border-white/[0.08]">
                                            <TableCell className="px-6 py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/5 rounded-full" /><div className="space-y-2"><div className="h-4 w-32 bg-white/5 rounded" /><div className="h-3 w-40 bg-white/5 rounded" /></div></div></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-white/5 rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-16 bg-white/5 rounded" /></TableCell>
                                            <TableCell><div className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-white/5 rounded" /></TableCell>
                                            <TableCell className="pr-6"><div className="h-10 w-10 bg-white/5 rounded-xl ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    applications.map((app, i) => (
                                        <motion.tr
                                            key={app.id}
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-indigo-500/[0.03] border-white/[0.08] transition-colors group/row"
                                        >
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="w-10 h-10 border border-white/10 group-hover/row:border-indigo-500/50 transition-colors">
                                                        <AvatarImage src={app.applicant.avatar} />
                                                        <AvatarFallback className="bg-white/10 text-indigo-400 font-bold text-xs">
                                                            {app.applicant.firstName[0]}{app.applicant.lastName[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[14px] group-hover/row:text-primary transition-colors">{app.applicant.firstName} {app.applicant.lastName}</span>
                                                        <span className="text-[10px] text-gray-500 font-mono">{app.applicant.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                                                        <Briefcase size={12} className="text-gray-400" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-300">{app.job.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1 font-black text-gray-200">
                                                    <span className="text-xs text-indigo-400">$</span>
                                                    <span>{app.proposedRate}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(app.status)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                                                    <Clock size={12} />
                                                    <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10">
                                                            <MoreVertical size={18} className="text-gray-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-[#0a0a0a] border-white/10 text-gray-300 backdrop-blur-xl p-2 rounded-2xl shadow-2xl">
                                                        <DropdownMenuLabel className="px-4 py-2 font-black uppercase text-[10px] tracking-widest text-gray-500">Decision Hub</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-emerald-500 focus:text-black mt-1">
                                                            <CheckCircle size={16} /> <span className="font-bold text-sm">Accept Proposal</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-rose-500 focus:text-black">
                                                            <XCircle size={16} /> <span className="font-bold text-sm">Reject Proposal</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem asChild className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-white/10 mb-1">
                                                            <Link href={`/jobs/${app.job.id}`} target="_blank">
                                                                <Eye size={16} /> <span className="font-bold text-sm">View Mission</span>
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4">
                <div className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>Log Date: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <ArrowUpRight size={14} className="text-indigo-500" />
                        <span>Queue: {meta?.total || 0} Proposals</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-11 px-4 bg-white/[0.03] border-white/10 hover:bg-white/10 rounded-xl font-bold flex gap-2 disabled:opacity-30"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="flex gap-2">
                        {Array.from({ length: Math.min(meta?.lastPage || 1, 5) }).map((_, i) => (
                            <Button
                                key={i}
                                variant={page === i + 1 ? "default" : "outline"}
                                className={`w-11 h-11 rounded-xl font-black transition-all ${page === i + 1 ? "bg-primary text-black shadow-lg" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        className="h-11 px-4 bg-white/[0.03] border-white/10 hover:bg-white/10 rounded-xl font-bold flex gap-2 disabled:opacity-30"
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
