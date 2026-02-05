"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/lib/services/admin";
import {
    Users,
    Briefcase,
    FileText,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    UserPlus,
    Clock
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const data = [
    { name: "Mon", users: 40, jobs: 24 },
    { name: "Tue", users: 30, jobs: 13 },
    { name: "Wed", users: 20, jobs: 98 },
    { name: "Thu", users: 27, jobs: 39 },
    { name: "Fri", users: 18, jobs: 48 },
    { name: "Sat", users: 23, jobs: 38 },
    { name: "Sun", users: 34, jobs: 43 },
];

export default function AdminOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await adminService.getStats();
                setStats(res);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    const statCards = [
        { label: "Total Users", value: stats?.overview?.totalUsers || 0, icon: Users, color: "text-blue-500", trend: "+12%" },
        { label: "Active Jobs", value: stats?.overview?.totalJobs || 0, icon: Briefcase, color: "text-green-500", trend: "+5%" },
        { label: "Applications", value: stats?.overview?.totalApplications || 0, icon: FileText, color: "text-purple-500", trend: "+18%" },
        { label: "Total Revenue", value: `$${stats?.overview?.revenue?.toFixed(2) || "0.00"}`, icon: DollarSign, color: "text-amber-500", trend: "+8%" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <p className="text-gray-400 mt-2">Welcome back! Here's what's happening on your platform today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <Card key={i} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:border-primary/50 transition-colors group">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg bg-gray-800 group-hover:bg-primary/20 transition-colors`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-0 flex items-center gap-1">
                                    {stat.trend} <TrendingUp size={12} />
                                </Badge>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <Card className="lg:col-span-2 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Activity Insights</CardTitle>
                        <CardDescription>User and job growth over the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                                <Area type="monotone" dataKey="jobs" stroke="#82ca9d" fillOpacity={1} fill="url(#colorJobs)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Users */}
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>New Signups</CardTitle>
                        <CardDescription>Latest users joined the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats?.recentUsers?.map((user: any) => (
                                <div key={user.id} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-primary font-bold">
                                        {user.firstName[0]}{user.lastName[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-gray-400 border-gray-700">
                                            {user.role}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                                <div className="text-center py-10 text-gray-500">
                                    <Clock size={40} className="mx-auto mb-2 opacity-20" />
                                    <p>No recent signups</p>
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 text-primary hover:text-primary/80 hover:bg-primary/10">
                            View All Users <ArrowUpRight size={16} className="ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
