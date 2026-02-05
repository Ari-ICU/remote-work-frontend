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
    ExternalLink
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
            toast.error("Failed to load jobs");
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
            toast.success(`Job status updated to ${status}`);
            fetchJobs();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'OPEN': return <Badge className="bg-green-500/10 text-green-500">Open</Badge>;
            case 'DRAFT': return <Badge variant="outline" className="text-gray-400 border-gray-700 font-normal">Draft</Badge>;
            case 'IN_PROGRESS': return <Badge className="bg-blue-500/10 text-blue-500">In Progress</Badge>;
            case 'COMPLETED': return <Badge className="bg-purple-500/10 text-purple-500">Completed</Badge>;
            case 'CANCELLED': return <Badge variant="destructive" className="bg-red-500/10 text-red-500 border-0">Cancelled</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Moderation</h1>
                    <p className="text-gray-400 mt-2">Manage job postings, approve or reject listings, and monitor activity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-gray-900 border-gray-800" onClick={fetchJobs}>
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                        className="pl-10 bg-gray-900 border-gray-800 focus:border-primary/50"
                        placeholder="Search by job title or employer..."
                    />
                </div>
                <Button variant="outline" className="bg-gray-900 border-gray-800 gap-2">
                    <Filter size={18} /> Filter
                </Button>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <Table>
                    <TableHeader className="bg-gray-800/50">
                        <TableRow className="hover:bg-transparent border-gray-800">
                            <TableHead>Job Title</TableHead>
                            <TableHead>Employer</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Apps</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <TableRow key={i} className="animate-pulse border-gray-800/50">
                                    <TableCell><div className="h-4 w-48 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-32 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-10 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-16 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-10 bg-gray-800 rounded ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            jobs.map((job) => (
                                <TableRow key={job.id} className="hover:bg-gray-800/30 border-gray-800/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate max-w-[300px]">{job.title}</span>
                                            <span className="text-xs text-gray-500">{job.category}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{job.poster.firstName} {job.poster.lastName}</span>
                                            <span className="text-[10px] text-gray-500">{job.poster.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        ${job.budget} <span className="text-[10px] text-gray-500">({job.budgetType})</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="border-gray-800 text-gray-400">
                                            {job._count?.applications || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(job.status)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-100">
                                                <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'OPEN')}>
                                                    <CheckCircle size={16} className="mr-2 text-green-500" /> Approve / Open
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleUpdateStatus(job.id, 'CANCELLED')}>
                                                    <XCircle size={16} className="mr-2 text-red-500" /> Reject / Cancel
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-800" />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/jobs/${job.id}`} target="_blank">
                                                        <ExternalLink size={16} className="mr-2" /> View Job
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Showing {jobs.length} of {meta?.total || 0} jobs
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="bg-gray-900 border-gray-800"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-gray-900 border-gray-800"
                        disabled={page >= (meta?.lastPage || 1)}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
