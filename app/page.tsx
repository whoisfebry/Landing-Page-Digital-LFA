"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Tentang from "@/components/Tentang";
import Tujuan from "@/components/Tujuan";
import Untuksiapa from "@/components/Untuksiapa";
import Manfaat from "@/components/Manfaat";
import Pengelola from "@/components/Pengelola";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import Preloader from "@/components/Preloader";

export default function Home() {
    return (
        <main>
            <Preloader />
            <Navbar />
            <Hero />
            <Tentang />
            <Tujuan />
            <Untuksiapa />
            <Manfaat />
            <Pengelola />
            <Footer />
            <AIChatbot />
        </main>
    );
}