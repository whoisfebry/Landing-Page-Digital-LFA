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
                className="relative scroll-mt-15 px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-16 lg:px-12 lg:pb-16 lg:pt-20"
            >
                <div className="mx-auto w-full max-w-6xl">
                    <motion.div {...reveal(0)} className="max-w-2xl">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                            Manfaat Publik
                        </p>

                        <h2
                            id="manfaat-title"
                            className="mt-3 text-[clamp(1rem,1.6vw,1.3rem)] font-bold leading-[1.4] tracking-[-0.03em] text-black"
                        >
                            Apa artinya bagi masyarakat
                        </h2>
                    </motion.div>

                    {/* Konten utama */}
                    <div className="grid grid-cols-1 items-center gap-5 sm:gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
                        {/* Foto */}
                        <motion.figure
                            {...reveal(0.1)}
                            className="group relative mx-auto mt-5 w-full min-w-0 max-w-[380px] lg:mx-0 lg:mt-7 lg:max-w-none"
                        >
                            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                                <Image
                                    src="/images/umkm.webp"
                                    alt="Kelompok pelaku usaha UMKM dalam kegiatan pemberdayaan masyarakat"
                                    fill
                                    sizes="(max-width: 639px) 90vw, (max-width: 1023px) 70vw, 42vw"
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-md">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                                        Pemberdayaan masyarakat
                                    </span>

                                    <p className="mt-2 max-w-none whitespace-nowrap text-xs font-semibold leading-snug tracking-tight text-white sm:text-sm">
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
                        <div className="flex min-w-0 flex-col gap-2 lg:mt-5 lg:gap-2.5">
                            {benefits.map((benefit, index) => (
                                <motion.article
                                    key={benefit.number}
                                    {...reveal(0.15 + index * 0.1)}
                                    className="group relative overflow-hidden rounded-lg border border-slate-200/80 bg-white p-3.5 transition-all duration-300 hover:border-red-200 hover:shadow-[0_6px_18px_rgba(15,23,42,0.05)] sm:p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="shrink-0 text-base font-semibold leading-none tracking-[-0.05em] text-slate-200 transition-colors duration-300 group-hover:text-red-600 sm:text-lg">
                                            {benefit.number}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-[13px] font-bold leading-snug tracking-[-0.02em] text-slate-900 sm:text-sm">
                                                {benefit.title}
                                            </h3>

                                            <p className="mt-1 text-[11px] leading-[1.7] text-slate-500 sm:text-xs sm:leading-5">
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
                <div className="relative w-full overflow-hidden rounded-[24px] bg-slate-100 px-4 py-6 sm:rounded-[32px] sm:px-7 sm:py-8 lg:rounded-[50px] lg:px-10 lg:py-9">
                    <div className="mx-auto w-full max-w-6xl">
                        {/* Judul dan keterangan */}
                        <motion.div {...reveal(0)} className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600 sm:text-[11px]">
                                Jejak Program
                            </p>

                            <h2
                                id="jejak-program-title"
                                className="mx-auto mt-2 max-w-lg text-base font-bold leading-snug tracking-tight text-slate-900 sm:mt-3 sm:text-lg lg:text-xl"
                            >
                                Tercatat di lapangan, bukan hanya di berkas.
                            </h2>

                            <p className="mx-auto mt-2 max-w-sm text-[10px] leading-5 text-slate-500 sm:text-xs">
                                Dokumentasi kegiatan di wilayah kerja
                            </p>
                        </motion.div>

                        {/* Accordion Gallery */}
                        <motion.div
                            {...reveal(0.12)}
                            className="mx-auto mt-5 w-full max-w-4xl sm:mt-6"
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
                                height={300}
                                gap={7}
                                radius={10}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}