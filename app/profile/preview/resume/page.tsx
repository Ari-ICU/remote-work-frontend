
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ResumePreview, sampleResumeData } from "@/components/resume-preview";
import { Loader2, Printer, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { User as UserType } from "@/types/user";

export default function ResumePreviewPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const useSample = searchParams.get("sample") === "true";

    useEffect(() => {
        const fetchData = async () => {
            if (useSample) {
                setData(sampleResumeData);
                setIsLoading(false);
                return;
            }

            // Try to get unsaved data from localStorage first
            const unsavedData = localStorage.getItem("resume_preview_data");
            if (unsavedData) {
                setData(JSON.parse(unsavedData));
                setIsLoading(false);
                return;
            }

            // Fallback to API
            try {
                const response = await api.get("/users/profile/me");
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [useSample]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
                <p className="text-muted-foreground">No preview data found.</p>
                <Button onClick={() => window.close()}>Close Window</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white">
            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0 !important;
                    }
                    html, body {
                        width: 210mm;
                        height: auto;
                        margin: 0 !important;
                        padding: 0 !important;
                        background: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Force elements to be visible */
                    body * {
                        visibility: visible;
                    }
                    /* Ensure headers/footers in the browser print dialog are removed */
                    header, footer, nav, .print-hidden {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Control Bar - Hidden when printing */}
            <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-200 print:hidden text-slate-900">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => window.close()} className="rounded-xl">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Edit
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()} className="rounded-xl border-slate-200 hover:bg-slate-50 transition-colors">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => window.print()}
                        className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200 transition-all active:scale-95"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export as PDF
                    </Button>
                </div>
            </div>

            {/* Resume Content */}
            <div className="print:shadow-none print:m-0 print:p-0">
                <ResumePreview data={data} />
            </div>

            <footer className="max-w-5xl mx-auto mt-12 mb-8 text-center text-slate-400 text-xs print:hidden">
                <p>© {new Date().getFullYear()} Freelance Platform. Generated Resume Preview.</p>
            </footer>
        </div>
    );
}
