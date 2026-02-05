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
    ShieldCheck,
    Search,
    Bell,
    ChevronRight,
    Command as CommandIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationProvider, useNotifications } from "@/components/providers/notification-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/components/ui/use-mobile";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin", description: "Platform performance & stats" },
    { icon: Users, label: "Users", href: "/admin/users", description: "Manage members & roles" },
    { icon: Briefcase, label: "Jobs", href: "/admin/jobs", description: "Moderate job listings" },
    { icon: Settings, label: "Settings", href: "/admin/settings", description: "Global configuration" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </NotificationProvider>
    );
}

function AdminLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { unreadCount, notifications, markAsRead } = useNotifications();
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [isMobile]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const user = authService.getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            router.push("/login");
        } else {
            setIsAdmin(true);
            setLoading(false);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [router]);

    const handleLogout = () => {
        authService.logout();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#050505]">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-primary animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="dark flex min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-primary/30">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
            </div>

            {/* Desktop Sidebar */}
            <aside
                className={`hidden lg:flex ${isSidebarOpen ? "w-72" : "w-20"
                    } transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-white/5 bg-black/40 backdrop-blur-2xl h-screen sticky top-0 flex flex-col z-50`}
            >
                <div className="p-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[0_0_20px_color-mix(in_srgb,var(--primary),transparent_60%)]"
                        >
                            <ShieldCheck className="w-6 h-6 text-black" />
                        </motion.div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="overflow-hidden"
                                >
                                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
                                        KhmerWork
                                    </span>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-80">Admin Console</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                <div className="px-4 py-6 flex-1 space-y-8 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1">
                        {isSidebarOpen && <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Main Menu</p>}
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}>
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className={`
                      relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                      ${isActive
                                                ? "bg-primary text-black font-semibold shadow-[0_10px_30px_color-mix(in_srgb,var(--primary),transparent_80%)]"
                                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }
                    `}
                                    >
                                        <item.icon size={22} className={isActive ? "text-black" : "group-hover:text-primary transition-colors"} />
                                        {isSidebarOpen && (
                                            <div className="flex flex-col">
                                                <span className="text-sm">{item.label}</span>
                                                <span className={`text-[10px] opacity-60 font-normal leading-tight ${isActive ? "text-black/70" : "text-gray-500"}`}>
                                                    {item.description}
                                                </span>
                                            </div>
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-pill"
                                                className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black/40"
                                            />
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="space-y-1">
                        {isSidebarOpen && <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">System</p>}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-gray-400 hover:bg-red-500/10 hover:text-red-400 group focus:outline-none"
                        >
                            <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
                            {isSidebarOpen && (
                                <div className="flex flex-col items-start">
                                    <span className="text-sm">Sign Out</span>
                                    <span className="text-[10px] opacity-60 font-normal">End your session</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Avatar className="w-10 h-10 border border-white/10 group-hover:border-primary/50 transition-colors">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary text-black font-bold">SY</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#050505] rounded-full"></div>
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold truncate">System Admin</p>
                                <p className="text-[10px] text-gray-500 truncate font-mono uppercase">Level 10 Access</p>
                            </div>
                        )}
                        {isSidebarOpen && (
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-white">
                                <ChevronRight className="rotate-180" size={18} />
                            </Button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent">
                {/* Top Header */}
                <header className={`
          sticky top-0 z-40 flex items-center justify-between px-8 py-4 transition-all duration-300
          ${scrolled ? "bg-black/40 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"}
        `}>
                    <div className="flex items-center gap-4 flex-1">
                        <div className="lg:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-gray-400">
                                        <Menu size={20} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-72 bg-[#050505] border-white/5">
                                    <div className="h-full flex flex-col">
                                        <div className="p-8 flex items-center justify-between">
                                            <Link href="/admin" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                                    <ShieldCheck className="w-6 h-6 text-black" />
                                                </div>
                                                <div>
                                                    <span className="text-xl font-bold tracking-tight text-white">KhmerWork</span>
                                                    <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold opacity-80">Admin Console</p>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="px-4 py-6 flex-1 space-y-8 overflow-y-auto">
                                            <div className="space-y-1">
                                                <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Main Menu</p>
                                                {menuItems.map((item) => {
                                                    const isActive = pathname === item.href;
                                                    return (
                                                        <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                                                            <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl ${isActive ? "bg-primary text-black font-semibold" : "text-gray-400 hover:bg-white/5"}`}>
                                                                <item.icon size={22} />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm">{item.label}</span>
                                                                    <span className={`text-[10px] opacity-60 ${isActive ? "text-black/70" : "text-gray-500"}`}>{item.description}</span>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">System</p>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-400">
                                                    <LogOut size={22} />
                                                    <span className="text-sm font-semibold">Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6 border-t border-white/5">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-10 h-10 border border-white/10">
                                                    <AvatarFallback className="bg-primary text-black font-bold">SY</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-semibold truncate text-white">System Admin</p>
                                                    <p className="text-[10px] text-gray-500 truncate font-mono uppercase">Level 10 Access</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className="hidden lg:flex">
                            {!isSidebarOpen && (
                                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-gray-400">
                                    <Menu size={20} />
                                </Button>
                            )}
                        </div>
                        <div className="relative hidden md:flex items-center group max-w-md w-full">
                            <Search className="absolute left-3 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Universal Search..."
                                className="pl-10 h-10 bg-white/5 border-white/5 rounded-xl text-sm focus:bg-white/10 transition-all focus:ring-1 focus:ring-primary/30 w-full"
                            />
                            <div className="absolute right-3 flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-gray-500">
                                <CommandIcon size={10} /> K
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
                                        <Bell size={20} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#050505]"></span>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80 bg-[#111] border-white/10 text-gray-200 p-0 overflow-hidden rounded-3xl">
                                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                        <h3 className="font-bold">Notifications</h3>
                                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{unreadCount} New</span>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 italic text-sm">
                                                No notifications observed.
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => !n.read && markAsRead(n.id)}
                                                    className={`p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer ${!n.read ? 'bg-primary/[0.02]' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`}></div>
                                                        <div className="space-y-1">
                                                            <p className={`text-sm ${!n.read ? 'text-white' : 'text-gray-400'}`}>{n.message}</p>
                                                            <p className="text-[10px] text-gray-600 font-mono italic">
                                                                {new Date(n.createdAt).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 bg-white/[0.01] border-t border-white/5 text-center">
                                        <Button variant="ghost" className="text-[10px] font-black uppercase text-gray-500 hover:text-primary transition-colors">Clear All Local Logs</Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="gap-3 px-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5 transition-all">
                                    <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-primary font-bold text-xs">
                                        SA
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-xs font-semibold">Admin</p>
                                        <p className="text-[10px] text-gray-500">Online</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10 text-gray-200">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem onSelect={() => router.push("/admin/settings")} className="gap-2 cursor-pointer focus:bg-primary focus:text-black">
                                    <Settings size={16} /> Profile Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => router.push("/admin/settings")} className="gap-2 cursor-pointer focus:bg-primary focus:text-black">
                                    <Bell size={16} /> Preferences
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem onSelect={handleLogout} className="gap-2 cursor-pointer text-red-400 focus:bg-red-500/20 focus:text-red-400">
                                    <LogOut size={16} /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 pt-4 z-10 w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{
                                duration: 0.4,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>

                <footer className="px-8 py-6 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-600 font-mono tracking-widest uppercase">
                        KhmerWork Platform v2.0.4 • {new Date().getFullYear()} • Secure Environment
                    </p>
                </footer>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: color-mix(in srgb, var(--primary), transparent 80%);
        }
      `}</style>
        </div>
    );
}
