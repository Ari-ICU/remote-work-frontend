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
    RefreshCw
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

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>(null);

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
            toast.success("User role updated");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await adminService.deleteUser(userId);
            toast.success("User deleted");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-gray-400 mt-2">Oversee all users on the platform and manage their roles.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-gray-900 border-gray-800" onClick={fetchUsers}>
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </Button>
                    <Button className="bg-primary text-black font-semibold">
                        Add New User
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <Input
                        className="pl-10 bg-gray-900 border-gray-800 focus:border-primary/50"
                        placeholder="Search by name or email..."
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
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <TableRow key={i} className="animate-pulse border-gray-800/50">
                                    <TableCell><div className="h-4 w-32 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-16 bg-gray-800 rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-10 bg-gray-800 rounded ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="hover:bg-gray-800/30 border-gray-800/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-primary font-bold text-xs">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`
                        ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' :
                                                    user.role === 'EMPLOYER' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-gray-500/10 text-gray-400'}
                      `}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-400 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-500/10 text-green-500 border-0">Active</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-gray-100">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleUpdateRole(user.id, user.role === 'ADMIN' ? 'FREELANCER' : 'ADMIN')}>
                                                    <Shield size={16} className="mr-2" />
                                                    {user.role === 'ADMIN' ? 'Remove Admin' : 'Make Admin'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail size={16} className="mr-2" /> Message
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-800" />
                                                <DropdownMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-500/10" onClick={() => handleDeleteUser(user.id)}>
                                                    <UserX size={16} className="mr-2" /> Delete Account
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
                    Showing {users.length} of {meta?.total || 0} users
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
