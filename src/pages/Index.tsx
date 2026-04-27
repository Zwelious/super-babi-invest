import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import LanguageToggle from "@/components/LanguageToggle";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Users, MapPin, Landmark, PiggyBank } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: TrendingUp,
      title: t("High Returns", "Pengembalian Tinggi"),
      desc: t(
        "Estimated 30% yearly return on your investment with transparent reporting.",
        "Estimasi pengembalian 30% per tahun dengan laporan transparan."
      ),
    },
    {
      icon: Shield,
      title: t("Secure Investment", "Investasi Aman"),
      desc: t(
        "Every investment is backed by real swine assets with full traceability.",
        "Setiap investasi didukung oleh aset ternak nyata dengan ketertelusuran penuh."
      ),
    },
    {
      icon: Users,
      title: t("Trusted Community", "Komunitas Terpercaya"),
      desc: t(
        "Join a growing network of investors in sustainable livestock farming.",
        "Bergabunglah dengan jaringan investor peternakan berkelanjutan."
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/superbabi" className="flex items-center gap-2">
            <PiggyBank className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">Super Babi</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" asChild>
              <Link to="/superbabi/login">{t("Login", "Masuk")}</Link>
            </Button>
            <Button asChild>
              <Link to="/superbabi/register">{t("Join Now", "Daftar")}</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-hero pt-32 pb-24 text-primary-foreground">
        <div className="container text-center max-w-3xl">
          <motion.h1
            className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {t("Invest in Sustainable", "Investasi di Peternakan")}
            <br />
            <span className="text-gradient-gold">{t("Swine Farming", "Babi Berkelanjutan")}</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl opacity-90 mb-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t(
              "Join Super Babi and earn up to 30% estimated yearly returns from our modern swine farm in Getasan, Semarang, Central Java.",
              "Bergabunglah dengan Super Babi dan raih estimasi pengembalian hingga 30% per tahun dari peternakan babi modern kami di Getasan, Semarang, Jawa Tengah."
            )}
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button size="lg" variant="hero" asChild>
              <Link to="/superbabi/register">{t("Start Investing", "Mulai Investasi")}</Link>
            </Button>
            <Button size="lg" variant="hero-outline" asChild>
              <Link to="#about">{t("Learn More", "Pelajari Lebih")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { val: "30%", label: t("Est. Yearly Return", "Est. Pengembalian Tahunan") },
            { val: "Getasan", label: t("Semarang, Central Java", "Semarang, Jawa Tengah") },
            { val: "6 & 12", label: t("Months Return Cycle", "Bulan Siklus Pengembalian") },
          ].map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-4xl font-display font-bold text-primary">{s.val}</p>
              <p className="text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-20">
        <div className="container max-w-5xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
            {t("Why Super Babi?", "Mengapa Super Babi?")}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-card rounded-lg p-8 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-card border-y">
        <div className="container max-w-4xl text-center">
          <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold mb-4">
            {t("Our Farm Location", "Lokasi Peternakan Kami")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            {t(
              "Located in the highlands of Getasan, Semarang Regency, Central Java — ideal climate for sustainable swine farming with access to quality feed and clean water.",
              "Terletak di dataran tinggi Getasan, Kabupaten Semarang, Jawa Tengah — iklim ideal untuk peternakan babi berkelanjutan dengan akses pakan berkualitas dan air bersih."
            )}
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Landmark className="h-5 w-5" />
            <span className="font-medium">Getasan, Semarang, {t("Central Java", "Jawa Tengah")}</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {t("Ready to Grow Your Wealth?", "Siap Mengembangkan Kekayaan Anda?")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t(
              "Register today and start your investment journey with Super Babi.",
              "Daftar hari ini dan mulai perjalanan investasi Anda bersama Super Babi."
            )}
          </p>
          <Button size="lg" asChild>
            <Link to="/superbabi/register">{t("Register Now", "Daftar Sekarang")}</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026 Super Babi. {t("All rights reserved.", "Semua hak dilindungi.")}
        </div>
      </footer>
    </div>
  );
};

export default Index;
