"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

interface Message {
    id: string
    role: "user" | "bot"
    content: string
}

export function AiChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "bot",
            content: "Hi! I'm your AI assistant. How can I help you find work or hire talent today?"
        }
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen, isLoading])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        try {
            const response = await api.post('/ai/chat', { message: userMessage.content })
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: response.data.reply
            }
            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error("Failed to send message", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                content: "Sorry, I'm having trouble connecting to the server. Please try again later."
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-105"
                >
                    <MessageCircle className="h-7 w-7 text-primary-foreground" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[380px] h-[600px] shadow-2xl flex flex-col border-primary/20 animate-in fade-in slide-in-from-bottom-10 duration-200">
                    <CardHeader className="flex flex-row items-center justify-between p-4 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-base font-semibold">AI Assistant</CardTitle>
                                <p className="text-xs text-muted-foreground">Always here to help</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-muted">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 overflow-hidden relative">
                        <ScrollArea className="h-full px-4 py-4">
                            <div className="space-y-4 flex flex-col pb-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-3 max-w-[85%]",
                                            message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        <Avatar className="h-8 w-8 mt-1 border">
                                            <AvatarFallback>
                                                {message.role === 'bot' ? (
                                                    <Bot className="h-4 w-4 text-primary" />
                                                ) : (
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div
                                            className={cn(
                                                "rounded-2xl px-4 py-3 text-sm shadow-sm",
                                                message.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted/50 border text-foreground rounded-tl-none"
                                            )}
                                        >
                                            {message.content}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex gap-3 max-w-[85%] mr-auto">
                                        <Avatar className="h-8 w-8 mt-1 border">
                                            <AvatarFallback>
                                                <Bot className="h-4 w-4 text-primary" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted/50 border text-foreground rounded-tl-none rounded-2xl px-4 py-3 text-sm shadow-sm">
                                            <div className="flex gap-1.5 h-full items-center">
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </CardContent>

                    <CardFooter className="p-4 border-t bg-muted/30">
                        <div className="flex w-full items-center space-x-2">
                            <Input
                                placeholder="Type your message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                disabled={isLoading}
                                className="bg-background focus-visible:ring-primary/20"
                            />
                            <Button
                                size="icon"
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                className="shrink-0 rounded-full"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}
