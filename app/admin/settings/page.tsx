"use client";

import { useState } from "react";
import {
    Save,
    Bell,
    Lock,
    Globe,
    Database,
    Cloud,
    Mail,
    Shield
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettings() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
                <p className="text-gray-400 mt-2">Configure global platform parameters and system preferences.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-gray-900 border-gray-800 p-1">
                    <TabsTrigger value="general" className="data-[state=active]:bg-gray-800">General</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-800">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-gray-800">Security</TabsTrigger>
                    <TabsTrigger value="api" className="data-[state=active]:bg-gray-800">API & Integration</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6 space-y-6">
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe size={20} className="text-primary" />
                                Global Configuration
                            </CardTitle>
                            <CardDescription>Manage your platform's basic identity and presence.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name">Platform Name</Label>
                                    <Input id="site-name" defaultValue="KhmerWork" className="bg-gray-800 border-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="support-email">Support Email</Label>
                                    <Input id="support-email" defaultValue="support@khmerwork.com" className="bg-gray-800 border-gray-700" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maintenance">Maintenance Mode</Label>
                                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                    <div>
                                        <p className="text-sm font-medium">Enable Maintenance Mode</p>
                                        <p className="text-xs text-gray-500">Only administrators will be able to access the platform.</p>
                                    </div>
                                    <Switch id="maintenance" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading} className="bg-primary text-black font-semibold gap-2">
                            <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6 space-y-6">
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell size={20} className="text-primary" />
                                System Notifications
                            </CardTitle>
                            <CardDescription>Choose how you want to be notified about platform events.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { label: "New User Registration", desc: "Notify when a new user joins the platform." },
                                { label: "Job Posting Approval", desc: "Notify when a new job is posted and needs review." },
                                { label: "Payment Successful", desc: "Notify on every successful transaction." },
                                { label: "System Errors", desc: "Immediate notification for critical system failures." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{item.label}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6 space-y-6">
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield size={20} className="text-primary" />
                                Access Control
                            </CardTitle>
                            <CardDescription>Manage security policies and authentication requirements.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Two-Factor Authentication (2FA)</p>
                                        <p className="text-xs text-gray-500">Require 2FA for all administrator accounts.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">Session Timeout</p>
                                        <p className="text-xs text-gray-500">Automatically logout inactive administrators after 30 minutes.</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api" className="mt-6 space-y-6">
                    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Cloud size={20} className="text-primary" />
                                External Integrations
                            </CardTitle>
                            <CardDescription>Configure connection keys for third-party services.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="stripe-key">Stripe API Secret</Label>
                                <Input id="stripe-key" type="password" value="••••••••••••••••" className="bg-gray-800 border-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="openai-key">OpenAI API Key (for AI Match)</Label>
                                <Input id="openai-key" type="password" value="••••••••••••••••" className="bg-gray-800 border-gray-700" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
