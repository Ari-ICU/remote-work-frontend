"use client";

import { motion } from "framer-motion";
import { Star, User as UserIcon } from "lucide-react";
import { Review } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewsListProps {
    reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
    const getAvatarUrl = (path: string | null | undefined) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        return `${baseUrl}${path}`;
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    if (reviews.length === 0) {
        return (
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="h-6 w-6 text-primary" />
                    Reviews
                </h3>
                <p className="text-muted-foreground text-center py-8">
                    No reviews yet
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <Star className="h-6 w-6 text-primary fill-primary" />
                    Reviews ({reviews.length})
                </h3>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                    <span className="text-lg font-bold text-primary">
                        {calculateAverageRating()}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-border/50 pb-6 last:border-0 last:pb-0"
                    >
                        <div className="flex gap-4">
                            <Avatar className="h-12 w-12 border-2 border-primary/10">
                                <AvatarImage
                                    src={getAvatarUrl(review.reviewer?.avatar) || ''}
                                    alt={review.reviewer?.firstName || 'User'}
                                />
                                <AvatarFallback className="bg-primary/5">
                                    <UserIcon className="h-6 w-6 text-primary" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div>
                                        <h4 className="font-semibold text-foreground">
                                            {review.reviewer?.firstName} {review.reviewer?.lastName}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-muted-foreground/30"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {review.comment && (
                                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                        {review.comment}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
