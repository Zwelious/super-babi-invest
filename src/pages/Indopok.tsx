import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Cpu,
  LineChart,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  Sprout,
  Building2,
  Users,
  Recycle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoWhite from "@/assets/indopok-logo-white.png";
import logoTransparent from "@/assets/indopok-logo-transparent.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" as const },
  }),
};

const Indopok = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll for in-page anchors
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    {
      icon: LineChart,
      title: "High Yield Potential",
      desc: "Carefully structured project cycles with transparent, performance-based returns from a high-capacity facility.",
    },
    {
      icon: Cpu,
      title: "Smart Farming Technology",
      desc: "IoT-based monitoring of climate, feed, and animal welfare ensures consistent productivity at scale.",
    },
    {
      icon: ShieldCheck,
      title: "Transparent Monitoring",
      desc: "Partners gain real-time visibility into operations, herd performance, and financial reporting.",
    },
    {
      icon: Recycle,
      title: "Sustainable Operations",
      desc: "Eco-friendly waste management and biosecurity practices designed for long-term, responsible growth.",
    },
  ];

  const stats = [
    { val: "1,000+", label: "Livestock Capacity" },
    { val: "100%", label: "Modern Facility" },
    { val: "24/7", label: "Smart Monitoring" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-md border-b shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img
              src={logoTransparent}
              alt="Rumah Ternak Indopok"
              className="h-12 md:h-14 w-auto object-contain"
            />
          </Link>

          <div
            className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors ${
              scrolled ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            <a href="#about" onClick={(e) => handleAnchor(e, "about")} className="hover:text-accent transition-colors">
              About
            </a>
            <a href="#features" onClick={(e) => handleAnchor(e, "features")} className="hover:text-accent transition-colors">
              Project
            </a>
            <a href="#location" onClick={(e) => handleAnchor(e, "location")} className="hover:text-accent transition-colors">
              Location
            </a>
            <a href="#contact" onClick={(e) => handleAnchor(e, "contact")} className="hover:text-accent transition-colors">
              Contact
            </a>
          </div>

          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">
            <Link to="/superbabi">
              Project Dashboard
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(42 80% 55% / 0.4) 0, transparent 40%), radial-gradient(circle at 80% 70%, hsl(152 45% 28% / 0.6) 0, transparent 45%)",
          }}
        />
        <div className="container relative">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-1.5 text-xs uppercase tracking-wider mb-6"
            >
              <Leaf className="h-3.5 w-3.5 text-accent" />
              Smart Farming · Agritech Indonesia
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
            >
              Modern Pig Farming, <br />
              <span className="text-gradient-gold">Engineered for Trust.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base md:text-lg text-primary-foreground/85 max-w-2xl mb-8 leading-relaxed"
            >
              Rumah Ternak Indopok is a state-of-the-art livestock facility in Getasan,
              Central Java — combining smart farming technology, sustainable operations,
              and transparent project opportunities for the next generation of agritech.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
              >
                <Link to="/superbabi">
                  Join the Project <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                <a href="#about" onClick={(e) => handleAnchor(e, "about")}>
                  Learn More
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-12 mt-16 max-w-2xl">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="font-display text-2xl md:text-4xl font-bold text-accent">
                  {s.val}
                </p>
                <p className="text-xs md:text-sm text-primary-foreground/70 mt-1">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 md:py-32">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              About the Facility
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6 leading-tight">
              A Premium Farm Built on the Highlands of Getasan.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Strategically located between Salatiga City and Magelang Regency,
              Rumah Ternak Indopok benefits from the cool highland climate of Central Java —
              ideal conditions for healthy livestock and efficient operations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our facility integrates modern farm management systems, eco-friendly
              waste handling, and biosecurity protocols at a scale of up to 1,000 livestock,
              setting a new benchmark for responsible Indonesian agritech.
            </p>

            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: Building2, title: "Modern Facility", desc: "Purpose-built infrastructure" },
                { icon: Leaf, title: "Eco-Friendly", desc: "Sustainable operations" },
                { icon: MapPin, title: "Strategic Location", desc: "Salatiga · Magelang access" },
                { icon: Users, title: "Expert Team", desc: "Experienced farm management" },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-emerald-light to-emerald-dark relative shadow-2xl">
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, hsl(42 80% 55% / 0.5), transparent 50%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground p-8">
                <Sprout className="h-20 w-20 mb-6 text-accent" />
                <p className="font-display text-3xl font-bold text-center mb-2">
                  Getasan Highland
                </p>
                <p className="text-sm text-center opacity-80 max-w-xs">
                  Semarang Regency, Central Java
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border rounded-xl shadow-lg p-4 max-w-[200px] hidden md:block">
              <p className="font-display text-2xl font-bold text-primary">1,000+</p>
              <p className="text-xs text-muted-foreground">Livestock capacity at full operation</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES / OUR PROJECT */}
      <section id="features" className="py-24 md:py-32 bg-secondary/40 border-y">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              Our Project
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-5 leading-tight">
              Be Part of the Future of Smart Farming.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our project is powered by Rumah Ternak Indopok — built on transparency,
              modern technology, and a sustainable business model.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group bg-card border rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-md">
              <Link to="/superbabi">
                Explore the Project <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section id="location" className="py-24 md:py-32">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
              Strategic Location
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Between Salatiga & Magelang
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Positioned at the crossroads of two major regional hubs — enabling efficient
              logistics, talent access, and prime natural conditions.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border shadow-xl">
            <div className="aspect-[16/9] w-full">
              <iframe
                title="Getasan Location Map"
                src="https://www.google.com/maps?q=Getasan,+Semarang+Regency,+Central+Java&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-5">
            Ready to grow with Indonesian agritech?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join our investor community and be part of a sustainable, technology-driven
            farming revolution.
          </p>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
            <Link to="/superbabi">
              Go to Super Babi Investment <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-sidebar text-sidebar-foreground pt-16 pb-8">
        <div className="container grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                <Sprout className="h-5 w-5 text-accent-foreground" />
              </div>
              <p className="font-display text-lg font-bold">Indopok</p>
            </div>
            <p className="text-sm text-sidebar-foreground/70 max-w-sm leading-relaxed mb-4">
              Rumah Ternak Indopok — a state-of-the-art pig farming facility built on
              smart farming technology and sustainable practices.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-accent">
              Site Map
            </p>
            <ul className="space-y-2 text-sm text-sidebar-foreground/80">
              <li><a href="#about" onClick={(e) => handleAnchor(e, "about")} className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#features" onClick={(e) => handleAnchor(e, "features")} className="hover:text-accent transition-colors">Investment</a></li>
              <li><a href="#location" onClick={(e) => handleAnchor(e, "location")} className="hover:text-accent transition-colors">Location</a></li>
              <li><Link to="/superbabi" className="hover:text-accent transition-colors">Super Babi</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-4 text-sm uppercase tracking-wider text-accent">
              Contact
            </p>
            <ul className="space-y-3 text-sm text-sidebar-foreground/80">
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span>Getasan, Semarang Regency, Central Java</span>
              </li>
              <li className="flex gap-2">
                <Mail className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span>info@indopok.com</span>
              </li>
              <li className="flex gap-2">
                <Phone className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span>+62 (000) 000-0000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container border-t border-sidebar-border pt-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-sidebar-foreground/60">
          <p>© {new Date().getFullYear()} Rumah Ternak Indopok. All rights reserved.</p>
          <p>Smart Farming · Sustainable · Transparent</p>
        </div>
      </footer>
    </div>
  );
};

export default Indopok;
