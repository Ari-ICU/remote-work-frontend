"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { fadeIn, scaleUp } from "@/lib/animations";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Header />

            <main className="flex-1 py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col justify-center"
                        >
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                                Get in touch
                            </h1>
                            <p className="mt-4 text-xl text-muted-foreground leading-relaxed">
                                Have questions about posting a job or finding work?
                                We're here to help you succeed in the remote world.
                            </p>

                            <div className="mt-10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">Email</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">help@khmerwork.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <MessageSquare className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">Live Chat</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">Available Mon-Fri, 9am-6pm</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">Office</h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Phnom Penh, Cambodia
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-card border border-border rounded-3xl p-8 shadow-sm"
                        >
                            {isSent ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
                                        <Check className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground">Message Sent!</h2>
                                    <p className="mt-2 text-muted-foreground">We'll get back to you within 24 hours.</p>
                                    <Button
                                        variant="outline"
                                        className="mt-8"
                                        onClick={() => setIsSent(false)}
                                    >
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First name</Label>
                                            <Input id="firstName" required placeholder="John" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last name</Label>
                                            <Input id="lastName" required placeholder="Doe" className="h-12 rounded-xl" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" required placeholder="john@example.com" className="h-12 rounded-xl" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" required placeholder="How can we help?" className="h-12 rounded-xl" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            required
                                            placeholder="Tell us more about your inquiry..."
                                            className="min-h-[150px] rounded-xl resize-none"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 rounded-xl font-bold text-lg"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Send Message <Send className="h-4 w-4" />
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Icon component
function Check({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
