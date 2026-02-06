"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin";
import {
    DollarSign,
    Search,
    RefreshCw,
    TrendingUp,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ShieldCheck
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
import { Card, CardContent } from "@/components/ui/card";

export default function AdminPayments() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [paymentsRes, statsRes] = await Promise.all([
                adminService.getAllPayments(page),
                adminService.getStats()
            ]);
            setPayments(paymentsRes.data);
            setMeta(paymentsRes.meta);
            setStats(statsRes);
        } catch (error) {
            toast.error("Failed to load financial records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Success</Badge>;
            case 'PENDING':
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>;
            case 'FAILED':
                return <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20">Failed</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="space-y-10 pb-10">
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <DollarSign className="w-5 h-5 text-amber-500" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-white">Financial Audit</h1>
                        </div>
                        <p className="text-gray-500 font-medium">
                            Transaction monitoring, revenue tracking, and global financial oversight.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="bg-white/[0.03] border-white/5 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp size={48} />
                        </div>
                        <CardContent className="p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-black text-white">${stats?.overview?.revenue?.toLocaleString() || '0'}</h3>
                            <div className="flex items-center gap-1 mt-2 text-emerald-500 font-bold text-xs">
                                <ArrowUpRight size={14} /> +12% from last cycle
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/[0.03] border-white/5 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <CreditCard size={48} />
                        </div>
                        <CardContent className="p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Deposits</p>
                            <h3 className="text-3xl font-black text-white">{meta?.total || 0}</h3>
                            <div className="flex items-center gap-1 mt-2 text-primary font-bold text-xs">
                                <ShieldCheck size={14} /> All transactions verified
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/[0.03] border-white/5 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Calendar size={48} />
                        </div>
                        <CardContent className="p-6">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Fiscal Period</p>
                            <h3 className="text-3xl font-black text-white">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                            <p className="text-xs text-gray-500 mt-2 font-medium">Real-time update active</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md">
                    <Table>
                        <TableHeader className="bg-white/[0.04]">
                            <TableRow className="border-white/[0.08]">
                                <TableHead className="py-5 px-6 text-[10px] uppercase tracking-widest text-gray-500">Transactor</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Amount</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Status</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500">Identity Tag</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-widest text-gray-500 text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse border-white/[0.08]">
                                        <TableCell colSpan={5} className="h-16 bg-white/5" />
                                    </TableRow>
                                ))
                            ) : payments.map((p) => (
                                <TableRow key={p.id} className="hover:bg-white/[0.02] border-white/[0.08]">
                                    <TableCell className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-200">{p.user.firstName} {p.user.lastName}</span>
                                            <span className="text-[10px] text-gray-500 font-mono">{p.user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-black text-white">${p.amount}</span>
                                        <span className="text-[10px] text-gray-500 uppercase ml-1 font-bold">{p.currency}</span>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(p.status)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[11px] font-mono text-gray-500">{p.stripePaymentId || 'INTERNAL_TRANS'}</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-tighter">
                                            {new Date(p.createdAt).toLocaleString()}
                                        </div>
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
                    <span className="text-sm font-bold text-gray-400">Page {page} of {meta?.lastPage || 1}</span>
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
