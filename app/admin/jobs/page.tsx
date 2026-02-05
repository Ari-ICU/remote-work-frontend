"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin";
import {
    Briefcase,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    Eye,
    Filter,
    RefreshCw,
    ExternalLink,
    DollarSign,
    Users,
    Calendar,
    AlertCircle,
    Flag,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight
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
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminJobs() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllJobs(page);
            setJobs(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error("Critical failure: Data retrieval interrupted");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [page]);

    const handleUpdateStatus = async (jobId: string, status: string) => {
        try {
            await adminService.updateJobStatus(jobId, status);
            toast.success(`Job protocol updated: ${status}`, {
                icon: status === 'OPEN' ? <CheckCircle className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />
            });
            fetchJobs();
        } catch (error) {
            toast.error("Moderation command failed");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN':
                return (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Active</Badge>
                    </div>
                );
            case 'DRAFT':
                return <Badge variant="outline" className="text-gray-500 border-white/10 font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 bg-white/5">Suspended</Badge>;
            case 'IN_PROGRESS':
                return <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Processing</Badge>;
            case 'COMPLETED':
                return <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Finalized</Badge>;
            case 'CANCELLED':
                return <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">Terminated</Badge>;
            default: return <Badge className="text-[10px]">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <Briefcase className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Market Intelligence</h1>
                    </div>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Monitor commercial activity, moderate listings, and maintain ecosystem health via our global job lattice.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10 h-11 px-4 rounded-xl group transition-all"
                        onClick={fetchJobs}
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 h-11 px-6 rounded-xl font-bold flex gap-2">
                        <Flag size={18} /> Reported Posts
                    </Button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <Input
                        className="pl-12 h-12 bg-black/40 border-white/[0.08] focus:border-primary/50 rounded-xl text-md transition-all placeholder:text-gray-600"
                        placeholder="Scan for mission titles, keywords or employers..."
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-5 bg-white/5 border-white/10 gap-2 hover:bg-white/10 rounded-xl font-semibold">
                        <Filter size={18} /> Category Filter
                    </Button>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md relative group/table">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/[0.02] to-transparent pointer-events-none"></div>
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-white/[0.04]">
                            <TableRow className="hover:bg-transparent border-white/[0.08]">
                                <TableHead className="py-5 px-6 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Mission Profile</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Contractor</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Budget</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Response</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Operational Status</TableHead>
                                <TableHead className="py-5 pr-6 text-right text-[10px] uppercase tracking-[2px] font-black text-gray-500">Control</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <TableRow key={i} className="animate-pulse border-white/[0.08]">
                                            <TableCell className="px-6 py-6"><div className="space-y-2"><div className="h-4 w-48 bg-white/5 rounded" /><div className="h-3 w-24 bg-white/5 rounded" /></div></TableCell>
                                            <TableCell><div className="h-4 w-32 bg-white/5 rounded" /></TableCell>
                                            <TableCell><div className="h-4 w-20 bg-white/5 rounded" /></TableCell>
                                            <TableCell><div className="h-6 w-10 bg-white/5 rounded-full" /></TableCell>
                                            <TableCell><div className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                                            <TableCell className="pr-6"><div className="h-10 w-10 bg-white/5 rounded-xl ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    jobs.map((job, i) => (
                                        <motion.tr
                                            key={job.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.99 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-emerald-500/[0.03] border-white/[0.08] transition-colors group/row"
                                        >
                                            <TableCell className="px-6 py-5">
                                                <div className="flex flex-col gap-1 max-w-[280px]">
                                                    <span className="font-bold text-[15px] truncate group-hover/row:text-primary transition-colors">{job.title}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[9px] uppercase tracking-tighter text-gray-500 border-white/5 py-0 px-1 bg-white/5">{job.category}</Badge>
                                                        <span className="text-[10px] text-gray-600 font-mono italic">#{job.id.slice(-6)}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary text-[10px] font-black border border-white/10 group-hover/row:border-primary/40 transition-colors">
                                                        {job.poster.firstName[0]}{job.poster.lastName[0]}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">{job.poster.firstName} {job.poster.lastName}</span>
                                                        <span className="text-[10px] text-gray-600 font-mono truncate max-w-[120px]">{job.poster.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 font-black text-gray-200">
                                                    <DollarSign size={14} className="text-emerald-500" />
                                                    <span>{job.budget?.toLocaleString()}</span>
                                                    <span className="text-[10px] text-gray-600 font-bold uppercase ml-1 opacity-50">{job.budgetType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 w-fit">
                                                    <Users size={12} className="text-gray-500" />
                                                    <span className="text-xs font-black">{job._count?.applications || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(job.status)}
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10">
                                                            <MoreVertical size={18} className="text-gray-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-white/10 text-gray-300 backdrop-blur-xl p-2 rounded-2xl shadow-2xl">
                                                        <DropdownMenuLabel className="px-4 py-2 font-black uppercase text-[10px] tracking-widest text-gray-500">Moderation Hub</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'OPEN')} className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-emerald-500 focus:text-black mt-1">
                                                            <CheckCircle size={18} />
                                                            <span className="font-bold text-sm">Approve Mission</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'CANCELLED')} className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-rose-500 focus:text-black">
                                                            <XCircle size={18} />
                                                            <span className="font-bold text-sm">Reject Mission</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem asChild className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-white/10 mb-1">
                                                            <Link href={`/jobs/${job.id}`} target="_blank">
                                                                <ExternalLink size={18} />
                                                                <span className="font-bold text-sm">Full Analysis</span>
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
                        <span>Session: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-white/10"></div>
                    <div className="flex items-center gap-2">
                        <ArrowUpRight size={14} className="text-emerald-500" />
                        <span>Throughput: {meta?.total || 0} Total Posts</span>
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
