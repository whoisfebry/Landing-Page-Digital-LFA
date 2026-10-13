import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function Hero() {
    return (
        <section
            id="home"
            className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-[#1b2d43] lg:min-h-[max(745px,100svh)]"
        >
            {/* Background Image */}
            <img
                src="/images/people.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />

            {/* Overlay */}
            <div
                className="absolute inset-0 -z-10 bg-gradient-to-r from-[#14253a]/90 via-[#192d44]/65 to-[#192d44]/25"
                aria-hidden="true"
            />

            <div
                className="absolute inset-0 -z-10 bg-[#243b55]/15"
                aria-hidden="true"
            />

            {/* Hero Content */}
            <div className="mx-auto flex w-full max-w-[1440px] items-center px-5 py-28 sm:px-8 sm:py-32 md:px-10 lg:px-16 lg:py-24 xl:px-20">
                <div className="w-full max-w-[580px]">
                    {/* Label */}
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 backdrop-blur-md sm:mb-6">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        <span className="text-[11px] font-medium tracking-wide text-white/90 sm:text-xs">
                            Informasi publik
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.045em] text-white">
                        Digital LFA
                    </h1>

                    {/* Program Identity */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-xs sm:gap-3 sm:text-sm">
                        <span className="font-semibold text-red-500">
                            SKK Migas
                        </span>

                        <span className="h-3.5 w-px shrink-0 bg-white/35" />

                        <span className="text-white/75">
                            Program Pengembangan Masyarakat
                        </span>
                    </div>

                    {/* Headline */}
                    <h2 className="mt-6 max-w-[510px] text-[clamp(1.125rem,2.5vw,1.75rem)] font-bold leading-snug tracking-[-0.025em] text-white sm:mt-8">
                        Pengelolaan Program yang Terstruktur dan Transparan.
                    </h2>

                    {/* Description */}
                    <p className="mt-4 max-w-[490px] text-sm leading-6 text-white/75 sm:text-[15px] sm:leading-7">
                        Digital LFA mendukung pencatatan dan penelusuran
                        informasi program Pengembangan Masyarakat secara
                        sistematis, mulai dari perencanaan hingga evaluasi.
                    </p>

                    {/* Action Buttons */}
                    <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                        <Link
                            href="#tentang"
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-400/40 bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-950/20 transition-colors duration-200 hover:border-red-300 hover:bg-red-700 active:bg-red-800 sm:w-auto"
                        >
                            Pelajari Digital LFA
                        </Link>

                        <a
                            href="https://www.skkmigas.go.id/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/15 sm:w-auto"
                        >
                            Kunjungi SKK Migas
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}