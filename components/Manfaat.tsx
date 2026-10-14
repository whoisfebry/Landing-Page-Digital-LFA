"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import AccordionGallery, {
    type AccordionGalleryItem,
} from "./AccordionGallery";

const benefits = [
    {
        number: "01",
        title: "Dampak yang terukur",
        description:
            "Indikator keberhasilan membantu membandingkan target dengan hasil pelaksanaan program, sehingga pencapaian dan manfaatnya dapat dievaluasi secara lebih jelas.",
    },
    {
        number: "02",
        title: "Akuntabilitas dana",
        description:
            "Informasi anggaran yang direncanakan dan direalisasikan memberikan gambaran penggunaan dana serta mendukung pertanggungjawaban program.",
    },
    {
        number: "03",
        title: "Transparansi pelaksanaan",
        description:
            "Dokumentasi kegiatan dan perkembangan program membantu pihak terkait menelusuri serta memantau pelaksanaan kegiatan.",
    },
];

const programGallery: AccordionGalleryItem[] = [
    {
        image: "/images/hero.webp",
        alt: "Pulau Mandangin, Sampang",
        label: "Permukiman dan armada nelayan",
    },
    {
        image: "/images/umkm.webp",
        alt: "Pulau Mandangin, Sampang",
        label: "Kelompok usaha olahan makanan",
    },
    {
        image: "/images/anjungan.webp",
        alt: "Wilayah kerja hulu migas",
        label: "Anjungan lepas pantai",
    },
];

export default function Manfaat() {
    const reduceMotion = useReducedMotion();

    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.2 },
                  transition: {
                      duration: 0.55,
                      delay,
                      ease: "easeOut" as const,
                  },
              };

    return (
        <main className="relative isolate overflow-hidden bg-white">
            {/* BAGIAN 1: MANFAAT PUBLIK */}
            <section
                id="manfaat"
                aria-labelledby="manfaat-title"
                className="relative scroll-mt-15 px-6 pb-12 pt-16 sm:px-10 sm:pb-16 sm:pt-20 lg:px-16 lg:pb-20 lg:pt-24"
            >
                <div className="mx-auto w-full max-w-7xl">
                    <motion.div
                        {...reveal(0)}
                        className="max-w-2xl"
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                            Manfaat Publik
                        </p>

                        <h2
                            id="manfaat-title"
                            className="mt-4 text-[clamp(1rem,1.6vw,1.3rem)] font-bold leading-[1.4] tracking-[-0.03em] text-black"
                        >
                            Apa artinya bagi masyarakat
                        </h2>
                    </motion.div>

                    {/* Konten utama */}
                    <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
                        {/* Foto */}
                        <motion.figure
                            {...reveal(0.1)}
                            className="group relative mt-8 min-w-0 lg:mt-10"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                                <Image
                                    src="/images/umkm.webp"
                                    alt="Kelompok pelaku usaha UMKM dalam kegiatan pemberdayaan masyarakat"
                                    fill
                                    sizes="(max-width: 1023px) 100vw, 44vw"
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                        Pemberdayaan masyarakat
                                    </span>

                                    <p className="mt-2.5 max-w-xs text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
                                        Mendorong usaha lokal untuk terus berkembang.
                                    </p>
                                </div>
                            </div>

                            <figcaption className="mt-2 flex items-start justify-between gap-3 text-[10px] leading-5 text-slate-400 sm:text-[11px]">
                                <span>
                                    Kelompok usaha olahan makanan,
                                    <br className="sm:hidden" /> Pulau Mandangin, Sampang
                                </span>

                                <span className="shrink-0 font-medium uppercase tracking-[0.12em]">
                                    Dokumentasi
                                </span>
                            </figcaption>
                        </motion.figure>

                        {/* Daftar manfaat */}
                        <div className="mt-5 flex min-w-0 flex-col gap-2.5 lg:mt-18">
                            {benefits.map((benefit, index) => (
                                <motion.article
                                    key={benefit.number}
                                    {...reveal(0.15 + index * 0.1)}
                                    className="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-4 transition-all duration-300 hover:border-red-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)] sm:p-5"
                                >
                                    <div className="flex items-start gap-3.5">
                                        <span className="shrink-0 text-lg font-semibold leading-none tracking-[-0.05em] text-slate-200 transition-colors duration-300 group-hover:text-red-600 sm:text-xl">
                                            {benefit.number}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-bold leading-snug tracking-[-0.02em] text-slate-900 sm:text-base">
                                                {benefit.title}
                                            </h3>

                                            <p className="mt-1.5 text-xs leading-6 text-slate-500 sm:text-[13px] sm:leading-6">
                                                {benefit.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-red-600 transition-all duration-300 group-hover:w-full" />
                                </motion.article>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* BAGIAN 2: JEJAK PROGRAM */}
            <section
                id="jejak-program"
                aria-labelledby="jejak-program-title"
                className="relative isolate scroll-mt-15 overflow-hidden bg-white px-0 py-0 sm:scroll-mt-28 lg:scroll-mt-32"
            >
                {/* Background abu-abu dengan sudut rounded */}
                <div className="relative w-full overflow-hidden rounded-[28px] bg-slate-100 px-5 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 lg:rounded-[44px] lg:px-12 lg:py-12">
                    <div className="mx-auto w-full max-w-7xl">
                        {/* Judul dan keterangan di tengah */}
                        <motion.div
                            {...reveal(0)}
                            className="text-center"
                        >
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                                Jejak Program
                            </p>

                            <h2
                                id="jejak-program-title"
                                className="mt-3 text-[clamp(1rem,1.6vw,1.3rem)] font-bold leading-[1.4] tracking-[-0.03em] text-slate-900"
                            >
                                Tercatat di lapangan, bukan hanya di berkas.
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-[10px] leading-5 text-slate-500 sm:text-[11px]">
                                Dokumentasi kegiatan di wilayah kerja
                            </p>
                        </motion.div>

                        {/* Accordion Gallery ReactBits */}
                        <motion.div
                            {...reveal(0.12)}
                            className="mt-7 sm:mt-9"
                        >
                            <AccordionGallery
                                items={programGallery}
                                defaultIndex={0}
                                expandRatio={0.58}
                                trigger="hover"
                                accentColor="#e0443b"
                                overlayColor="#111b2a"
                                textColor="#ffffff"
                                grayscale
                                showLabels
                                duration={0.6}
                                ease="power3.out"
                                parallax={0.2}
                                tilt={0}
                                stagger={0.06}
                                height={460}
                                gap={10}
                                radius={12}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}