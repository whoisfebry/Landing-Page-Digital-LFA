"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

type CapaianItem = {
    label: string;
    value: number;
    decimals?: number;
    suffix?: string;
    unit?: string;
    description?: string;
};

const capaianData: CapaianItem[] = [
    {
        label: "Wilayah Kerja",
        value: 167,
        suffix: " wilayah",
    },
    {
        label: "Produksi Minyak",
        value: 599.9,
        decimals: 1,
        unit: "MBOPD",
        description: "Termasuk NGL",
    },
    {
        label: "Produksi Gas Bumi",
        value: 6804,
        unit: "MMSCFD",
        description: "Tidak termasuk NGL",
    },
    {
        label: "Produksi Minyak & Gas Bumi",
        value: 1778,
        unit: "MBOEPD",
    },
    {
        label: "Investasi Hulu Migas",
        value: 1.57,
        decimals: 2,
        suffix: " Miliar USD",
    },
];

function formatNumber(value: number, decimals = 0) {
    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

function AnimatedNumber({
    value,
    decimals = 0,
    suffix = "",
    unit,
}: {
    value: number;
    decimals?: number;
    suffix?: string;
    unit?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    const isInView = useInView(ref, {
        once: true,
        amount: 0.55,
    });

    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!isInView) return;

        if (prefersReducedMotion) {
            setCount(value);
            return;
        }

        let frameId = 0;
        const duration = 1500;
        const startTime = performance.now();

        const animate = (now: number) => {
            const progress = Math.min(
                (now - startTime) / duration,
                1
            );

            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            setCount(value * easedProgress);

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, [isInView, prefersReducedMotion, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {formatNumber(count, decimals)}
            {suffix}

            {unit && (
                <span className="ml-1 text-[10px] font-semibold tracking-wide text-slate-500 sm:text-[11px]">
                    {unit}
                </span>
            )}
        </span>
    );
}

export default function Capaian() {
    return (
        <section
            aria-label="Ringkasan capaian SKK Migas"
            className="relative z-20 mx-auto -mt-10 w-full max-w-6xl bg-transparent px-4 sm:-mt-12 sm:px-6 lg:-mt-15 lg:px-8"
        >
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm"
            >
                <div className="grid grid-cols-2 divide-x divide-y divide-slate-200/80 sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-5">
                    {capaianData.map((item, index) => (
                        <div
                            key={item.label}
                            className={[
                                "grid grid-rows-[40px_30px_16px] content-center px-3 py-3 sm:grid-rows-[40px_32px_16px] sm:px-4 sm:py-4",
                                index === 4
                                    ? "col-span-2 sm:col-span-1"
                                    : "",
                            ].join(" ")}
                        >
                            <p className="flex items-center text-[11px] font-semibold leading-4 text-slate-500 sm:text-xs sm:leading-5">
                                {item.label}
                            </p>

                            <p className="flex items-center whitespace-nowrap text-lg font-bold leading-tight tracking-tight text-[#b4232f] sm:text-xl lg:text-[1.35rem]">
                                <AnimatedNumber
                                    value={item.value}
                                    decimals={item.decimals}
                                    suffix={item.suffix}
                                    unit={item.unit}
                                />
                            </p>

                            <p className="flex items-center text-[10px] leading-4 text-slate-400 sm:text-[11px]">
                                {item.description ?? ""}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
