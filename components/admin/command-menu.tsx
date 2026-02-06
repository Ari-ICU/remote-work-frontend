"use client";

import * as React from "react";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search as SearchIcon,
    Briefcase,
    Users as UsersIcon,
    Loader2
} from "lucide-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { adminService } from "@/lib/services/admin";
import { useRouter } from "next/navigation";

export function CommandMenu() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState<{ users: any[], jobs: any[] }>({ users: [], jobs: [] });
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    React.useEffect(() => {
        if (!query) {
            setResults({ users: [], jobs: [] });
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await adminService.search(query);
                setResults(res);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <>
            <div
                onClick={() => setOpen(true)}
                className="relative hidden md:flex items-center group max-w-md w-full cursor-pointer"
            >
                <SearchIcon className="absolute left-3 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <div className="pl-10 h-10 bg-white/5 border border-white/5 rounded-xl text-sm flex items-center text-gray-500 w-full group-hover:bg-white/10 transition-all">
                    Universal Search...
                </div>
                <div className="absolute right-3 flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-gray-500">
                    <span className="text-[8px]">⌘</span> K
                </div>
            </div>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type to search users, jobs, or commands..."
                    onValueChange={setQuery}
                />
                <CommandList className="bg-[#0a0a0a] border-t border-white/5">
                    {loading && (
                        <div className="p-4 flex justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                    )}
                    <CommandEmpty>No results found.</CommandEmpty>

                    {results.users.length > 0 && (
                        <CommandGroup heading="Users">
                            {results.users.map((user) => (
                                <CommandItem
                                    key={user.id}
                                    onSelect={() => runCommand(() => router.push(`/admin/users?search=${user.email}`))}
                                    className="flex items-center gap-2"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{user.firstName} {user.lastName}</span>
                                    <span className="text-xs text-gray-500 ml-auto">{user.email}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    {results.jobs.length > 0 && (
                        <CommandGroup heading="Jobs">
                            {results.jobs.map((job) => (
                                <CommandItem
                                    key={job.id}
                                    onSelect={() => runCommand(() => router.push(`/admin/jobs?search=${job.title}`))}
                                    className="flex items-center gap-2"
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    <span>{job.title}</span>
                                    <span className="text-xs text-gray-500 ml-auto">{job.companyName}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandSeparator />
                    <CommandGroup heading="Quick Actions">
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin"))}>
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>Dashboard Overview</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin/users"))}>
                            <UsersIcon className="mr-2 h-4 w-4" />
                            <span>User Management</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push("/admin/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>System Settings</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
