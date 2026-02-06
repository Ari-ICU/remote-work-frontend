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
    Briefcase
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

export default function AdminApplications() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllApplications(page);
            setApplications(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error("Failed to load applications");
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
            toast.success(`Application status updated: ${status}`);
            fetchApplications();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
            case 'ACCEPTED':
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Accepted</Badge>;
            case 'REJECTED':
                return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Rejected</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-10 pb-10">
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
                <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/10 h-11 px-4 rounded-xl"
                    onClick={fetchApplications}
                    disabled={loading}
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                </Button>
            </div>

            <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/[0.04]">
                            <TableRow className="border-white/[0.08]">
                                <TableHead className="py-5 px-6 text-[10px] uppercase tracking-widest text-gray-500">Applicant</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Mission</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Proposed Rate</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Status</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Submitted</TableHead>
                                <TableHead className="py-5 pr-6 text-right text-[10px] uppercase tracking-widest text-gray-500">Control</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse border-white/[0.08]">
                                        <TableCell colSpan={6} className="h-20 bg-white/5" />
                                    </TableRow>
                                ))
                            ) : applications.map((app) => (
                                <TableRow key={app.id} className="hover:bg-white/[0.02] border-white/[0.08] group">
                                    <TableCell className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-200">{app.applicant.firstName} {app.applicant.lastName}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">{app.applicant.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={14} className="text-gray-500" />
                                            <span className="text-sm font-medium">{app.job.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-black text-gray-300">${app.proposedRate}</span>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(app.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock size={14} />
                                            <span className="text-xs">{new Date(app.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="pr-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:bg-white/5">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-[#0a0a0a] border-white/10 text-gray-300">
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')} className="gap-2 focus:bg-emerald-500 focus:text-black">
                                                    <CheckCircle size={16} /> Accept
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(app.id, 'REJECTED')} className="gap-2 focus:bg-rose-500 focus:text-black">
                                                    <XCircle size={16} /> Reject
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <Button
                    variant="outline"
                    className="bg-white/5 border-white/10"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                >
                    <ChevronLeft size={18} />
                </Button>
                <span className="text-sm font-bold">Page {page} of {meta?.lastPage || 1}</span>
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
    );
}
