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
    Clock,
    Zap,
    ShieldCheck,
    UserPlus,
    MoreHorizontal,
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const activityData = [
    { name: "Mon", users: 400, jobs: 240, revenue: 2400 },
    { name: "Tue", users: 300, jobs: 139, revenue: 1398 },
    { name: "Wed", users: 200, jobs: 980, revenue: 9800 },
    { name: "Thu", users: 278, jobs: 390, revenue: 3908 },
    { name: "Fri", users: 189, jobs: 480, revenue: 4800 },
    { name: "Sat", users: 239, jobs: 380, revenue: 3800 },
    { name: "Sun", users: 349, jobs: 430, revenue: 4300 },
];

const categoryData = [
    { name: "Engineering", count: 45, color: "#10b981" },
    { name: "Design", count: 32, color: "#3b82f6" },
    { name: "Marketing", count: 28, color: "#6366f1" },
    { name: "Writing", count: 18, color: "#f59e0b" },
    { name: "Other", count: 12, color: "#ef4444" },
];

export default function AdminOverview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCleaning, setIsCleaning] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await adminService.getStats();
            setStats(res);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleCleanup = async () => {
        if (!confirm("Are you sure you want to remove all Playwright test data? This will delete users with '@test.com' emails and names containing 'Test'.")) return;

        setIsCleaning(true);
        try {
            const res = await adminService.cleanupTestData();
            toast.success(res.message);
            fetchStats(); // Refresh stats
        } catch (error) {
            console.error("Cleanup failed", error);
            toast.error("Failed to cleanup test data");
        } finally {
            setIsCleaning(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse delay-[100ms]"></div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-[400px] bg-white/5 rounded-3xl animate-pulse"></div>
                <div className="h-[400px] bg-white/5 rounded-3xl animate-pulse"></div>
            </div>
        </div>
    );

    const statCards = [
        { label: "Active Talents", value: stats?.overview?.totalUsers || 0, icon: Users, color: "text-blue-400", trend: "+12.5%", growth: true },
        { label: "Open Vacancies", value: stats?.overview?.totalJobs || 0, icon: Briefcase, color: "text-emerald-400", trend: "+5.2%", growth: true },
        { label: "Applications", value: stats?.overview?.totalApplications || 0, icon: FileText, color: "text-indigo-400", trend: "+18.7%", growth: true },
        { label: "Platform Revenue", value: `$${stats?.overview?.revenue?.toLocaleString() || "0"}`, icon: DollarSign, color: "text-amber-400", trend: "+8.1%", growth: true },
    ];

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        System Overview
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium flex items-center gap-2">
                        <ShieldCheck size={16} className="text-primary" />
                        Security Level 10 Active • Real-time Monitoring Enabled
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="bg-rose-500/5 border-rose-500/10 hover:bg-rose-500/10 text-rose-500 h-11 px-6 rounded-xl font-semibold flex gap-2"
                        onClick={handleCleanup}
                        disabled={isCleaning}
                    >
                        <Trash2 size={18} />
                        {isCleaning ? "Cleaning..." : "Cleanup Platform"}
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 h-11 px-6 rounded-xl font-semibold">
                        Export Report
                    </Button>
                    <Button className="bg-primary text-black hover:bg-primary/90 shadow-[0_10px_20px_color-mix(in_srgb,var(--primary),transparent_70%)] h-11 px-6 rounded-xl font-bold flex gap-2">
                        <Zap size={18} fill="currentColor" /> Quick Action
                    </Button>
                </div>
            </div>

            {/* Grid Background Pattern */}
            <div className="absolute inset-x-0 top-0 h-full w-full pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-md overflow-hidden group hover:border-primary/40 transition-all duration-500 rounded-2xl relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full translate-x-16 -translate-y-16 group-hover:bg-primary/10 transition-colors"></div>
                            <CardContent className="p-7 relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`p-3 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6`}>
                                        <stat.icon className={`w-7 h-7 ${stat.color} group-hover:text-white transition-colors`} />
                                    </div>
                                    <Badge variant="secondary" className="bg-white/5 text-[11px] font-bold border-white/5 flex items-center gap-1.5 px-2 py-1">
                                        <span className={stat.growth ? "text-emerald-400" : "text-rose-400"}>{stat.trend}</span>
                                        <TrendingUp size={12} className={stat.growth ? "text-emerald-400" : "text-rose-400"} />
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                                    <p className="text-sm font-semibold text-gray-500 mt-1.5 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Growth Chart */}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-md h-full rounded-2xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-white/[0.06] py-6 px-8">
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">Ecosystem Growth</CardTitle>
                                <CardDescription className="text-gray-500 font-medium mt-1">Activity metrics across the platform ecosystem</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0">Daily</Badge>
                                <Badge variant="outline" className="border-white/10 text-gray-500">Monthly</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#ffffff33"
                                            fontSize={11}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ dy: 10 }}
                                        />
                                        <YAxis
                                            stroke="#ffffff33"
                                            fontSize={11}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(val) => `${val}`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#111',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '16px',
                                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                            itemStyle={{ fontSize: '12px', fontWeight: '800' }}
                                        />
                                        <Area type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                        <Area type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">New Registrations</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl md:text-2xl font-bold">+1,240</span>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px] border-0 px-1 py-0">+8%</Badge>
                                    </div>
                                </div>
                                <div className="space-y-2 md:border-l border-white/5 md:pl-8">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Active Jobs</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl md:text-2xl font-bold">582</span>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 text-[10px] border-0 px-1 py-0">+3%</Badge>
                                    </div>
                                </div>
                                <div className="space-y-2 lg:border-l border-white/5 lg:pl-8">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Success Rate</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl md:text-2xl font-bold">94.2%</span>
                                        <Badge className="bg-primary/10 text-primary text-[10px] border-0 px-1 py-0">Target</Badge>
                                    </div>
                                </div>
                                <div className="space-y-2 md:border-l border-white/5 md:pl-8">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Server Health</p>
                                    <div className="flex items-center gap-2 text-primary">
                                        <Zap size={18} fill="currentColor" />
                                        <span className="text-xl md:text-2xl font-bold font-mono">99.9%</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Signup List & Categories */}
                <motion.div
                    className="space-y-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-md rounded-2xl overflow-hidden h-full">
                        <CardHeader className="border-b border-white/[0.06] py-6 px-7">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold">New Signups</CardTitle>
                                <UserPlus size={18} className="text-gray-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-7">
                            <div className="space-y-7">
                                {stats?.recentUsers?.map((user: any, i: number) => (
                                    <motion.div
                                        key={user.id}
                                        className="flex items-center gap-4 group"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (i * 0.1) }}
                                    >
                                        <div className="relative">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-primary font-bold shadow-lg border border-white/10 group-hover:border-primary/50 transition-colors">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#111]"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{user.firstName} {user.lastName}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">{new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <p className="text-[11px] text-gray-500 truncate font-mono">{user.email}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-white rounded-lg">
                                            <MoreHorizontal size={16} />
                                        </Button>
                                    </motion.div>
                                ))}

                                {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 opacity-20">
                                            <Clock size={32} />
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium tracking-tight">Listening for new actors...</p>
                                    </div>
                                )}
                            </div>

                            <Button variant="ghost" className="w-full mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-primary hover:bg-primary/5 h-11 border border-dashed border-white/10 rounded-xl">
                                View All Personnel <ArrowUpRight size={14} className="ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Categories Bar Chart */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-md rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
                        <div className="p-8 border-r border-white/5 space-y-4">
                            <h3 className="text-xl font-bold tracking-tight">Market Segments</h3>
                            <p className="text-sm text-gray-500 font-medium">Distribution of activity across industrial categories</p>
                            <div className="pt-4 space-y-3">
                                {categoryData.map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                            <span className="font-semibold text-gray-400">{cat.name}</span>
                                        </div>
                                        <span className="font-mono text-white/50">{cat.count}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-3 lg:col-span-4 p-8">
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={categoryData}>
                                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} stroke="#ffffff33" hide />
                                        <YAxis tickLine={false} axisLine={false} stroke="#ffffff33" hide />
                                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', border: '0', borderRadius: '12px' }} />
                                        <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between mt-6 px-10">
                                {categoryData.map((cat, i) => (
                                    <div key={i} className="text-center">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">{cat.name}</p>
                                        <Zap size={14} className="mx-auto" style={{ color: cat.color }} fill="currentColor" fillOpacity={0.2} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
