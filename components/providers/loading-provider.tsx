"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { loadingStore } from "@/lib/loading-store"

interface LoadingContextType {
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
    startLoading: () => void
    stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(loadingStore.getState())

    useEffect(() => {
        const unsubscribe = loadingStore.subscribe((state: boolean) => {
            setIsLoading(state)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    const setIsLoadingState = (loading: boolean) => loadingStore.setIsLoading(loading)
    const startLoading = () => loadingStore.setIsLoading(true)
    const stopLoading = () => loadingStore.setIsLoading(false)

    return (
        <LoadingContext.Provider value={{
            isLoading,
            setIsLoading: setIsLoadingState,
            startLoading,
            stopLoading
        }}>
            {children}
            <GlobalLoader show={isLoading} />
        </LoadingContext.Provider>
    )
}




export function useLoading() {
    const context = useContext(LoadingContext)
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider")
    }
    return context
}

function GlobalLoader({ show }: { show: boolean }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    data-testid="global-loader"
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative flex items-center justify-center">
                            {/* Spinning outer ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 border-t-2 border-r-2 border-primary rounded-full absolute shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                            />

                            {/* Pulsing inner glow */}
                            <motion.div
                                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="w-16 h-16 bg-primary/20 rounded-full absolute blur-xl"
                            />

                            {/* Central morphing shape */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 90, 180, 270, 360],
                                    borderRadius: ["30%", "50%", "30%"],
                                }}
                                transition={{
                                    duration: 4,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                                className="w-12 h-12 bg-primary shadow-[0_0_30px_rgba(var(--primary),0.6)]"
                            />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-primary font-bold tracking-[0.3em] uppercase text-xs"
                            >
                                Processing
                            </motion.p>
                            <motion.div
                                className="flex gap-1"
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 h-1 bg-primary rounded-full"
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
