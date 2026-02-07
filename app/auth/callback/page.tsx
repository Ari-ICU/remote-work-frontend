"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const userStr = searchParams.get("user");

        if (userStr) {
            try {
                // Validate if it's already a JSON string or needs parsing
                const user = decodeURIComponent(userStr);
                localStorage.setItem("user", user);

                // Redirect to profile
                router.push("/profile");
            } catch (error) {
                console.error("Auth callback error:", error);
                router.push("/login?error=callback_failed");
            }
        } else {
            router.push("/login?error=missing_data");
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                <h2 className="text-2xl font-bold">Completing sign in...</h2>
                <p className="text-muted-foreground">Please wait while we finalize your account.</p>
            </div>
        </div>
    );
}
