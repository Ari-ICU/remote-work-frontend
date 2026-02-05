"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin";
import {
    Users,
    Search,
    MoreVertical,
    Shield,
    UserX,
    Mail,
    Filter,
    RefreshCw,
    Plus,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Database,
    ExternalLink,
    MessageSquare,
    Lock
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllUsers(page);
            setUsers(res.data);
            setMeta(res.meta);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const handleUpdateRole = async (userId: string, role: string) => {
        try {
            await adminService.updateUserRole(userId, role);
            toast.success(`Access updated: ${role}`, {
                style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            fetchUsers();
        } catch (error) {
            toast.error("Protocol failure: Role update rejected");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("CRITICAL: Permanent deletion of user identity. Proceed?")) return;
        try {
            await adminService.deleteUser(userId);
            toast.success("Identity purged from ecosystem");
            fetchUsers();
        } catch (error) {
            toast.error("Deletion protocol failed");
        }
    };

    return (
        <div className="space-y-10 selection:bg-primary/20">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">User Management</h1>
                    </div>
                    <p className="text-gray-500 font-medium max-w-xl">
                        Control platform access, manage permissions, and audit user activity across the KhmerWork ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="bg-white/5 border-white/10 hover:bg-white/10 h-11 px-4 rounded-xl group transition-all"
                        onClick={fetchUsers}
                        disabled={loading}
                    >
                        <RefreshCw size={18} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
                    </Button>
                    <Button
                        onClick={() => toast.info("User Provisioning Protocol Initiated", { description: "User creation interface is currently being calibrated." })}
                        className="bg-primary text-black font-bold h-11 px-6 rounded-xl hover:bg-primary/90 flex gap-2"
                    >
                        <Plus size={18} /> Add New User
                    </Button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                    <Input
                        className="pl-12 h-12 bg-black/40 border-white/[0.08] focus:border-primary/50 rounded-xl text-md transition-all placeholder:text-gray-600"
                        placeholder="Find user by identity, email or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-12 px-5 bg-white/5 border-white/10 gap-2 hover:bg-white/10 rounded-xl font-semibold">
                        <Filter size={18} /> Filters
                    </Button>
                    <Button variant="outline" className="h-12 px-5 bg-white/5 border-white/10 gap-2 hover:bg-white/10 rounded-xl font-semibold">
                        <Database size={18} /> Backups
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md relative group/table">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none"></div>
                <div className="overflow-x-auto custom-scrollbar">
                    <Table>
                        <TableHeader className="bg-white/[0.04]">
                            <TableRow className="hover:bg-transparent border-white/[0.08]">
                                <TableHead className="py-5 px-6 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Personnel</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Privilege</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Activity</TableHead>
                                <TableHead className="py-5 text-[10px] uppercase tracking-[2px] font-black text-gray-500">Status</TableHead>
                                <TableHead className="py-5 pr-6 text-right text-[10px] uppercase tracking-[2px] font-black text-gray-500">Control</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    Array(6).fill(0).map((_, i) => (
                                        <TableRow key={i} className="animate-pulse border-white/[0.08]">
                                            <TableCell className="px-6 py-6"><div className="flex items-center gap-4"><div className="w-11 h-11 bg-white/5 rounded-2xl" /><div className="space-y-2"><div className="h-4 w-32 bg-white/5 rounded" /><div className="h-3 w-48 bg-white/5 rounded" /></div></div></TableCell>
                                            <TableCell><div className="h-6 w-20 bg-white/5 rounded-full" /></TableCell>
                                            <TableCell><div className="h-4 w-24 bg-white/5 rounded" /></TableCell>
                                            <TableCell><div className="h-6 w-16 bg-white/5 rounded-full" /></TableCell>
                                            <TableCell className="pr-6"><div className="h-10 w-10 bg-white/5 rounded-xl ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    users.map((user, i) => (
                                        <motion.tr
                                            key={user.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-primary/[0.03] border-white/[0.08] transition-colors group/row"
                                        >
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <Avatar className="w-12 h-12 rounded-2xl border border-white/10 group-hover/row:border-primary/50 transition-colors">
                                                            <AvatarImage src={user.avatar} />
                                                            <AvatarFallback className="bg-white/10 text-primary font-black text-sm">
                                                                {user.firstName[0]}{user.lastName[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full"></div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="font-bold text-[15px] group-hover/row:text-primary transition-colors">{user.firstName} {user.lastName}</p>
                                                        <p className="text-xs text-gray-500 font-mono">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={`
                          px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider
                          ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                            user.role === 'EMPLOYER' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                                'bg-gray-500/10 text-gray-400 border border-white/10'}
                        `}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold">{new Date(user.createdAt).toLocaleDateString()}</span>
                                                    <span className="text-[10px] text-gray-600 font-medium">Joined Platform</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                                    <span className="text-xs font-bold text-gray-400">AUTHORIZED</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-6 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10">
                                                            <MoreVertical size={18} className="text-gray-500" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 bg-[#0a0a0a] border-white/10 text-gray-300 backdrop-blur-xl p-2 rounded-2xl shadow-2xl">
                                                        <DropdownMenuLabel className="px-4 py-2 font-black uppercase text-[10px] tracking-widest text-gray-500">Security Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem onClick={() => handleUpdateRole(user.id, user.role === 'ADMIN' ? 'FREELANCER' : 'ADMIN')} className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-primary focus:text-black mt-1">
                                                            <Shield size={18} />
                                                            <span className="font-bold text-sm">{user.role === 'ADMIN' ? 'Demote to User' : 'Grant Admin Rights'}</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-white/10">
                                                            <Mail size={18} />
                                                            <span className="font-bold text-sm">Send Dispatch</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl focus:bg-white/10">
                                                            <Lock size={18} />
                                                            <span className="font-bold text-sm">Reset Security</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/5" />
                                                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="flex gap-3 px-4 py-3 cursor-pointer rounded-xl text-rose-500 focus:bg-rose-500/20 focus:text-rose-500 mb-1">
                                                            <UserX size={18} />
                                                            <span className="font-bold text-sm">Terminate Identity</span>
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

            {/* Pagination & Summary */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-3 overflow-hidden">
                        {users.slice(0, 5).map((u, i) => (
                            <Avatar key={i} className="w-8 h-8 border-2 border-black inline-block rounded-full ring-2 ring-transparent">
                                <AvatarFallback className="bg-gray-800 text-[8px] font-bold">{u.firstName[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-600">
                        Audit Coverage: <span className="text-gray-300">{users.length} of {meta?.total || 0} Entities</span>
                    </p>
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
