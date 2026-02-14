"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import io from "socket.io-client";
import { Buffer } from "buffer";
import { motion, AnimatePresence } from "framer-motion";
import type SimplePeer from "simple-peer";
import { Send, Search, MoreVertical, Phone, Video, Info, User as UserIcon, Loader2, ArrowLeft, Sparkles, Bot, Trash2, Edit2, X, MoreHorizontal, Check, CheckCheck, Paperclip, Image as ImageIcon, File as FileIcon, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/header";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { messagingService } from "@/lib/services/messaging";
import { authService } from "@/lib/services/auth";
import { userService } from "@/lib/services/user";
import { format, isSameDay } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCookie } from "@/lib/utils/cookies";
import { toast } from "sonner";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
}

interface Conversation {
    otherUser: User;
    lastMessage: {
        content: string;
        createdAt: string;
        read: boolean;
        senderId: string;
    };
    unreadCount: number;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    sender: User;
    updatedAt?: string;
    read?: boolean;
    type?: 'TEXT' | 'IMAGE' | 'FILE';
    fileUrl?: string;
}

export default function MessagesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [showAiSuggestions, setShowAiSuggestions] = useState(false);

    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSendingFile, setIsSendingFile] = useState(false);

    // WebRTC State
    const [activeCall, setActiveCall] = useState<'voice' | 'video' | 'incoming' | null>(null);
    const [callDuration, setCallDuration] = useState(0);
    const [callSignal, setCallSignal] = useState<any>(null);
    const [caller, setCaller] = useState<any>(null); // Who is calling me
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<SimplePeer.Instance | null>(null);

    // Call timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeCall) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            setCallDuration(0);
        }
        return () => clearInterval(interval);
    }, [activeCall]);

    const formatCallTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const callUser = async (type: 'voice' | 'video') => {
        if (!selectedUser || !socket || !currentUser) return;

        setActiveCall(type);
        setCallAccepted(false);

        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }

            const SimplePeer = (await import('simple-peer')).default;
            const peer = new SimplePeer({
                initiator: true,
                trickle: false,
                stream: currentStream
            });

            peer.on('signal', (data: any) => {
                socket.emit("callUser", {
                    userToCall: selectedUser.id,
                    signalData: data,
                    from: currentUser.id,
                    name: currentUser.firstName
                });
            });

            peer.on('stream', (currentStream: MediaStream) => {
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }
            });

            peer.on('close', () => {
                endCall();
            });

            connectionRef.current = peer;
        } catch (err) {
            console.error("Failed to get media", err);
            toast.error("Could not access camera/microphone");
            setActiveCall(null);
        }
    };

    const answerCall = async () => {
        setCallAccepted(true);
        setActiveCall('video');

        try {
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            setStream(currentStream);
            if (myVideo.current) {
                myVideo.current.srcObject = currentStream;
            }

            const SimplePeer = (await import('simple-peer')).default;
            const peer = new SimplePeer({
                initiator: false,
                trickle: false,
                stream: currentStream
            });

            peer.on('signal', (data: any) => {
                socket.emit("answerCall", { signal: data, to: caller.id });
            });

            peer.on('stream', (currentStream: MediaStream) => {
                if (userVideo.current) {
                    userVideo.current.srcObject = currentStream;
                }
            });

            peer.on('close', () => {
                endCall();
            });

            peer.signal(callSignal);
            connectionRef.current = peer;

        } catch (err) {
            console.error("Failed to get media", err);
            endCall();
        }
    };

    const endCall = () => {
        setCallAccepted(false);
        setActiveCall(null);
        setCaller(null);
        setCallSignal(null);

        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
        connectionRef.current = null;

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }

        if (caller?.id) {
            socket?.emit("hangUp", { to: caller.id });
        } else if (selectedUser?.id) {
            socket?.emit("hangUp", { to: selectedUser.id });
        }
    };

    // Initialize Socket & Basic Data (Run once)
    useEffect(() => {
        // Polyfill for simple-peer in Next.js environment
        if (typeof window !== 'undefined') {
            if (!(window as any).global) (window as any).global = window;
            // @ts-ignore
            if (!(window as any).Buffer) (window as any).Buffer = Buffer;
        }

        let socketInstance: any;

        const initSocket = async () => {
            const user = authService.getCurrentUser();
            if (!user) {
                router.push("/login?redirect=/messages");
                return;
            }
            setCurrentUser(user);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const token = getCookie('ws_token');

            socketInstance = io(apiUrl, {
                transports: ['websocket', 'polling'],
                withCredentials: true,
                auth: { token }
            } as any);

            socketInstance.on("newMessage", (msg: Message) => handleIncomingMessage(msg));
            socketInstance.on("messageUpdated", (updatedMsg: Message) => {
                setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
            });
            socketInstance.on("messageDeleted", ({ messageId }: { messageId: string }) => {
                setMessages(prev => prev.filter(m => m.id !== messageId));
            });
            socketInstance.on("conversationDeleted", ({ otherUserId, userId }: any) => {
                setSelectedUser(prev => (prev?.id === otherUserId || prev?.id === userId) ? null : prev);
                fetchConversations();
            });

            // WebRTC Listeners
            socketInstance.on("callMade", (data: any) => {
                setCallSignal(data.signal);
                setCaller({ id: data.from, name: data.name });
                setActiveCall("incoming");
            });

            socketInstance.on("callAnswered", (data: any) => {
                setCallAccepted(true);
                connectionRef.current?.signal(data.signal);
            });

            socketInstance.on("iceCandidate", (data: any) => {
                connectionRef.current?.signal(data.candidate);
            });

            socketInstance.on("callEnded", () => {
                endCall();
            });

            setSocket(socketInstance);
            fetchConversations();
        };

        if (typeof window !== 'undefined') {
            initSocket();
        }

        return () => {
            if (socketInstance) socketInstance.disconnect();
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
        };
    }, []);

    // Ensure media tracks are stopped on unmount or stream change
    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    // Sync selected user from URL
    useEffect(() => {
        const userIdFromUrl = searchParams.get("userId");
        if (userIdFromUrl) {
            if (selectedUser?.id === userIdFromUrl) return;

            const updateSelectedUser = async () => {
                const existingConv = conversations.find(c => c.otherUser.id === userIdFromUrl);
                if (existingConv) {
                    setSelectedUser(existingConv.otherUser);
                } else if (userIdFromUrl) {
                    try {
                        const newUser = await userService.getProfile(userIdFromUrl);
                        setSelectedUser(newUser);
                    } catch (err) {
                        console.error("Failed to fetch user from URL", err);
                    }
                }
            };
            updateSelectedUser();
        } else {
            setSelectedUser(null);
        }
    }, [searchParams, conversations.length > 0]);

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        router.push(`/messages?userId=${user.id}`, { scroll: false });
    };

    const handleBack = () => {
        setSelectedUser(null);
        router.push("/messages", { scroll: false });
    };

    const fetchConversations = async () => {
        try {
            const data = await messagingService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIncomingMessage = (msg: Message) => {
        setMessages(prev => {
            const existingIndex = prev.findIndex(m =>
                m.id === msg.id ||
                (m.id.startsWith('temp-') && m.content === msg.content && m.senderId === msg.senderId)
            );

            if (existingIndex !== -1) {
                const next = [...prev];
                next[existingIndex] = msg;
                return next;
            }
            return [...prev, msg];
        });
        fetchConversations();
        scrollToBottom();
    };

    useEffect(() => {
        if (editingMessageId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingMessageId]);

    useEffect(() => {
        if (selectedUser) {
            loadMessages(selectedUser.id);
        }
    }, [selectedUser]);

    const loadMessages = async (otherUserId: string) => {
        setIsLoadingMessages(true);
        try {
            const data = await messagingService.getMessages(otherUserId);
            setMessages(data);
            scrollToBottom();
        } catch (error) {
            console.error("Failed to load messages", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    const handleUpdateMessage = (content: string) => {
        if (!editingMessageId || !content.trim() || !socket) return;
        socket.emit("updateMessage", {
            messageId: editingMessageId,
            content: content
        });
        setEditingMessageId(null);
        setNewMessage("");
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedUser || !socket) return;

        setIsSendingFile(true);
        try {
            const { fileUrl, mimetype } = await messagingService.uploadAttachment(file);
            const isImage = mimetype.startsWith('image/');
            const type = isImage ? 'IMAGE' : 'FILE';

            socket.emit("sendMessage", {
                receiverId: selectedUser.id,
                content: file.name,
                type,
                fileUrl
            });

            const optimisticMsg: Message = {
                id: `temp-${Date.now()}`,
                content: file.name,
                senderId: currentUser.id,
                receiverId: selectedUser.id,
                createdAt: new Date().toISOString(),
                sender: currentUser,
                read: false,
                type,
                fileUrl
            };

            setMessages(prev => [...prev, optimisticMsg]);
            scrollToBottom();
            fetchConversations();
        } catch (error) {
            console.error("Failed to upload file", error);
            toast.error("Failed to upload file. Please try again.");
        } finally {
            setIsSendingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !socket) return;

        if (editingMessageId) {
            handleUpdateMessage(newMessage);
            return;
        }

        socket.emit("sendMessage", {
            receiverId: selectedUser.id,
            content: newMessage,
            type: 'TEXT'
        });

        const optimisticMsg: Message = {
            id: `temp-${Date.now()}`,
            content: newMessage,
            senderId: currentUser.id,
            receiverId: selectedUser.id,
            createdAt: new Date().toISOString(),
            sender: currentUser,
            read: false,
            type: 'TEXT'
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");
        scrollToBottom();
        fetchConversations();
    };

    const handleDeleteMessage = (messageId: string) => {
        if (!socket) return;
        toast("Delete this message?", {
            action: {
                label: "Delete",
                onClick: () => socket.emit("deleteMessage", { messageId })
            },
        });
    };

    const handleDeleteConversation = (otherUserId: string, otherUserName: string) => {
        if (!socket) return;
        toast(`Delete conversation with ${otherUserName}?`, {
            description: "This cannot be undone.",
            action: {
                label: "Delete All",
                onClick: () => {
                    socket.emit("deleteConversation", { otherUserId });
                    if (selectedUser?.id === otherUserId) {
                        setSelectedUser(null);
                        setMessages([]);
                    }
                }
            },
        });
    };

    const formatMessageTime = (date: string) => {
        return format(new Date(date), "h:mm a");
    };

    const formatConversationDate = (date: string) => {
        const d = new Date(date);
        if (isSameDay(d, new Date())) {
            return format(d, "h:mm a");
        }
        return format(d, "MMM d");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-background overflow-hidden ">
            <div className="h-16 flex-none bg-background relative z-50">
                <Header />
            </div>
            <div className="flex-1 overflow-hidden relative">
                <div className="flex h-full max-w-[1600px] mx-auto w-full md:border-x border-border/40 bg-background md:shadow-2xl relative">
                    {/* Sidebar */}
                    <div
                        className={cn(
                            "absolute inset-0 z-30 bg-background md:static md:translate-x-0 md:w-[320px] lg:w-[380px] border-r border-border/50 flex flex-col transition-transform duration-300 ease-in-out min-h-0 overflow-hidden",
                            selectedUser ? "-translate-x-full" : "translate-x-0"
                        )}
                    >
                        <div className="p-4 space-y-4 flex-none bg-background/95 backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold tracking-tight">Messages</h2>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                                    <Edit2 className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input placeholder="Search messages..." className="pl-9 rounded-2xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20 h-10 transition-all text-sm" />
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 relative">
                            <ScrollArea className="h-full w-full absolute inset-0">
                                <div className="px-2 pb-4 space-y-1">
                                    {conversations.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/[0.02]">
                                                <MessageSquare className="h-10 w-10 text-primary/40" />
                                            </div>
                                            <h3 className="text-base font-bold mb-1">No conversations yet</h3>
                                            <p className="text-sm text-muted-foreground max-w-[200px]">Start a new chat to connect with others.</p>
                                        </div>
                                    ) : (
                                        conversations.map((conv) => (
                                            <div
                                                key={conv.otherUser.id}
                                                className={cn(
                                                    "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all group relative",
                                                    selectedUser?.id === conv.otherUser.id
                                                        ? "bg-primary/10"
                                                        : "hover:bg-muted/80"
                                                )}
                                                onClick={() => handleSelectUser(conv.otherUser)}
                                            >
                                                <div className="relative shrink-0">
                                                    <Avatar className="h-12 w-12 border border-border/50">
                                                        <AvatarImage src={conv.otherUser.avatar} />
                                                        <AvatarFallback className="bg-primary/5 text-primary">
                                                            {conv.otherUser.firstName?.[0]}{conv.otherUser.lastName?.[0]}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-background bg-green-500 rounded-full" />
                                                </div>
                                                <div className="flex-1 min-w-0 pr-6">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <span className="font-semibold truncate text-[15px]">
                                                            {conv.otherUser.firstName} {conv.otherUser.lastName}
                                                        </span>
                                                        <span className="text-[11px] text-muted-foreground shrink-0">
                                                            {formatConversationDate(conv.lastMessage.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className={cn(
                                                        "text-[13px] truncate leading-tight mt-0.5",
                                                        conv.unreadCount > 0
                                                            ? "font-bold text-foreground"
                                                            : "text-muted-foreground"
                                                    )}>
                                                        {currentUser && conv.lastMessage.senderId === currentUser.id && "You: "}
                                                        {conv.lastMessage.content}
                                                    </p>
                                                </div>

                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-end gap-2">
                                                    {conv.unreadCount > 0 && (
                                                        <span className="h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-background">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-muted opacity-0 group-hover:opacity-100 transition-all">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-2xl border-border/50 p-2">
                                                                <DropdownMenuItem className="rounded-xl text-destructive focus:text-destructive focus:bg-destructive/5 font-medium py-2" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteConversation(conv.otherUser.id, `${conv.otherUser.firstName} ${conv.otherUser.lastName}`);
                                                                }}>
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Delete Chat
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col bg-background relative w-full border-l border-border/50 overflow-hidden">
                        {selectedUser ? (
                            <>
                                <div
                                    className="w-full flex-none min-h-[64px] mt-22 md:min-h-[72px] border-b border-border flex items-center justify-between px-4 md:px-6 bg-card/95 backdrop-blur-md text-card-foreground shadow-sm relative z-40"
                                >
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="md:hidden -ml-2 rounded-full"
                                            onClick={handleBack}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <Link href={`/profile/${selectedUser.id}`} className="transition-transform hover:scale-105 active:scale-95">
                                            <Avatar className="h-10 w-10 sm:h-11 sm:w-11 ring-2 ring-primary/5">
                                                <AvatarImage src={selectedUser.avatar} />
                                                <AvatarFallback className="bg-primary/5 text-primary text-base">
                                                    {selectedUser.firstName?.[0] || '?'}{selectedUser.lastName?.[0] || ''}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div className="flex flex-col">
                                            <Link href={`/profile/${selectedUser.id}`}>
                                                <h3 className="font-bold text-[16px] leading-tight cursor-pointer hover:text-primary transition-colors">
                                                    {selectedUser.firstName} {selectedUser.lastName}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <div className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                </div>
                                                <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Online</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 sm:gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95"
                                            onClick={() => callUser('voice')}
                                        >
                                            <Phone className="h-[18px] w-[18px]" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-9 w-9 rounded-xl text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95"
                                            onClick={() => callUser('video')}
                                        >
                                            <Video className="h-[18px] w-[18px]" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95"
                                                >
                                                    <Info className="h-[18px] w-[18px]" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/50 p-2">
                                                <Link href={`/profile/${selectedUser.id}`}>
                                                    <DropdownMenuItem className="rounded-lg cursor-pointer">
                                                        <UserIcon className="h-4 w-4 mr-2" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="rounded-lg text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer mt-1" onClick={() => handleDeleteConversation(selectedUser.id, selectedUser.firstName)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Entire Chat
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 relative min-h-0 bg-[#f8f9fa] dark:bg-background/20">
                                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")` }}></div>
                                    <ScrollArea className="h-full w-full absolute inset-0">
                                        <div className="p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full relative z-10">
                                            {messages.length > 0 && (
                                                <div className="flex justify-center my-6">
                                                    <span className="text-[10px] font-bold text-muted-foreground/60 bg-background/50 backdrop-blur-sm border border-border/50 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Today</span>
                                                </div>
                                            )}

                                            {messages.map((msg, idx) => {
                                                const isMe = msg.senderId === currentUser.id;
                                                const nextMsg = messages[idx + 1];
                                                const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
                                                const showAvatar = !isMe && isLastInGroup;

                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        key={msg.id}
                                                        className={cn(
                                                            "flex items-end gap-2 group",
                                                            isMe ? "justify-end" : "justify-start",
                                                            isLastInGroup ? "mb-4" : "mb-1"
                                                        )}
                                                    >
                                                        {!isMe && (
                                                            <div className="w-8 shrink-0">
                                                                {showAvatar && (
                                                                    <Avatar className="w-8 h-8">
                                                                        <AvatarImage src={msg.sender.avatar} />
                                                                        <AvatarFallback className="text-[10px]">{msg.sender.firstName[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className={cn(
                                                            "flex flex-col max-w-[80%] sm:max-w-[70%] relative",
                                                            isMe ? "items-end" : "items-start"
                                                        )}>
                                                            <div
                                                                className={cn(
                                                                    "p-3 rounded-[20px] text-[15px] leading-relaxed relative transition-all duration-200 shadow-sm",
                                                                    isMe
                                                                        ? "bg-primary text-primary-foreground rounded-br-[4px] shadow-primary/10"
                                                                        : "bg-card text-foreground rounded-bl-[4px] border border-border/50",
                                                                    editingMessageId === msg.id && "ring-2 ring-primary ring-offset-2 scale-[1.02]",
                                                                    msg.type === 'IMAGE' && "p-1.5"
                                                                )}
                                                            >
                                                                {msg.type === 'IMAGE' ? (
                                                                    <div className="relative group/img max-w-sm rounded-[12px] overflow-hidden bg-muted/20">
                                                                        <img
                                                                            src={msg.fileUrl?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${msg.fileUrl}` : msg.fileUrl}
                                                                            alt="Attachment"
                                                                            className="max-h-[300px] w-auto max-w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                            onClick={() => window.open(msg.fileUrl?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${msg.fileUrl}` : msg.fileUrl, '_blank')}
                                                                        />
                                                                    </div>
                                                                ) : msg.type === 'FILE' ? (
                                                                    <div className="flex items-center gap-3 p-2 bg-black/10 rounded-[12px] border border-white/10 group/file">
                                                                        <div className="h-10 w-10 rounded-lg bg-background/20 flex items-center justify-center">
                                                                            <FileIcon className="h-5 w-5" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0 pr-2">
                                                                            <p className="text-sm font-bold truncate">{msg.content}</p>
                                                                            <p className="text-[10px] opacity-60 uppercase font-black tracking-tighter">Attachment</p>
                                                                        </div>
                                                                        <Button
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="h-8 w-8 rounded-full opacity-0 group-hover/file:opacity-100 transition-opacity -mr-1"
                                                                            onClick={() => window.open(msg.fileUrl?.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}${msg.fileUrl}` : msg.fileUrl, '_blank')}
                                                                        >
                                                                            <Download className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                ) : (
                                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                                )}

                                                                {isMe && (
                                                                    <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted/50">
                                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-border/50">
                                                                                <DropdownMenuItem onClick={() => {
                                                                                    setEditingMessageId(msg.id);
                                                                                    setNewMessage(msg.content);
                                                                                }}>
                                                                                    <Edit2 className="h-3.5 w-3.5 mr-2" />
                                                                                    Edit
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteMessage(msg.id)}>
                                                                                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                                                                                    Delete
                                                                                </DropdownMenuItem>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className={cn(
                                                                "flex items-center gap-1.5 mt-1 px-1",
                                                                isMe ? "flex-row-reverse" : "flex-row"
                                                            )}>
                                                                <span className="text-[10px] text-muted-foreground/70 font-medium">
                                                                    {formatMessageTime(msg.createdAt)}
                                                                </span>
                                                                {msg.updatedAt && msg.updatedAt !== msg.createdAt && (
                                                                    <span className="text-[9px] text-muted-foreground/60 italic font-medium">
                                                                        edited
                                                                    </span>
                                                                )}
                                                                {isMe && (
                                                                    <span className="text-primary">
                                                                        {msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                            <div ref={scrollRef} className="h-2" />
                                        </div>
                                    </ScrollArea>

                                    {/* Modern Suggestions */}
                                    <AnimatePresence>
                                        {showAiSuggestions && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] sm:w-[500px] bg-background border border-border/50 shadow-2xl rounded-2xl p-4 z-20 overflow-hidden"
                                            >
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-primary to-blue-500" />
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2.5 text-primary font-bold text-sm">
                                                        <div className="p-1.5 bg-primary/10 rounded-lg">
                                                            <Sparkles className="h-4 w-4" />
                                                        </div>
                                                        Smart Replies
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 rounded-full"
                                                        onClick={() => setShowAiSuggestions(false)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid gap-2.5">
                                                    {["I'm interested! When can we chat?", "Could you share the project details?", "My schedule is open tomorrow morning.", "Thanks! Looking forward to working together."].map((suggestion, i) => (
                                                        <Button
                                                            key={i}
                                                            variant="outline"
                                                            className="justify-start h-auto py-2.5 px-4 text-left whitespace-normal text-[13px] border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all rounded-xl"
                                                            onClick={() => {
                                                                setNewMessage(suggestion);
                                                                setShowAiSuggestions(false);
                                                            }}
                                                        >
                                                            {suggestion}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Input */}
                                    <div className="p-3 sm:p-5 border-t border-border/50 bg-background relative shrink-0">
                                        {editingMessageId && (
                                            <div className="absolute bottom-full left-0 right-0 bg-primary/5 border-t border-primary/20 px-6 py-2.5 flex items-center justify-between text-[12px] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                <div className="flex items-center gap-3 text-primary font-bold">
                                                    <div className="p-1 bg-primary/10 rounded">
                                                        <Edit2 className="h-3 w-3" />
                                                    </div>
                                                    Editing message
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-3 text-muted-foreground hover:text-foreground hover:bg-background/50 rounded-full font-bold"
                                                    onClick={() => {
                                                        setEditingMessageId(null);
                                                        setNewMessage("");
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                        <form onSubmit={sendMessage} className="flex items-center gap-2 sm:gap-4 max-w-5xl mx-auto w-full">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileSelect}
                                                accept="image/*,.pdf,.doc,.docx"
                                            />
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-full text-primary hover:bg-primary/5 shrink-0"
                                                        disabled={isSendingFile}
                                                    >
                                                        {isSendingFile ? (
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                        ) : (
                                                            <MoreVertical className="h-5 w-5" />
                                                        )}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start" side="top" className="w-56 rounded-2xl p-2 shadow-2xl border-white/5 backdrop-blur-xl bg-background/80">
                                                    <DropdownMenuItem
                                                        className="rounded-xl h-11 gap-3 font-semibold cursor-pointer"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                            <ImageIcon className="h-4 w-4" />
                                                        </div>
                                                        Photos & Videos
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-xl h-11 gap-3 font-semibold cursor-pointer"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                            <Paperclip className="h-4 w-4" />
                                                        </div>
                                                        Document
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="rounded-xl h-11 gap-3 font-semibold cursor-pointer">
                                                        <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                                            <Sparkles className="h-4 w-4" />
                                                        </div>
                                                        AI Assistant
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <div className="relative flex-1 group">
                                                <Input
                                                    ref={inputRef}
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    placeholder={editingMessageId ? "Edit message..." : "Type a message..."}
                                                    className="w-full rounded-[24px] h-11 sm:h-12 bg-muted/40 border-none px-5 pr-14 focus-visible:ring-1 focus-visible:ring-primary/20 text-[15px]"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-primary hover:bg-primary/10 transition-colors"
                                                    onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                                                >
                                                    <Sparkles className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <Button
                                                type="submit"
                                                size="icon"
                                                className={cn(
                                                    "h-11 w-11 sm:h-12 sm:w-12 rounded-full shadow-lg transition-all transform shrink-0",
                                                    !newMessage.trim() ? "bg-muted shadow-none scale-95" : "bg-primary hover:shadow-primary/20 active:scale-90"
                                                )}
                                                disabled={!newMessage.trim()}
                                            >
                                                {editingMessageId ? (
                                                    <Check className="h-5 w-5" />
                                                ) : (
                                                    <Send className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 hidden md:flex bg-muted/10 dark:bg-background/50">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-24 h-24 bg-card rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/10 border border-border/50">
                                        <MessageSquare className="h-10 w-10 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-3 tracking-tight">Your Messages</h2>
                                    <p className="text-muted-foreground max-w-[320px] text-[15px] leading-relaxed">
                                        Select a conversation from the sidebar to start chatting with freelancers or employers.
                                    </p>
                                    <Button className="mt-8 rounded-2xl px-8 h-12 font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                        Start a New Chat
                                    </Button>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* WebRTC Video Call Overlay */}
            <AnimatePresence>
                {activeCall && (
                    <motion.div
                        key="call-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
                    >
                        {activeCall === 'incoming' ? (
                            <div className="relative w-full max-w-md bg-card/10 border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-8 shadow-2xl animate-in zoom-in-95">
                                <div className="flex flex-col items-center gap-4">
                                    <Avatar className="h-32 w-32 border-4 border-white/10 shadow-xl">
                                        <AvatarImage src={''} />
                                        <AvatarFallback className="text-4xl bg-primary/20 text-white">
                                            {caller?.name?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-center space-y-1">
                                        <h3 className="text-2xl font-bold text-white tracking-tight">
                                            {caller?.name}
                                        </h3>
                                        <p className="text-white/60 font-medium">Incoming Call...</p>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <Button
                                        size="icon"
                                        className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600"
                                        onClick={endCall}
                                    >
                                        <Phone className="h-8 w-8 text-white rotate-[135deg]" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 animate-pulse"
                                        onClick={answerCall}
                                    >
                                        <Phone className="h-8 w-8 text-white" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                                {/* Remote Video (Main) */}
                                {callAccepted && (
                                    <video
                                        playsInline
                                        ref={userVideo}
                                        autoPlay
                                        className="absolute inset-0 w-full h-full object-cover z-0"
                                    />
                                )}

                                {(!callAccepted && selectedUser) && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80">
                                        <Avatar className="h-32 w-32 border-4 border-white/10 shadow-xl mb-4">
                                            <AvatarImage src={selectedUser.avatar} />
                                            <AvatarFallback className="text-4xl bg-primary/20 text-white">
                                                {selectedUser.firstName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <h3 className="text-2xl font-bold text-white mb-2">Calling {selectedUser.firstName}...</h3>
                                        <div className="flex gap-1.5 h-3 items-center">
                                            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                )}

                                {/* Local Video (PiP) */}
                                <div className="absolute top-4 right-4 w-32 sm:w-48 aspect-video bg-gray-900 rounded-xl overflow-hidden border border-white/20 shadow-lg z-20">
                                    <video
                                        playsInline
                                        muted
                                        ref={myVideo}
                                        autoPlay
                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                    />
                                </div>

                                {/* Controls */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-14 w-14 rounded-full border-white/10 bg-black/40 hover:bg-white/10 text-white backdrop-blur-sm"
                                    >
                                        <MoreVertical className="h-6 w-6" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                                        onClick={endCall}
                                    >
                                        <Phone className="h-8 w-8 rotate-[135deg]" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
