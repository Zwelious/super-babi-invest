import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  Cpu,
  Leaf,
  MapPin,
  Sprout,
  BarChart3,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import heroFarm from "@/assets/hero-farm.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const navLinks = [
  { id: "about", en: "About", id_label: "Tentang" },
  { id: "features", en: "Investment", id_label: "Investasi" },
  { id: "location", en: "Location", id_label: "Lokasi" },
  { id: "contact", en: "Contact", id_label: "Kontak" },
];

const Index = () => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: TrendingUp,
      title: t("High Yield Returns", "Hasil Investasi Tinggi"),
      desc: t(
        "Earn estimated 30% annual returns backed by real livestock production cycles.",
        "Raih estimasi pengembalian 30% per tahun yang didukung siklus produksi ternak nyata."
      ),
    },
    {
      icon: BarChart3,
      title: t("Transparent Monitoring", "Monitoring Transparan"),
      desc: t(
        "Track every investment, deposit, and disbursement in real time from your dashboard.",
        "Pantau setiap investasi, setoran, dan pencairan secara real-time dari dasbor Anda."
      ),
    },
    {
      icon: Cpu,
      title: t("Smart Farm Technology", "Teknologi Smart Farm"),
      desc: t(
        "Modern climate control, biosecurity, and data-driven feed management systems.",
        "Kontrol iklim modern, biosekuriti, dan manajemen pakan berbasis data."
      ),
    },
    {
      icon: Leaf,
      title: t("Sustainable Practices", "Praktik Berkelanjutan"),
      desc: t(
        "Eco-friendly waste management and ethical livestock standards across the facility.",
        "Manajemen limbah ramah lingkungan dan standar peternakan etis di seluruh fasilitas."
      ),
    },
    {
      icon: ShieldCheck,
      title: t("Secured Assets", "Aset Terjamin"),
      desc: t(
        "Investments are tied to traceable livestock with full operational accountability.",
        "Investasi terikat pada ternak yang dapat ditelusuri dengan akuntabilitas penuh."
      ),
    },
    {
      icon: Sprout,
      title: t("Scalable Capacity", "Kapasitas Skalabel"),
      desc: t(
        "A facility built to house up to 1,000 livestock with room for staged growth.",
        "Fasilitas dirancang menampung hingga 1.000 ternak dengan ruang pertumbuhan bertahap."
      ),
    },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Nav */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-left leading-tight">
              <p className="font-display text-base md:text-lg font-bold text-foreground">
                Indopok
              </p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Rumah Ternak
              </p>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {t(link.en, link.id_label)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
              <Link to="/superbabi">
                <span className="hidden sm:inline">Super Babi Investment</span>
                <span className="sm:hidden">Invest</span>
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroFarm}
            alt={t(
              "Modern Indopok pig farming facility in Getasan, Central Java",
              "Fasilitas peternakan babi modern Indopok di Getasan, Jawa Tengah"
            )}
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/70 to-background" />
        </div>

        <div className="container relative z-10 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
          >
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t("Smart Farming · Central Java", "Smart Farming · Jawa Tengah")}
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] text-foreground"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {t("The Future of", "Masa Depan")}{" "}
            <span className="text-primary">{t("Modern Livestock", "Peternakan Modern")}</span>
            <br />
            {t("Starts in Getasan", "Dimulai di Getasan")}
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t(
              "Rumah Ternak Indopok is a state-of-the-art smart farming facility for up to 1,000 livestock — combining sustainable agriculture with modern monitoring technology in the highlands of Central Java.",
              "Rumah Ternak Indopok adalah fasilitas smart farming modern berkapasitas hingga 1.000 ternak — memadukan pertanian berkelanjutan dengan teknologi monitoring modern di dataran tinggi Jawa Tengah."
            )}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              onClick={() => scrollTo("about")}
            >
              {t("Learn More", "Pelajari Lebih")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/5"
              asChild
            >
              <Link to="/superbabi">
                {t("Invest Now", "Investasi Sekarang")}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {[
              { val: "1,000+", label: t("Livestock Capacity", "Kapasitas Ternak") },
              { val: "30%", label: t("Est. Annual Return", "Est. Hasil Tahunan") },
              { val: "100%", label: t("Smart Monitored", "Monitoring Penuh") },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-primary">
                  {s.val}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 md:py-28 bg-card">
        <div className="container max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                {t("About Indopok", "Tentang Indopok")}
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {t(
                  "A Modern Farm Built on Trust & Technology",
                  "Peternakan Modern Berbasis Kepercayaan & Teknologi"
                )}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t(
                  "Located in the cool highlands of Getasan, Semarang Regency — strategically positioned between Salatiga City and Magelang Regency — our facility benefits from prime accessibility, efficient logistics, and an ideal natural environment for livestock welfare.",
                  "Berlokasi di dataran tinggi sejuk Getasan, Kabupaten Semarang — strategis di antara Kota Salatiga dan Kabupaten Magelang — fasilitas kami menikmati aksesibilitas prima, logistik efisien, dan lingkungan alami ideal untuk kesejahteraan ternak."
                )}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t(
                  "We operate a fully integrated smart farm management system: from biosecure housing and climate control to real-time health monitoring and transparent investor reporting.",
                  "Kami menjalankan sistem manajemen smart farm terintegrasi: dari kandang biosekuriti dan kontrol iklim hingga monitoring kesehatan real-time dan laporan investor transparan."
                )}
              </p>

              <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-border">
                <div>
                  <p className="font-display text-3xl font-bold text-primary">1,000</p>
                  <p className="text-sm text-muted-foreground">
                    {t("Livestock at full capacity", "Ternak kapasitas penuh")}
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-muted-foreground">
                    {t("Smart monitoring uptime", "Monitoring 24/7")}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={heroFarm}
                  alt={t("Indopok smart farm exterior", "Eksterior smart farm Indopok")}
                  width={800}
                  height={1000}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-5 shadow-lg border border-border max-w-[220px] hidden md:block">
                <Leaf className="h-6 w-6 text-primary mb-2" />
                <p className="text-sm font-semibold text-foreground">
                  {t("Eco-Friendly Operations", "Operasi Ramah Lingkungan")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("Sustainable waste & feed cycle", "Siklus pakan & limbah berkelanjutan")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features — Super Babi */}
      <section id="features" className="py-20 md:py-28">
        <div className="container max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              Super Babi Investment
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {t("Invest in Modern Agriculture", "Investasi di Peternakan Modern")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(
                "A transparent, technology-driven investment program designed for serious modern investors and agricultural enthusiasts.",
                "Program investasi transparan berbasis teknologi untuk investor modern serius dan pencinta pertanian."
              )}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-card border border-border rounded-2xl p-7 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/superbabi">
                {t("Open Super Babi Dashboard", "Buka Dasbor Super Babi")}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="py-20 md:py-28 bg-card border-y border-border">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                {t("Strategic Location", "Lokasi Strategis")}
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {t("Getasan, Central Java", "Getasan, Jawa Tengah")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t(
                  "Nestled between Salatiga City and Magelang Regency, our farm sits in one of Java's most productive agricultural corridors — offering cool climate, clean water, and direct access to major distribution routes.",
                  "Berada di antara Kota Salatiga dan Kabupaten Magelang, peternakan kami terletak di salah satu koridor pertanian paling produktif di Jawa — dengan iklim sejuk, air bersih, dan akses langsung ke jalur distribusi utama."
                )}
              </p>
              <ul className="space-y-3">
                {[
                  t("Cool highland climate ideal for livestock", "Iklim dataran tinggi ideal untuk ternak"),
                  t("Strategic logistics between two major cities", "Logistik strategis antara dua kota besar"),
                  t("Clean water and quality feed access", "Akses air bersih dan pakan berkualitas"),
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-border shadow-md bg-background"
            >
              <iframe
                title="Indopok farm location map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=110.40%2C-7.40%2C110.55%2C-7.30&amp;layer=mapnik&amp;marker=-7.358%2C110.475"
                className="w-full h-full"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-xl p-4 border border-border shadow-md">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {t("Farm Location", "Lokasi Peternakan")}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">
                  Getasan, Semarang Regency, {t("Central Java", "Jawa Tengah")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-hero rounded-3xl p-10 md:p-14 text-center text-primary-foreground shadow-xl"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {t(
                "Ready to grow with modern agriculture?",
                "Siap berkembang bersama peternakan modern?"
              )}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              {t(
                "Join Super Babi Investment and become part of Indonesia's next generation of smart farming.",
                "Bergabunglah dengan Super Babi Investment dan jadi bagian dari generasi baru smart farming Indonesia."
              )}
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
              <Link to="/superbabi">
                {t("Start Investing", "Mulai Investasi")}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-sidebar text-sidebar-foreground pt-16 pb-8">
        <div className="container max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                  <Sprout className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="leading-tight">
                  <p className="font-display text-lg font-bold">Indopok</p>
                  <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
                    Rumah Ternak
                  </p>
                </div>
              </div>
              <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
                {t(
                  "Smart farming facility for the modern era. Sustainable, transparent, and built to scale.",
                  "Fasilitas smart farming era modern. Berkelanjutan, transparan, dan dirancang untuk berkembang."
                )}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-sidebar-foreground">
                {t("Sitemap", "Peta Situs")}
              </h4>
              <ul className="space-y-2 text-sm text-sidebar-foreground/70">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollTo(link.id)}
                      className="hover:text-accent transition-colors"
                    >
                      {t(link.en, link.id_label)}
                    </button>
                  </li>
                ))}
                <li>
                  <Link to="/superbabi" className="hover:text-accent transition-colors">
                    Super Babi Investment
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-sidebar-foreground">
                {t("Contact", "Kontak")}
              </h4>
              <ul className="space-y-3 text-sm text-sidebar-foreground/70">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-accent" />
                  <span>Getasan, Semarang, {t("Central Java", "Jawa Tengah")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <a href="mailto:hello@indopok.com" className="hover:text-accent transition-colors">
                    hello@indopok.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent" />
                  <span>+62 (0) 298 000 000</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-sidebar-foreground">
                {t("Follow Us", "Ikuti Kami")}
              </h4>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Linkedin, label: "LinkedIn" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="h-9 w-9 rounded-lg bg-sidebar-accent border border-sidebar-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-sidebar-border pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-sidebar-foreground/60">
            <p>© 2026 Rumah Ternak Indopok. {t("All rights reserved.", "Semua hak dilindungi.")}</p>
            <p>indopok.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
