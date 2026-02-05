"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    LogOut,
    Menu,
    X,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Briefcase, label: "Jobs", href: "/admin/jobs" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            router.push("/login");
        } else {
            setIsAdmin(true);
            setLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-950">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="flex min-h-screen bg-gray-950 text-gray-100">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } transition-all duration-300 ease-in-out border-r border-gray-800 bg-gray-900/50 backdrop-blur-xl h-screen sticky top-0 flex flex-col`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-black" />
                        </div>
                        {isSidebarOpen && <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Admin</span>}
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="hidden md:flex"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                                        ? "bg-primary text-black font-semibold shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }
                `}>
                                    <item.icon size={22} />
                                    {isSidebarOpen && <span>{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-2 py-3">
                        <Avatar>
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gray-800 text-primary">AD</AvatarFallback>
                        </Avatar>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">Admin User</p>
                                <p className="text-xs text-gray-500 truncate">admin@platform.com</p>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={handleLogout}
                    >
                        <LogOut size={22} />
                        {isSidebarOpen && <span>Logout</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black">
                <div className="p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
