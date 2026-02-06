"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, MoreVertical, Phone, Video, Info, User as UserIcon, Loader2, ArrowLeft, Sparkles, Bot, Trash2, Edit2, X, MoreHorizontal, Check, CheckCheck } from "lucide-react";
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

    useEffect(() => {
        let socketInstance: any;

        const initChat = async () => {
            const user = authService.getCurrentUser();
            if (!user) {
                router.push("/login?redirect=/messages");
                return;
            }
            setCurrentUser(user);

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            socketInstance = io(apiUrl, {
                auth: { token: localStorage.getItem("token") }
            });

            socketInstance.on("newMessage", (msg: Message) => {
                handleIncomingMessage(msg);
            });

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

            setSocket(socketInstance);

            let currentConvs: Conversation[] = [];
            try {
                currentConvs = await messagingService.getConversations();
                setConversations(currentConvs);
            } catch (error) {
                console.error("Failed to load conversations", error);
            } finally {
                setIsLoading(false);
            }

            const startChatUserId = searchParams.get("userId");
            if (startChatUserId) {
                const existingConv = currentConvs.find(c => c.otherUser.id === startChatUserId);
                if (existingConv) {
                    setSelectedUser(existingConv.otherUser);
                } else {
                    try {
                        const newUser = await userService.getProfile(startChatUserId);
                        setSelectedUser(newUser);
                    } catch (err) {
                        console.error("Failed to fetch user for chat", err);
                    }
                }
            }
        };

        initChat();

        return () => {
            if (socketInstance) socketInstance.disconnect();
        };
    }, [searchParams, router]);

    const fetchConversations = async () => {
        try {
            const data = await messagingService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
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

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !socket) return;

        if (editingMessageId) {
            handleUpdateMessage(newMessage);
            return;
        }

        socket.emit("sendMessage", {
            receiverId: selectedUser.id,
            content: newMessage
        });

        const optimisticMsg: Message = {
            id: `temp-${Date.now()}`,
            content: newMessage,
            senderId: currentUser.id,
            receiverId: selectedUser.id,
            createdAt: new Date().toISOString(),
            sender: currentUser,
            read: false
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");
        scrollToBottom();
        fetchConversations();
    };

    const handleDeleteMessage = (messageId: string) => {
        if (!socket) return;
        if (confirm("Are you sure you want to delete this message?")) {
            socket.emit("deleteMessage", { messageId });
        }
    };

    const handleDeleteConversation = (otherUserId: string, otherUserName: string) => {
        if (!socket) return;
        if (confirm(`Delete conversation with ${otherUserName}? This cannot be undone.`)) {
            socket.emit("deleteConversation", { otherUserId });
            if (selectedUser?.id === otherUserId) {
                setSelectedUser(null);
                setMessages([]);
            }
        }
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
        <div className="flex flex-col h-screen bg-[#F0F2F5] dark:bg-background">
            <div className="shrink-0">
                <Header />
            </div>
            <div className="flex flex-1 overflow-hidden relative max-w-[1600px] mx-auto w-full border-x border-border/50 bg-background shadow-2xl">
                {/* Sidebar - Telegram/Messenger Style */}
                <div
                    className={cn(
                        "absolute inset-0 z-20 bg-background md:static md:w-80 lg:w-[350px] border-r border-border flex flex-col transition-all duration-300 min-h-0 overflow-hidden",
                        selectedUser ? "-translate-x-full md:translate-x-0" : "translate-x-0"
                    )}
                >
                    <div className="p-4 space-y-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Chats</h2>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Edit2 className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search Messenger" className="pl-9 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20" />
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 relative">
                        <ScrollArea className="h-full w-full absolute inset-0">
                            <div className="px-2 pb-4 space-y-1">
                                {conversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                            <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">No messages yet</p>
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
                                            onClick={() => setSelectedUser(conv.otherUser)}
                                        >
                                            <div className="relative shrink-0">
                                                <Avatar className="h-12 w-12 border border-border/50">
                                                    <AvatarImage src={conv.otherUser.avatar} />
                                                    <AvatarFallback className="bg-primary/5 text-primary">
                                                        {conv.otherUser.firstName[0]}{conv.otherUser.lastName[0]}
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
                                                    !conv.lastMessage.read && conv.lastMessage.senderId !== currentUser.id
                                                        ? "font-bold text-foreground"
                                                        : "text-muted-foreground"
                                                )}>
                                                    {conv.lastMessage.senderId === currentUser.id && "You: "}
                                                    {conv.lastMessage.content}
                                                </p>
                                            </div>

                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-border/50">
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => {
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
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Main Chat Area - Clean & Premium */}
                <div className="flex-1 flex flex-col bg-background relative w-full min-h-0 border-l border-border/50 overflow-hidden">
                    {selectedUser ? (
                        <>
                            {/* Modern Chat Header */}
                            <div className="h-[70px] border-b border-border/50 flex items-center justify-between px-4 sm:px-6 bg-background/80 backdrop-blur-md z-10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden -ml-2 rounded-full"
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <Avatar className="h-10 w-10 sm:h-11 sm:w-11 ring-2 ring-primary/5">
                                        <AvatarImage src={selectedUser.avatar} />
                                        <AvatarFallback className="bg-primary/5 text-primary text-base">
                                            {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-[15px] sm:text-[16px] leading-tight cursor-pointer hover:underline">
                                            {selectedUser.firstName} {selectedUser.lastName}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Active now</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/5">
                                        <Phone className="h-[18px] w-[18px]" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/5 hidden sm:flex">
                                        <Video className="h-[18px] w-[18px]" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/5">
                                                <Info className="h-[18px] w-[18px]" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/50">
                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteConversation(selectedUser.id, selectedUser.firstName)}>
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Entire Chat
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            {/* Chat Messages - Telegram Layout */}
                            <div className="flex-1 relative min-h-0">
                                <ScrollArea className="h-full w-full absolute inset-0">
                                    <div className="p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
                                        {/* Date Separator Placeholder */}
                                        <div className="flex justify-center my-6">
                                            <span className="text-[10px] font-bold text-muted-foreground/60 bg-muted/30 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
                                        </div>

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
                                                                "p-3 sm:px-4 sm:py-2.5 rounded-[18px] text-[15px] leading-snug relative transition-all duration-200",
                                                                isMe
                                                                    ? "bg-primary text-primary-foreground rounded-br-[4px]"
                                                                    : "bg-muted text-foreground rounded-bl-[4px]",
                                                                editingMessageId === msg.id && "ring-2 ring-primary ring-offset-2 scale-[1.02]"
                                                            )}
                                                        >
                                                            <p style={{ wordBreak: 'break-word' }}>{msg.content}</p>

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

                                {/* Premium Messenger Style Input */}
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
                                        <Button type="button" variant="ghost" size="icon" className="rounded-full text-primary hover:bg-primary/5 hidden sm:flex shrink-0">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>

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
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 hidden md:flex bg-[#F0F2F5] dark:bg-background/50">
                            <div className="w-28 h-28 bg-white dark:bg-muted/30 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-black/5 animate-bounce-slow">
                                <UserIcon className="h-12 w-12 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black mb-3 tracking-tight">Select a Chat</h2>
                            <p className="text-muted-foreground max-w-[300px] text-[15px] leading-relaxed">
                                Pick a conversation from the list to start messaging or view your history.
                            </p>
                            <Button className="mt-8 rounded-full px-8 h-12 font-bold shadow-lg">New Conversation</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface MessageSquareProps extends React.SVGProps<SVGSVGElement> { }
function MessageSquare(props: MessageSquareProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
}
