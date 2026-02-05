"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Search, MoreVertical, Phone, Video, Info, User as UserIcon, Loader2, ArrowLeft, Sparkles, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/header";
import { messagingService } from "@/lib/services/messaging";
import { authService } from "@/lib/services/auth";
import { userService } from "@/lib/services/user";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

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
    const scrollRef = useRef<HTMLDivElement>(null);

    // Check for "start_chat" param (passed from Application page ideally)
    const checkStartChat = searchParams.get("userId");

    useEffect(() => {
        const initChat = async () => {
            const user = authService.getCurrentUser();
            if (!user) {
                router.push("/login?redirect=/messages");
                return;
            }
            setCurrentUser(user);

            // Connect Socket
            const socketInstance = io("http://localhost:3001", {
                auth: { token: localStorage.getItem("token") }
            });

            socketInstance.on("connect", () => {
                console.log("Socket connected:", socketInstance.id);
            });

            socketInstance.on("newMessage", (msg: Message) => {
                handleIncomingMessage(msg);
            });

            setSocket(socketInstance);

            // Load conversations
            let currentConvs: Conversation[] = [];
            try {
                currentConvs = await messagingService.getConversations();
                setConversations(currentConvs);
            } catch (error) {
                console.error("Failed to load conversations", error);
            } finally {
                setIsLoading(false);
            }

            // Check for userId param to start chat
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

            return () => {
                socketInstance.disconnect();
            };
        };

        initChat();
    }, [searchParams]);

    const fetchConversations = async () => {
        try {
            const data = await messagingService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        }
    };

    const handleIncomingMessage = (msg: Message) => {
        // If chat is open with sender, append message
        // Using function update to access current state inside event listener if needed, 
        // but here we rely on selectedUser state which might be stale in closure.
        // Better to use ref or dependency, but simple check:
        setMessages(prev => {
            // Check if this message belongs to current chat
            // Issue: selectedUser might be null or different in closure if not handled.
            // We'll update the conversation list regardless.
            return [...prev, msg];
        });

        // Refresh conversations to update "Last Message"
        fetchConversations();
    };

    // Load messages when a user is selected
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

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !selectedUser) return;

        // Emit via Socket
        // We can also call REST API, but Socket is faster for UI.
        // Gateway should handle saving to DB.
        socket.emit("sendMessage", {
            receiverId: selectedUser.id,
            content: newMessage
        });

        // Optimistic UI update or wait for ack?
        // Let's assume successful send for responsiveness
        // But ideally we wait for server "messageSent" or "newMessage" echo.
        // For now, let's rely on the incoming "newMessage" event or manually append.

        // Manual append for "Me"
        const optimisticMsg: Message = {
            id: Date.now().toString(),
            content: newMessage,
            senderId: currentUser.id,
            receiverId: selectedUser.id,
            createdAt: new Date().toISOString(),
            sender: currentUser
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");
        scrollToBottom();

        // Update conversation list
        fetchConversations();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <Header />
            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar - Conversations */}
                <div
                    className={`
                        absolute inset-0 z-20 bg-background md:static md:w-80 lg:w-96 border-r border-border flex flex-col transition-transform duration-300
                        ${selectedUser ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
                    `}
                >
                    <div className="p-4 border-b border-border">
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search messages..." className="pl-9 rounded-xl bg-background" />
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        <div className="p-3 space-y-2">
                            {conversations.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">No conversations yet.</p>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.otherUser.id}
                                        onClick={() => setSelectedUser(conv.otherUser)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedUser?.id === conv.otherUser.id
                                            ? "bg-primary/10"
                                            : "hover:bg-muted"
                                            }`}
                                    >
                                        <div className="relative">
                                            <Avatar>
                                                <AvatarImage src={conv.otherUser.avatar} />
                                                <AvatarFallback>{conv.otherUser.firstName[0]}{conv.otherUser.lastName[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-background bg-green-500 rounded-full" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold truncate">
                                                    {conv.otherUser.firstName} {conv.otherUser.lastName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(new Date(conv.lastMessage.createdAt), "h:mm a")}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {conv.lastMessage.senderId === currentUser.id && "You: "}
                                                {conv.lastMessage.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col bg-background relative w-full">
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-card/50 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden -ml-2"
                                        onClick={() => setSelectedUser(null)}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                        <AvatarImage src={selectedUser.avatar} />
                                        <AvatarFallback>{selectedUser.firstName[0]}{selectedUser.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                                            {selectedUser.firstName} {selectedUser.lastName}
                                        </h3>
                                        <p className="text-xs text-green-500 font-medium">Online</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
                                        <Video className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <Info className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <ScrollArea className="flex-1 p-4 sm:p-6">
                                <div className="space-y-6">
                                    {messages.map((msg, index) => {
                                        const isMe = msg.senderId === currentUser.id;
                                        return (
                                            <div
                                                key={index}
                                                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                {!isMe && (
                                                    <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mb-1">
                                                        <AvatarImage src={msg.sender.avatar} />
                                                        <AvatarFallback>{msg.sender.firstName[0]}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={`max-w-[75%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"
                                                    } flex flex-col`}>
                                                    <div
                                                        className={`p-3 sm:p-4 rounded-2xl text-sm sm:text-base ${isMe
                                                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                            : "bg-muted text-foreground rounded-tl-sm"
                                                            }`}
                                                    >
                                                        <p>{msg.content}</p>
                                                    </div>
                                                    <span className="text-[10px] sm:text-xs text-muted-foreground mt-1 px-1">
                                                        {format(new Date(msg.createdAt), "h:mm a")}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* AI Suggestions Overlay */}
                            <AnimatePresence>
                                {showAiSuggestions && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-20 left-4 right-4 sm:left-6 sm:right-6 bg-card border border-border shadow-xl rounded-2xl p-4 z-10"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                                                <Bot className="h-4 w-4" />
                                                AI Smart Replies
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-muted-foreground"
                                                onClick={() => setShowAiSuggestions(false)}
                                            >
                                                Close
                                            </Button>
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2">
                                            {["Hi! I'm interested in your project.", "Could we schedule a call to discuss details?", "I have attached my portfolio for your review.", "Thanks for reaching out! When are you available?"].map((suggestion, i) => (
                                                <Button
                                                    key={i}
                                                    variant="outline"
                                                    className="justify-start h-auto py-2 px-3 text-left whitespace-normal text-sm hover:border-purple-500 hover:bg-purple-50 hover:text-purple-700 transition-colors"
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

                            {/* Chat Input */}
                            <div className="p-3 sm:p-4 border-t border-border bg-card/50 backdrop-blur-sm">
                                <form onSubmit={sendMessage} className="flex items-center gap-2 sm:gap-3">
                                    <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hidden sm:flex">
                                        <MoreVertical className="h-5 w-5" />
                                    </Button>

                                    {/* AI Assist Button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full h-10 w-10 sm:h-12 sm:w-12 border-purple-500/20 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                        title="Get AI Suggestion"
                                        onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                                    >
                                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>

                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 rounded-full h-10 sm:h-12 bg-background border-border"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-lg shadow-primary/25 shrink-0"
                                        disabled={!newMessage.trim()}
                                    >
                                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 hidden md:flex">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <UserIcon className="h-10 w-10 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Select a Conversation</h2>
                            <p className="text-muted-foreground max-w-sm">
                                Choose a person from the left sidebar to start chatting or check your new messages.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
