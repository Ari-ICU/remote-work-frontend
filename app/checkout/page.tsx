"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { paymentService } from "@/lib/services/payment";
import { fadeIn } from "@/lib/animations";

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const plan = searchParams.get("plan") || "featured";

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const planDetails = {
        free: { price: 0, name: "Free" },
        featured: { price: 49, name: "Featured" },
        premium: { price: 99, name: "Premium" },
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.featured;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // simulate artificial delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1500));

            await paymentService.createPaymentIntent(selectedPlan.price);
            setSuccess(true);

            // Redirect to post job after short delay
            setTimeout(() => {
                router.push("/post-job?plan=" + plan);
            }, 2000);
        } catch (err) {
            setError("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <motion.div
                        initial="hidden" animate="show" variants={fadeIn}
                        className="text-center space-y-4 max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-lg"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold">Payment Successful!</h2>
                        <p className="text-muted-foreground">Redirecting you to create your job post...</p>
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-muted/30 p-6 rounded-2xl border border-border">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="flex justify-between items-center py-4 border-b border-border/50">
                                <div>
                                    <p className="font-medium">{selectedPlan.name} Job Posting</p>
                                    <p className="text-sm text-muted-foreground">30 days visibility</p>
                                </div>
                                <p className="font-bold">${selectedPlan.price}.00</p>
                            </div>
                            <div className="flex justify-between items-center pt-4 text-lg font-bold">
                                <p>Total</p>
                                <p>${selectedPlan.price}.00</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl">
                            <Lock className="h-4 w-4 text-primary" />
                            <p>Payments are secure and encrypted. We never store your full card details.</p>
                        </div>
                    </motion.div>

                    {/* Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm"
                    >
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold">Payment Details</h1>
                            <p className="text-muted-foreground text-sm">Complete your purchase to proceed</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-2 text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Cardholder Name</Label>
                                <Input placeholder="John Doe" required className="h-12 rounded-xl" />
                            </div>

                            <div className="space-y-2">
                                <Label>Card Number</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="0000 0000 0000 0000" required className="pl-11 h-12 rounded-xl" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Expiry Date</Label>
                                    <Input placeholder="MM/YY" required className="h-12 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>CVC</Label>
                                    <Input placeholder="123" required maxLength={4} className="h-12 rounded-xl" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-semibold rounded-xl"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : `Pay $${selectedPlan.price}.00`}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
