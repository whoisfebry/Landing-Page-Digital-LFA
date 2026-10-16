"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    BarChart3,
    ChevronDown,
    Database,
    Droplets,
    Factory,
    Info,
    Landmark,
    MapPinned,
    TrendingUp,
} from "lucide-react";

type IndicatorId =
    | "wilayah"
    | "minyak"
    | "gas"
    | "minyak-gas"
    | "investasi";

type ChartPoint = {
    label: string;
    value: number;
};

type Indicator = {
    id: IndicatorId;
    label: string;
    description: string;
    unit: string;
    icon: typeof MapPinned;
    formatValue: (value: number) => string;
    data: ChartPoint[];
    sourceNote: string;
    isPlaceholder: boolean;
    yAxisTicks: number[];
    yAxisMax: number;
    yAxisUnit: string;
};

const numberFormatter = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
});

const formatNumber = (value: number) => numberFormatter.format(value);

const formatProduction = (value: number) => formatNumber(value);

const indicators: Indicator[] = [
    {
        id: "wilayah",
        label: "Wilayah Kerja",
        description: "Cakupan wilayah kerja hulu migas",
        unit: "wilayah",
        icon: MapPinned,
        formatValue: (value) =>
            `${new Intl.NumberFormat("id-ID").format(value)} wilayah`,
        data: [
            { label: "Jan", value: 159 },
            { label: "Feb", value: 159 },
            { label: "Mar", value: 158 },
            { label: "Apr", value: 157 },
            { label: "Mei", value: 158 },
            { label: "Jun", value: 167 },
            { label: "Jul", value: 165 },
            { label: "Agu", value: 165 },
        ],
        yAxisTicks: [50, 100, 150, 200],
        yAxisMax: 200,
        yAxisUnit: "Wilayah kerja",
        sourceNote:
            "Angka dimasukkan berdasarkan grafik referensi yang diberikan. Periode dan satuan perlu diverifikasi dengan publikasi resmi SKK Migas sebelum dipublikasikan.",
        isPlaceholder: false,
    },
    {
        id: "minyak",
        label: "Produksi Minyak (Termasuk NGL)",
        description: "Produksi minyak termasuk Natural Gas Liquids (NGL)",
        unit: "MBOPD",
        icon: Droplets,
        formatValue: (value) => formatProduction(value),
        data: [
            { label: "Jan", value: 530.2 },
            { label: "Feb", value: 591.5 },
            { label: "Mar", value: 599.9 },
            { label: "Apr", value: 586.5 },
            { label: "Mei", value: 577.9 },
            { label: "Jun", value: 580.7 },
            { label: "Jul", value: 580 },
            { label: "Agu", value: 580.8 },
        ],
        yAxisTicks: [100, 200, 300, 400, 500, 600],
        yAxisMax: 600,
        yAxisUnit: "MBOPD",
        sourceNote:
            "Angka dimasukkan berdasarkan grafik referensi yang diberikan. Periode dan satuan perlu diverifikasi dengan publikasi resmi SKK Migas sebelum dipublikasikan.",
        isPlaceholder: false,
    },
    {
        id: "gas",
        label: "Produksi Gas Bumi (Tidak Termasuk NGL)",
        description: "Produksi gas bumi tidak termasuk Natural Gas Liquids (NGL)",
        unit: "MMSCFD",
        icon: Factory,
        formatValue: (value) => formatProduction(value),
        data: [
            { label: "Jan", value: 6458 },
            { label: "Feb", value: 6681 },
            { label: "Mar", value: 6675 },
            { label: "Apr", value: 6802 },
            { label: "Mei", value: 6179 },
            { label: "Jun", value: 6273 },
            { label: "Jul", value: 6804 },
            { label: "Agu", value: 6680 },
        ],
        yAxisTicks: [2000, 4000, 6000, 8000],
        yAxisMax: 8000,
        yAxisUnit: "MMSCFD",
        sourceNote:
            "Angka dimasukkan berdasarkan grafik referensi yang diberikan. Periode dan satuan perlu diverifikasi dengan publikasi resmi SKK Migas sebelum dipublikasikan.",
        isPlaceholder: false,
    },
    {
        id: "minyak-gas",
        label: "Produksi Minyak & Gas Bumi",
        description: "Ringkasan produksi minyak dan gas bumi",
        unit: "MBOEPD",
        icon: Factory,
        formatValue: (value) => formatProduction(value),
        data: [
            { label: "Jan", value: 1667 },
            { label: "Feb", value: 1769 },
            { label: "Mar", value: 1768 },
            { label: "Apr", value: 1778 },
            { label: "Mei", value: 1657 },
            { label: "Jun", value: 1677 },
            { label: "Jul", value: 1770.1 },
            { label: "Agu", value: 1749 },
        ],
        yAxisTicks: [500, 1000, 1500, 2000],
        yAxisMax: 2000,
        yAxisUnit: "MBOEPD",
        sourceNote:
            "Angka dimasukkan berdasarkan grafik referensi yang diberikan. Periode dan satuan perlu diverifikasi dengan publikasi resmi SKK Migas sebelum dipublikasikan.",
        isPlaceholder: false,
    },
    {
        id: "investasi",
        label: "Investasi Hulu Migas",
        description: "Nilai investasi sektor hulu migas",
        unit: "Miliar USD",
        icon: TrendingUp,
        formatValue: (value) => `${formatNumber(value)} Miliar USD`,
        data: [
            { label: "Jan", value: 1.1 },
            { label: "Feb", value: 1.22 },
            { label: "Mar", value: 1.31 },
            { label: "Apr", value: 0.97 },
            { label: "Mei", value: 1.0 },
            { label: "Jun", value: 1.34 },
            { label: "Jul", value: 1.57 },
            { label: "Agu", value: 0.4 },
        ],
        yAxisTicks: [0.5, 1, 1.5, 2],
        yAxisMax: 2,
        yAxisUnit: "Miliar USD",
        sourceNote:
            "Angka dimasukkan berdasarkan grafik referensi yang diberikan. Periode dan satuan perlu diverifikasi dengan publikasi resmi SKK Migas sebelum dipublikasikan.",
        isPlaceholder: false,
    },
];

const years = ["2026", "2025", "2024"];

function formatAxisTick(value: number, indicatorId: IndicatorId) {
    if (indicatorId === "investasi") {
        return `${formatNumber(value)} Miliar USD`;
    }

    if (indicatorId === "wilayah") {
        return `${formatNumber(value)} Wilayah kerja`;
    }

    const indicator = indicators.find((item) => item.id === indicatorId);
    return `${formatNumber(value)} ${indicator?.yAxisUnit ?? ""}`;
}

export default function Statistik() {
    const [openDropdown, setOpenDropdown] =
        useState<"indikator" | "tahun" | null>(null);

    const [selectedId, setSelectedId] =
        useState<IndicatorId | "none">("none");

    const [selectedYear, setSelectedYear] = useState("2026");
    const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
    const reduceMotion = useReducedMotion();

    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.15 },
                transition: {
                    duration: 0.5,
                    delay,
                    ease: "easeOut" as const,
                },
            };

    const selectedIndicator = useMemo(
        () => indicators.find((item) => item.id === selectedId),
        [selectedId],
    );

    const chartData =
        selectedYear === "2026" ? selectedIndicator?.data ?? [] : [];

    const maxValue = Math.max(0, ...chartData.map((point) => point.value));
    const hasData = chartData.length > 0 && maxValue > 0;

    const handlePointClick = (label: string) => {
        setSelectedPoint((current) => (current === label ? null : label));
    };

    return (
        <main className="relative isolate overflow-hidden bg-white">
            <section
                id="statistik"
                aria-labelledby="statistik-title"
                className="relative mb-25 scroll-mt-15 px-0 py-0 sm:scroll-mt-28 lg:scroll-mt-32"
            >
                <div className="relative w-full overflow-hidden rounded-[28px] bg-slate-100 px-5 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 lg:rounded-[44px] lg:px-12 lg:py-12">
                    <div className="mx-auto w-full max-w-7xl">
                        {/* HEADER */}
                        <motion.div
                            {...reveal(0)}
                            className="mx-auto mb-6 max-w-2xl text-center sm:mb-7"
                        >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                                Ringkasan Capaian
                            </p>

                            <h2
                                id="statistik-title"
                                className="mt-3 text-[clamp(1.6rem,1.6vw,1.3rem)] font-bold leading-[1.4] tracking-[-0.03em] text-slate-900"
                            >
                                Statistik Hulu Migas
                            </h2>

                            <p className="mx-auto mt-2 max-w-none whitespace-nowrap text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                                Jelajahi indikator capaian sektor hulu migas berdasarkan kategori dan periode yang tersedia.
                            </p>
                        </motion.div>

                        {/* MAIN PANEL */}
                        <motion.div
                            {...reveal(0.08)}
                            className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                        >
                            {/* FILTER HEADER */}
                            <div className="border-b border-slate-100 p-4 sm:p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 sm:text-sm">
                                            <Database size={15} className="text-red-600" />
                                            Eksplorasi Data
                                        </div>

                                        <p className="mt-1 text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                                            Pilih indikator untuk melihat visualisasi datanya.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[380px]">
                                        {/* DROPDOWN INDIKATOR */}
<div className="min-w-0">
    <label
        htmlFor="statistik-indikator"
        className="mb-1.5 block text-[10px] font-semibold text-slate-700 sm:text-[11px]"
    >
        Indikator
    </label>

    <div className="relative">
        <button
            id="statistik-indikator"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openDropdown === "indikator"}
            onClick={() =>
                setOpenDropdown((current) =>
                    current === "indikator" ? null : "indikator",
                )
            }
            className={`flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3 text-xs outline-none transition ${
                openDropdown === "indikator"
                    ? "border-red-500 ring-2 ring-red-500/10"
                    : "border-slate-200 hover:border-red-300"
            }`}
        >
            <span
                className={
                    selectedId === "none"
                        ? "truncate text-slate-400"
                        : "truncate text-slate-800"
                }
            >
                {selectedId === "none"
                    ? "Pilih Indikator"
                    : indicators.find((item) => item.id === selectedId)?.label}
            </span>

            <ChevronDown
                size={14}
                className={`shrink-0 text-red-500 transition-transform ${
                    openDropdown === "indikator" ? "rotate-180" : ""
                }`}
            />
        </button>

        {openDropdown === "indikator" && (
            <>
                <button
                    type="button"
                    aria-label="Tutup pilihan indikator"
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setOpenDropdown(null)}
                />

                <div
                    role="listbox"
                    aria-labelledby="statistik-indikator"
                    className="absolute left-0 top-full z-30 mt-1.5 max-h-56 w-full min-w-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10"
                >
                    <button
                        type="button"
                        role="option"
                        aria-selected={selectedId === "none"}
                        onClick={() => {
                            setSelectedId("none");
                            setSelectedPoint(null);
                            setOpenDropdown(null);
                        }}
                        className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition ${
                            selectedId === "none"
                                ? "bg-red-50 font-semibold text-red-600"
                                : "text-slate-700 hover:bg-red-50 hover:text-red-600"
                        }`}
                    >
                        Pilih Indikator
                    </button>

                    {indicators.map((item) => {
                        const isSelected = selectedId === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    setSelectedId(item.id);
                                    setSelectedPoint(null);
                                    setOpenDropdown(null);
                                }}
                                className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition ${
                                    isSelected
                                        ? "bg-red-50 font-semibold text-red-600"
                                        : "text-slate-700 hover:bg-red-50 hover:text-red-600"
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </>
        )}
    </div>
</div>

{/* DROPDOWN TAHUN */}
<div className="min-w-0">
    <label
        htmlFor="statistik-tahun"
        className="mb-1.5 block text-[10px] font-semibold text-slate-700 sm:text-[11px]"
    >
        Tahun
    </label>

    <div className="relative">
        <button
            id="statistik-tahun"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openDropdown === "tahun"}
            onClick={() =>
                setOpenDropdown((current) =>
                    current === "tahun" ? null : "tahun",
                )
            }
            className={`flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3 text-xs outline-none transition ${
                openDropdown === "tahun"
                    ? "border-red-500 ring-2 ring-red-500/10"
                    : "border-slate-200 hover:border-red-300"
            }`}
        >
            <span className="truncate text-slate-800">
                {selectedYear}
            </span>

            <ChevronDown
                size={14}
                className={`shrink-0 text-red-500 transition-transform ${
                    openDropdown === "tahun" ? "rotate-180" : ""
                }`}
            />
        </button>

        {openDropdown === "tahun" && (
            <>
                <button
                    type="button"
                    aria-label="Tutup pilihan tahun"
                    className="fixed inset-0 z-20 cursor-default"
                    onClick={() => setOpenDropdown(null)}
                />

                <div
                    role="listbox"
                    aria-labelledby="statistik-tahun"
                    className="absolute left-0 top-full z-30 mt-1.5 max-h-56 w-full min-w-0 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10"
                >
                    {years.map((year) => {
                        const isSelected = selectedYear === year;

                        return (
                            <button
                                key={year}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                    setSelectedYear(year);
                                    setSelectedPoint(null);
                                    setOpenDropdown(null);
                                }}
                                className={`w-full rounded-lg px-2.5 py-2 text-left text-xs transition ${
                                    isSelected
                                        ? "bg-red-50 font-semibold text-red-600"
                                        : "text-slate-700 hover:bg-red-50 hover:text-red-600"
                                }`}
                            >
                                {year}
                            </button>
                        );
                    })}
                </div>
            </>
        )}
    </div>
</div>
                                    </div>
                                </div>
                            </div>

                            {/* CHART AREA */}
                            <div className="p-4 sm:p-5">
                                <AnimatePresence mode="wait" initial={false}>
                                    {selectedId === "none" ? (
                                        <motion.div
                                            key="empty"
                                            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center sm:min-h-[220px]"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm">
                                                <BarChart3 size={20} />
                                            </div>

                                            <h3 className="mt-3 text-xs font-semibold text-slate-800 sm:text-sm">
                                                Belum ada indikator dipilih
                                            </h3>

                                            <p className="mt-1.5 max-w-sm text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                                                Pilih indikator melalui dropdown di atas untuk menampilkan grafik dan nilai statistiknya.
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={`${selectedId}-${selectedYear}`}
                                            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.22 }}
                                        >
                                            {/* CHART TITLE */}
                                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex min-w-0 items-center gap-2.5">
                                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                                        {selectedIndicator &&
                                                            (() => {
                                                                const Icon = selectedIndicator.icon;
                                                                return <Icon size={17} />;
                                                            })()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="text-xs font-bold text-slate-900 sm:text-sm">
                                                            {selectedIndicator?.label}
                                                        </h3>

                                                        <p className="mt-0.5 text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                                                            {selectedIndicator?.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="w-fit rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 sm:text-[11px]">
                                                    Periode {selectedYear}
                                                </span>
                                            </div>

                                            {hasData && selectedIndicator ? (
                                                <>
                                                    {/* VERTICAL BAR CHART */}
                                                    <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:p-4">
                                                        <div className="relative h-[250px] sm:h-[290px] lg:h-[310px]">
                                                            {/*
                                                                Area label Y dibuat lebih ramping
                                                                agar ruang kiri dan kanan lebih seimbang.
                                                            */}
                                                            <div className="absolute bottom-7 left-0 top-4 w-[104px] sm:w-[124px]">
                                                                {selectedIndicator.yAxisTicks.map((tick) => (
                                                                    <div
                                                                        key={tick}
                                                                        className="absolute right-2 -translate-y-1/2 whitespace-nowrap text-right text-[8px] font-medium tabular-nums text-slate-500 sm:text-[10px]"
                                                                        style={{
                                                                            bottom: `calc(${(tick / selectedIndicator.yAxisMax) * 100}% - 6px)`,
                                                                        }}
                                                                    >
                                                                        {formatAxisTick(tick, selectedIndicator.id)}
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {/*
                                                                Area plot dimulai lebih dekat ke label Y,
                                                                sehingga tidak ada ruang kosong berlebihan.
                                                            */}
                                                            <div className="absolute inset-y-0 left-[108px] right-1 sm:left-[130px] sm:right-2">
                                                                {/* GRID LINES */}
                                                                <div className="pointer-events-none absolute inset-x-0 bottom-7 top-4 flex flex-col justify-between">
                                                                    {[4, 3, 2, 1, 0].map((tick) => (
                                                                        <div
                                                                            key={tick}
                                                                            className="border-t border-dashed border-slate-200"
                                                                        />
                                                                    ))}
                                                                </div>

                                                                {/* BARS */}
                                                                <div className="absolute inset-x-0 bottom-7 top-4 flex items-stretch justify-around gap-2 px-1 sm:gap-4 sm:px-2">
                                                                    {chartData.map((point, index) => {
                                                                        const height = Math.min(
                                                                            (point.value / selectedIndicator.yAxisMax) * 100,
                                                                            100,
                                                                        );

                                                                        const isSelected =
                                                                            selectedPoint === point.label;

                                                                        const hasSelection =
                                                                            selectedPoint !== null;

                                                                        return (
                                                                            <div
                                                                                key={point.label}
                                                                                className="group relative flex min-w-0 max-w-16 flex-1 cursor-pointer flex-col items-center justify-end sm:max-w-20"
                                                                            >
                                                                                <span
                                                                                    className={`mb-1.5 whitespace-nowrap text-[8px] font-semibold tabular-nums transition-colors duration-200 sm:text-[10px] ${isSelected
                                                                                            ? "text-red-700"
                                                                                            : hasSelection
                                                                                                ? "text-slate-300"
                                                                                                : "text-slate-700"
                                                                                        }`}
                                                                                >
                                                                                    {formatNumber(point.value)}
                                                                                </span>

                                                                                <motion.button
                                                                                    type="button"
                                                                                    initial={
                                                                                        reduceMotion ? false : { height: 0 }
                                                                                    }
                                                                                    animate={{
                                                                                        height: `${height}%`,
                                                                                    }}
                                                                                    transition={{
                                                                                        height: {
                                                                                            duration: reduceMotion ? 0 : 0.5,
                                                                                            delay: reduceMotion ? 0 : index * 0.04,
                                                                                            ease: "easeOut",
                                                                                        },
                                                                                        backgroundColor: { duration: 0.2 },
                                                                                        opacity: { duration: 0.2 },
                                                                                    }}
                                                                                    onClick={() =>
                                                                                        handlePointClick(point.label)
                                                                                    }
                                                                                    aria-label={`${point.label}, nilai ${selectedIndicator.formatValue(point.value)}`}
                                                                                    aria-pressed={isSelected}
                                                                                    className={`relative w-full cursor-pointer overflow-hidden rounded-t-sm outline-none transition-[background-color,opacity,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${isSelected
                                                                                            ? "z-10 bg-red-700 opacity-100 shadow-[0_3px_12px_rgba(185,28,28,0.25)]"
                                                                                            : hasSelection
                                                                                                ? "bg-red-500 opacity-20 hover:!bg-red-400 hover:!opacity-60"
                                                                                                : "bg-red-500 opacity-100 hover:!bg-red-600"
                                                                                        }`}
                                                                                    style={{ minHeight: "3px" }}
                                                                                >
                                                                                    <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-white/40" />
                                                                                </motion.button>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                {/* X AXIS LABELS */}
                                                                <div className="absolute inset-x-0 bottom-0 flex justify-around gap-2 px-1 sm:gap-4 sm:px-2">
                                                                    {chartData.map((point) => {
                                                                        const isSelected =
                                                                            selectedPoint === point.label;

                                                                        const hasSelection =
                                                                            selectedPoint !== null;

                                                                        return (
                                                                            <button
                                                                                key={point.label}
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handlePointClick(point.label)
                                                                                }
                                                                                className={`min-w-0 max-w-16 flex-1 cursor-pointer truncate text-center text-[9px] font-medium transition-colors duration-200 sm:max-w-20 sm:text-[11px] ${isSelected
                                                                                        ? "font-bold text-red-700"
                                                                                        : hasSelection
                                                                                            ? "text-slate-300 hover:text-red-500"
                                                                                            : "text-slate-500 hover:text-red-600"
                                                                                    }`}
                                                                                aria-pressed={isSelected}
                                                                            >
                                                                                {point.label}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* SELECTED BAR DETAIL */}
                                                    <AnimatePresence mode="wait">
                                                        {selectedPoint && (
                                                            <motion.div
                                                                key={selectedPoint}
                                                                initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: -5 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50/70 p-3"
                                                            >
                                                                <div>
                                                                    <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
                                                                        Periode dipilih
                                                                    </p>
                                                                    <p className="mt-0.5 text-xs font-bold text-red-700 sm:text-sm">
                                                                        {selectedPoint} {selectedYear}
                                                                    </p>
                                                                </div>

                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
                                                                        Nilai
                                                                    </p>
                                                                    <p className="mt-0.5 text-sm font-bold text-red-700 sm:text-base">
                                                                        {selectedIndicator.formatValue(
                                                                            chartData.find(
                                                                                (point) => point.label === selectedPoint,
                                                                            )?.value ?? 0,
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* SUMMARY */}
                                                    <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                                        <div className="rounded-lg border border-slate-100 bg-white p-3">
                                                            <p className="text-[10px] text-slate-500 sm:text-[11px]">
                                                                Nilai tertinggi pada grafik
                                                            </p>

                                                            <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                                                                {selectedIndicator.formatValue(maxValue)}
                                                            </p>
                                                        </div>

                                                        <div className="rounded-lg border border-slate-100 bg-white p-3">
                                                            <p className="text-[10px] text-slate-500 sm:text-[11px]">
                                                                Jumlah periode ditampilkan
                                                            </p>

                                                            <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                                                                {chartData.length} periode
                                                            </p>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
                                                        <Database size={19} />
                                                    </div>

                                                    <h4 className="mt-3 text-xs font-semibold text-slate-800 sm:text-sm">
                                                        Data belum tersedia
                                                    </h4>

                                                    <p className="mt-1.5 max-w-sm text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                                                        Data {selectedIndicator?.label} untuk tahun{" "}
                                                        {selectedYear} belum dimasukkan. Grafik akan
                                                        muncul setelah data tersedia.
                                                    </p>
                                                </div>
                                            )}

                                            {/* SOURCE NOTE */}
                                            <div className="mt-3 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                                                <Info
                                                    size={14}
                                                    className="mt-0.5 shrink-0 text-slate-400"
                                                />

                                                <p>
                                                    <span className="font-semibold text-slate-700">
                                                        Catatan data:{" "}
                                                    </span>
                                                    {selectedIndicator?.sourceNote}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* FOOTER PANEL */}
                            <div className="flex flex-col gap-1.5 border-t border-slate-100 bg-slate-50/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-[11px]">
                                    <Landmark size={12} className="shrink-0" />
                                    <span>Sumber: SKK Migas</span>
                                </div>

                                <p className="text-[9px] leading-5 text-slate-400 sm:text-right sm:text-[10px]">
                                    Statistik sektor hulu minyak dan gas bumi
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}