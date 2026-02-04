"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function ComingSoonContent() {
    const searchParams = useSearchParams();
    const feature = searchParams.get("feature") || "This Feature";

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10"
            >
                <Construction className="h-12 w-12 text-primary" />
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
            >
                {feature} is Coming Soon!
            </motion.h1>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8 max-w-lg text-muted-foreground"
            >
                We're working hard to bring you {feature.toLowerCase()}.
                Please check back later for updates as we continue to improve our platform.
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Button asChild size="lg">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </motion.div>
        </div>
    );
}

export default function ComingSoonPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 bg-muted/20">
                <Suspense fallback={<div className="flex justify-center p-20">Loading...</div>}>
                    <ComingSoonContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
