"use client";

import { useEffect, useState } from "react";
import { Briefcase, TrendingUp, DollarSign, Users, Award, BarChart3, HelpCircle } from "lucide-react";
import { salaryGuideService, SalaryGuideData } from "@/lib/services/salary-guide";

const IconMap: { [key: string]: any } = {
    TrendingUp,
    DollarSign,
    Users,
    Award,
    Briefcase,
    BarChart3,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
    const Icon = IconMap[name] || HelpCircle;
    return <Icon className={className} />;
}

export default function SalaryGuidePage() {
    const [data, setData] = useState<SalaryGuideData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await salaryGuideService.getSalaryData();
                setData(result);
            } catch (error) {
                console.error("Failed to fetch salary guide data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const insights = data?.insights || [];
    const salaryData = data?.categories || [];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                                <BarChart3 className="h-8 w-8 text-primary-foreground" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                            Cambodia Salary Guide 2026
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
                            Comprehensive salary insights for remote and freelance positions in Cambodia.
                            Make informed decisions about your career and hiring strategies.
                        </p>
                    </div>
                </div>
            </div>

            {/* Market Insights */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Market Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {insights.map((insight) => {
                        return (
                            <div
                                key={insight.id}
                                className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all"
                            >
                                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${insight.bg} mb-4`}>
                                    <DynamicIcon name={insight.icon} className={`h-6 w-6 ${insight.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{insight.title}</h3>
                                <p className="text-sm text-muted-foreground">{insight.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Salary Tables */}
                <div className="space-y-12">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-3">Salary Ranges by Role</h2>
                        <p className="text-muted-foreground">
                            Monthly salary ranges in USD for remote and freelance positions
                        </p>
                    </div>

                    {salaryData.map((category) => (
                        <div key={category.id} className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <Briefcase className="h-6 w-6 text-primary" />
                                <h3 className="text-2xl font-bold text-foreground">{category.name}</h3>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-border bg-card">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                                Role
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                                Salary Range (USD/month)
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                                                Experience Level
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {category.roles.map((role) => (
                                            <tr key={role.id} className="hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-foreground">
                                                    {role.title}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-primary font-semibold">
                                                    {role.range}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                                    {role.experience}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <div className="mt-16 p-6 rounded-xl border border-border bg-muted/50">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Important Notes</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Salary ranges are estimates based on market research and may vary by company, location, and specific requirements.</li>
                        <li>• Freelance rates may differ from full-time salaries and often depend on project scope and duration.</li>
                        <li>• Additional benefits, bonuses, and equity compensation are not included in these ranges.</li>
                        <li>• Data is updated quarterly to reflect current market conditions.</li>
                        <li>• For the most accurate salary information, we recommend researching specific companies and roles.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
