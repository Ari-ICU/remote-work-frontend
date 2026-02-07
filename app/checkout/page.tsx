"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    CreditCard,
    Lock,
    CheckCircle2,
    AlertCircle,
    Smartphone,
    QrCode,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/header";
import { paymentService, PaymentProvider } from "@/lib/services/payment";
import { fadeIn } from "@/lib/animations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const plan = searchParams.get("plan") || "featured";

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(PaymentProvider.CARD);
    const [khqrData, setKhqrData] = useState<any>(null);

    const planDetails = {
        free: { price: 0, name: "Free" },
        featured: { price: 49, name: "Featured" },
        premium: { price: 99, name: "Premium" },
    };

    const selectedPlan = planDetails[plan as keyof typeof planDetails] || planDetails.featured;

    const handleCardPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData(e.currentTarget as HTMLFormElement);
            const cardDetails = {
                cardholderName: formData.get("cardholderName"),
                cardNumber: formData.get("cardNumber"),
                expiryDate: formData.get("expiryDate"),
                cvc: formData.get("cvc")
            };

            // Connect payment method
            await paymentService.connectPaymentMethod(PaymentProvider.CARD, cardDetails);

            // Create payment intent
            await paymentService.createPaymentIntent(selectedPlan.price, 'usd', PaymentProvider.CARD);

            setSuccess(true);
            setTimeout(() => router.push("/post-job?plan=" + plan), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayPalPayment = async () => {
        setLoading(true);
        setError("");

        try {
            // Connect PayPal account
            const email = (document.getElementById("paypalEmail") as HTMLInputElement)?.value;
            await paymentService.connectPaymentMethod(PaymentProvider.PAYPAL, { email });

            // Create PayPal payment intent
            const intent = await paymentService.createPaymentIntent(selectedPlan.price, 'usd', PaymentProvider.PAYPAL);

            // In production, redirect to PayPal approval URL
            // window.location.href = intent.approvalUrl;

            setSuccess(true);
            setTimeout(() => router.push("/post-job?plan=" + plan), 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "PayPal connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKHQRPayment = async () => {
        setLoading(true);
        setError("");

        try {
            // Generate KHQR code
            const intent = await paymentService.createPaymentIntent(selectedPlan.price, 'usd', PaymentProvider.KHQR);
            setKhqrData(intent);

            // Connect KHQR payment method
            const phoneNumber = (document.getElementById("khqrPhone") as HTMLInputElement)?.value;
            await paymentService.connectPaymentMethod(PaymentProvider.KHQR, { phoneNumber });

            // Simulate QR code scan delay
            setTimeout(() => {
                setSuccess(true);
                setTimeout(() => router.push("/post-job?plan=" + plan), 2000);
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || "KHQR payment failed. Please try again.");
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
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Complete Your Payment</h1>
                        <p className="text-muted-foreground">Choose your preferred payment method</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="md:col-span-1"
                        >
                            <div className="bg-muted/30 p-6 rounded-2xl border border-border sticky top-24">
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
                                    <p className="text-primary">${selectedPlan.price}.00</p>
                                </div>

                                <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl">
                                    <Lock className="h-4 w-4 text-primary shrink-0" />
                                    <p>Secure payment. Your data is encrypted and protected.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Methods */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="md:col-span-2"
                        >
                            <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
                                {error && (
                                    <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        {error}
                                    </div>
                                )}

                                <Tabs defaultValue="card" className="w-full" onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}>
                                    <TabsList className="grid w-full grid-cols-3 mb-8">
                                        <TabsTrigger value="CARD" className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            <span className="hidden sm:inline">Card</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="PAYPAL" className="flex items-center gap-2">
                                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c2.347 0 4.203.645 5.072 1.765.78.998.96 2.253.537 3.735-.015.053-.029.104-.045.158-.495 1.667-1.453 2.817-2.844 3.42-1.338.58-3.064.87-5.13.87H9.68a.77.77 0 0 0-.76.653l-.52 3.283-.024.13-.92 5.822a.641.641 0 0 1-.633.74h-.747z" />
                                            </svg>
                                            <span className="hidden sm:inline">PayPal</span>
                                        </TabsTrigger>
                                        <TabsTrigger value="KHQR" className="flex items-center gap-2">
                                            <QrCode className="h-4 w-4" />
                                            <span className="hidden sm:inline">KHQR</span>
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* Card Payment */}
                                    <TabsContent value="CARD">
                                        <form onSubmit={handleCardPayment} className="space-y-6">
                                            <div className="space-y-2">
                                                <Label>Cardholder Name</Label>
                                                <Input
                                                    name="cardholderName"
                                                    placeholder="John Doe"
                                                    required
                                                    className="h-12 rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Card Number</Label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        name="cardNumber"
                                                        placeholder="4242 4242 4242 4242"
                                                        required
                                                        className="pl-11 h-12 rounded-xl"
                                                        maxLength={19}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] flex items-center justify-center font-bold">VISA</div>
                                                        <div className="w-8 h-5 bg-red-600 rounded text-white text-[8px] flex items-center justify-center font-bold">MC</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Expiry Date</Label>
                                                    <Input
                                                        name="expiryDate"
                                                        placeholder="MM/YY"
                                                        required
                                                        className="h-12 rounded-xl"
                                                        maxLength={5}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>CVC</Label>
                                                    <Input
                                                        name="cvc"
                                                        placeholder="123"
                                                        required
                                                        maxLength={4}
                                                        className="h-12 rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full h-12 text-lg font-semibold rounded-xl"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </span>
                                                ) : (
                                                    `Pay $${selectedPlan.price}.00`
                                                )}
                                            </Button>
                                        </form>
                                    </TabsContent>

                                    {/* PayPal Payment */}
                                    <TabsContent value="PAYPAL">
                                        <div className="space-y-6">
                                            <div className="text-center py-8">
                                                <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                                                    <svg className="h-10 w-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c2.347 0 4.203.645 5.072 1.765.78.998.96 2.253.537 3.735-.015.053-.029.104-.045.158-.495 1.667-1.453 2.817-2.844 3.42-1.338.58-3.064.87-5.13.87H9.68a.77.77 0 0 0-.76.653l-.52 3.283-.024.13-.92 5.822a.641.641 0 0 1-.633.74h-.747z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">Pay with PayPal</h3>
                                                <p className="text-muted-foreground text-sm mb-6">
                                                    You'll be redirected to PayPal to complete your payment securely
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>PayPal Email</Label>
                                                <Input
                                                    id="paypalEmail"
                                                    type="email"
                                                    placeholder="your-email@example.com"
                                                    required
                                                    className="h-12 rounded-xl"
                                                />
                                            </div>

                                            <Button
                                                onClick={handlePayPalPayment}
                                                className="w-full h-12 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <span className="flex items-center gap-2">
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Connecting...
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2">
                                                        Continue with PayPal
                                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c2.347 0 4.203.645 5.072 1.765.78.998.96 2.253.537 3.735-.015.053-.029.104-.045.158-.495 1.667-1.453 2.817-2.844 3.42-1.338.58-3.064.87-5.13.87H9.68a.77.77 0 0 0-.76.653l-.52 3.283-.024.13-.92 5.822a.641.641 0 0 1-.633.74h-.747z" />
                                                        </svg>
                                                    </span>
                                                )}
                                            </Button>
                                        </div>
                                    </TabsContent>

                                    {/* KHQR Payment */}
                                    <TabsContent value="KHQR">
                                        <div className="space-y-6">
                                            <div className="text-center py-8">
                                                <div className="mx-auto w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                                                    <QrCode className="h-10 w-10 text-purple-600" />
                                                </div>
                                                <h3 className="text-xl font-semibold mb-2">Pay with KHQR</h3>
                                                <p className="text-muted-foreground text-sm mb-6">
                                                    Scan the QR code with your banking app to complete payment
                                                </p>
                                            </div>

                                            {khqrData ? (
                                                <div className="space-y-4">
                                                    <div className="bg-white p-6 rounded-2xl border-2 border-purple-200 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                                                                <QrCode className="h-32 w-32 text-gray-400" />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Amount: <span className="font-bold text-foreground">${selectedPlan.price}.00</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl">
                                                        <Smartphone className="h-4 w-4 text-purple-600" />
                                                        <p>Open your banking app and scan the QR code above</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label>Phone Number</Label>
                                                        <Input
                                                            id="khqrPhone"
                                                            type="tel"
                                                            placeholder="+855 12 345 678"
                                                            required
                                                            className="h-12 rounded-xl"
                                                        />
                                                    </div>

                                                    <Button
                                                        onClick={handleKHQRPayment}
                                                        className="w-full h-12 text-lg font-semibold rounded-xl bg-purple-600 hover:bg-purple-700"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <span className="flex items-center gap-2">
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                Generating QR Code...
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-2">
                                                                Generate KHQR Code
                                                                <QrCode className="h-5 w-5" />
                                                            </span>
                                                        )}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
