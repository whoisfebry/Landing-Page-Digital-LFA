"use client";

import {
    motion,
    AnimatePresence,
    useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
    const [loading, setLoading] = useState(true);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        const handleLoad = () => {
            timeoutId = setTimeout(() => {
                setLoading(false);
            }, 3000);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad, {
                once: true,
            });
        }

        return () => {
            window.removeEventListener("load", handleLoad);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <AnimatePresence
            onExitComplete={() => {
                window.dispatchEvent(new Event("preloaderComplete"));
            }}
        >
            {loading && (
                <motion.div
                    className="preloader fixed inset-0 z-[9999] flex items-center justify-center bg-[#1b2d43]"
                    initial={{ opacity: 1 }}
                    exit={
                        reduceMotion
                            ? { opacity: 0 }
                            : {
                                  opacity: 0,
                                  scale: 1.05,
                                  transition: {
                                      duration: 0.4,
                                      ease: "easeInOut",
                                  },
                              }
                    }
                >
                    <div className="flex flex-col items-center">
                        {/* Ring animasi */}
                        <div className="loader-wrapper relative flex h-40 w-40 items-center justify-center sm:h-48 sm:w-48">
                            {/* Ring merah */}
                            <motion.svg
                                className="svg-ring absolute inset-0 h-full w-full"
                                viewBox="0 0 220 220"
                                animate={
                                    reduceMotion
                                        ? undefined
                                        : {
                                              rotate: [
                                                  0, 180, 90, 360, 180, 540,
                                              ],
                                          }
                                }
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <circle
                                    cx="110"
                                    cy="110"
                                    r="101"
                                    fill="none"
                                    stroke="#dc2626"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeDasharray="170 390"
                                    transform="rotate(-70 110 110)"
                                />
                            </motion.svg>

                            {/* Ring merah muda */}
                            <motion.svg
                                className="svg-ring absolute inset-0 h-full w-full"
                                viewBox="0 0 220 220"
                                animate={
                                    reduceMotion
                                        ? undefined
                                        : {
                                              rotate: [
                                                  0, -120, -300, -180, -450,
                                              ],
                                          }
                                }
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <circle
                                    cx="110"
                                    cy="110"
                                    r="86"
                                    fill="none"
                                    stroke="#f87171"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeDasharray="140 330"
                                    transform="rotate(110 110 110)"
                                />
                            </motion.svg>

                            {/* Ring putih */}
                            <motion.svg
                                className="svg-ring absolute inset-0 h-full w-full"
                                viewBox="0 0 220 220"
                                animate={
                                    reduceMotion
                                        ? undefined
                                        : {
                                              rotate: [
                                                  0, 90, 270, 180, 360,
                                              ],
                                          }
                                }
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <circle
                                    cx="110"
                                    cy="110"
                                    r="71"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeOpacity="0.65"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeDasharray="115 250"
                                    transform="rotate(200 110 110)"
                                />
                            </motion.svg>

                            {/* Logo di tengah */}
                            <motion.div
                                className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg shadow-black/10 sm:h-18 sm:w-18"
                                animate={
                                    reduceMotion
                                        ? undefined
                                        : {
                                              scale: [1, 1.05, 1],
                                              opacity: [1, 0.9, 1],
                                          }
                                }
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Image
    src="/images/logo1.png"
    alt="Logo Digital LFA"
    width={64}
    height={64}
    priority
    className="h-10 w-10 object-contain sm:h-12 sm:w-12"
/>
                            </motion.div>
                        </div>

                        {/* Nama dan deskripsi */}
                        <motion.div
                            initial={
                                reduceMotion
                                    ? false
                                    : { opacity: 0, y: 8 }
                            }
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: 0.15,
                            }}
                            className="mt-7 text-center"
                        >
                            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                                Digital LFA
                            </h2>

                            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-white/60 sm:text-xs">
                                Program Pengembangan Masyarakat
                            </p>
                        </motion.div>

                        {/* Progress bar */}
                        <div
                            className="mt-7 h-1 w-32 overflow-hidden rounded-full bg-white/15"
                            aria-label="Memuat halaman"
                            role="progressbar"
                        >
                            <motion.div
                                className="h-full rounded-full bg-red-600"
                                initial={{ width: "0%" }}
                                animate={
                                    reduceMotion
                                        ? { width: "100%" }
                                        : {
                                              width: [
                                                  "0%",
                                                  "75%",
                                                  "90%",
                                              ],
                                          }
                                }
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut",
                                }}
                            />
                        </div>

                        <p className="mt-3 text-xs text-white/50">
                            Menyiapkan halaman...
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}