"use client";

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "motion/react";
import { toast, Toaster } from "sonner";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  Waves,
  Bike,
  Flower2,
  Building2,
  Trophy,
  Baby,
  Trees,
  Footprints,
  ShieldCheck,
  Coffee,
  Sparkles,
  Store,
  HeartPulse,
  Check,
} from "lucide-react";

import logo from "@/assets/logo.png";
import heroImg from "@/assets/hero-aerial.jpg";
import locationMap from "@/assets/location-map.jpg";
import amenityPool from "@/assets/amenity-pool.jpg";
import amenityClubhouse from "@/assets/amenity-clubhouse.jpg";
import amenityYoga from "@/assets/amenity-yoga.jpg";
import amenityTrack from "@/assets/amenity-track.jpg";
import masterPlan from "@/assets/master-plan.jpg";
import lifestyleFamily from "@/assets/lifestyle-family.jpg";
import galleryLake from "@/assets/gallery-lake.jpg";
import galleryAvenue from "@/assets/gallery-avenue.jpg";
import galleryGarden from "@/assets/gallery-garden.jpg";
import ctaDusk from "@/assets/cta-dusk.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------------------------- shared primitives ---------------------------- */

const ease = [0.22, 1, 0.36, 1] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-foreground/55">
      <span className="h-px w-8 bg-foreground/30" />
      <span>{children}</span>
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  y = 32,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GoldButton({
  children,
  href,
  variant = "solid",
  className = "",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "solid" | "ghost";
  className?: string;
}) {
  const base =
    "group relative inline-flex items-center gap-3 px-7 py-3.5 text-[12px] uppercase tracking-[0.28em] transition-all duration-500";
  const styles =
    variant === "solid"
      ? "text-white bg-gradient-to-br from-[#b8893a] via-[#d4a85a] to-[#8c6a2a] hover:shadow-[0_20px_50px_-20px_rgba(184,137,58,0.6)]"
      : "text-foreground border border-foreground/30 hover:border-foreground/70 backdrop-blur-md bg-white/40";
  return (
    <a href={href ?? "#"} className={`${base} ${styles} ${className}`}>
      <span>{children}</span>
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}

/* ------------------------------- navigation ------------------------------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["Vision", "#vision"],
    ["Location", "#location"],
    ["Highlights", "#highlights"],
    ["Amenities", "#amenities"],
    ["Master Plan", "#masterplan"],
    ["Gallery", "#gallery"],
  ];
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled ? "py-3" : "py-6"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 transition-all ${
          scrolled
            ? "rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_40px_-20px_rgba(60,40,20,0.18)] py-3"
            : ""
        }`}
        style={scrolled ? { maxWidth: "76rem" } : {}}
      >
        <a href="#top" className="flex items-center gap-3">
          <img
            src={logo.src}
            alt="TATRA STAR CITY"
            className={`w-auto transition-all duration-200 ${scrolled ? "h-10" : "h-20"}`}
          />
          {/* <div className="hidden sm:block leading-tight">
            <div className="text-[10px] uppercase tracking-[0.32em] text-foreground/55">
              TATRA Capital
            </div>
            <div className="text-[13px] font-medium tracking-[0.18em]">
              STAR CITY
            </div>
          </div> */}
        </a>
        <nav className="hidden lg:flex items-center gap-9 text-[12px] uppercase tracking-[0.22em] text-foreground/70">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#enquire"
          className="hidden sm:inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] hover:bg-foreground/85 transition-colors"
        >
          Enquire <ArrowRight className="h-3 w-3" />
        </a>
      </div>
    </motion.header>
  );
}

/* ----------------------------------- Hero ---------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] min-h-[720px] w-full overflow-hidden"
    >
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <img
          src={heroImg.src}
          alt="Aerial view of TATRA STAR CITY township between two lakes at golden hour"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f1e3]/30 via-transparent to-[#f7f1e3]/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f1e3]/30 via-transparent to-[#f7f1e3]/20" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <Reveal delay={0.4} y={20}>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full glass px-5 py-2 text-[10px] uppercase tracking-[0.34em] text-foreground/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a24c]" />
            New launch · An Investment Address
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <h1 className="font-serif text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.95] text-balance text-foreground">
            Where <em className="not-italic gold-text-dark">Vision</em>
            <br />
            Meets <em className="italic font-light">Value.</em>
          </h1>
        </Reveal>

        <Reveal delay={0.85}>
          <p className="mx-auto mt-7 max-w-xl text-[22px] leading-relaxed text-foreground/70">
            A premium plotted development crafted for future-focused investors
            and an elevated way of living — held between two lakes, drawn by
            master planners.
          </p>
        </Reveal>

        <Reveal delay={1.05}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <GoldButton href="#vision">Explore Project</GoldButton>
            <GoldButton href="#enquire" variant="ghost">
              Book Consultation
            </GoldButton>
          </div>
        </Reveal>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] uppercase tracking-[0.34em] text-foreground/55">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 text-foreground/55 scroll-pulse" />
        </motion.div>
      </motion.div>

      {/* corner refs */}
      <div className="pointer-events-none absolute top-28 left-6 lg:left-10 z-10 hidden md:block">
        <div className="text-[10px] uppercase tracking-[0.34em] text-foreground/60">
          A TATRA Capital Development
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-10 right-6 lg:right-10 z-10 hidden md:block text-right">
        <div className="text-[10px] uppercase tracking-[0.34em] text-foreground/60">
          Master Planned · Plotted · Future-Ready
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ marquee strip ------------------------------ */
function Marquee() {
  const items = [
    "Mega Plotted Development",
    "Between Two Lakes",
    "Strategic Corridor",
    "Future-Ready Township",
    "Investment Grade",
    "Urban Luxury Living",
    "Landscaped Community",
  ];
  return (
    <div className="border-y border-foreground/10 bg-secondary/40 overflow-hidden">
      <div className="flex whitespace-nowrap marquee-track py-5">
        {[...items, ...items, ...items].map((t, i) => (
          <span
            key={i}
            className="mx-10 inline-flex items-center gap-10 font-serif text-2xl italic text-foreground/55"
          >
            {t}
            <span className="text-[#c9a24c]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Vision --------------------------------- */

function Vision() {
  return (
    <section id="vision" className="relative bg-background py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5 lg:sticky lg:top-32 self-start space-y-8">
          <SectionLabel>01 / The Vision</SectionLabel>
          <Reveal>
            <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] text-balance">
              A city composed
              <br />
              like a piece of <em className="italic gold-text-dark">music.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-foreground/65 leading-relaxed max-w-md">
              TATRA STAR CITY is not a project. It is a thesis — that the next
              chapter of Indian real estate belongs to master-planned, plotted
              communities that hold land, nature and intent in equal measure.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="flex items-center gap-4 pt-2">
              <span className="h-px w-12 bg-foreground/30" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/60">
                A signature TATRA Capital Address
              </span>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 space-y-8">
          {[
            {
              k: "Mega plotted development",
              v: "A canvas drawn at city-scale — wide avenues, generous setbacks and the rare luxury of breathing room.",
            },
            {
              k: "Future-ready township",
              v: "Underground utilities, EV-first roads, fibre infrastructure and climate-resilient landscaping built in from day one.",
            },
            {
              k: "Urban luxury living",
              v: "Resort-grade amenities, walkable pockets and design that quietly carries the weight of permanence.",
            },
            {
              k: "Strategic investment opportunity",
              v: "Positioned on a high-growth corridor with the kind of fundamentals long-term capital is built on.",
            },
            {
              k: "Nature & infrastructure in balance",
              v: "Held between two lakes — softened by water, framed by trees, defined by deliberate planning.",
            },
          ].map((row, i) => (
            <Reveal key={row.k} delay={i * 0.06}>
              <div className="group grid grid-cols-[80px_1fr] gap-6 border-b border-foreground/10 pb-7 pt-1">
                <div className="text-[11px] uppercase tracking-[0.28em] text-foreground/45 pt-1">
                  /0{i + 1}
                </div>
                <div>
                  <h3 className="font-serif text-2xl lg:text-3xl text-foreground/90 group-hover:text-foreground transition-colors">
                    {row.k}
                  </h3>
                  <p className="mt-3 text-foreground/60 leading-relaxed text-[15px] max-w-xl">
                    {row.v}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Trust / Stats ----------------------------- */

function Trust() {
  const stats = [
    { n: "25+", l: "Years of Stewardship" },
    { n: "8M sq.ft", l: "Master-planned, Delivered" },
    { n: "12,000+", l: "Families Invested With Us" },
    { n: "AAA", l: "Investor Confidence Rating" },
  ];
  return (
    <section className="relative py-28 lg:py-36 bg-gradient-to-b from-secondary/40 via-background to-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-6">
            <SectionLabel>02 / TATRA Capital</SectionLabel>
            <Reveal>
              <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.05] text-balance">
                A developer with the patience of a planner and the
                <em className="italic gold-text"> ambition of a city.</em>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <p className="text-foreground/65 leading-relaxed">
                TATRA Capital is a future-focused real estate house that has
                spent decades stewarding land, capital and the trust of
                investors. STAR CITY is the culmination of everything we have
                learned.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="bg-background p-8 lg:p-10 h-full flex flex-col justify-between gap-10 min-h-[200px]">
                <div className="font-serif text-5xl lg:text-6xl gold-text">
                  {s.n}
                </div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                  {s.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Location -------------------------------- */

function Location() {
  const pins = [
    { x: "32%", y: "38%", label: "Metro Connectivity" },
    { x: "58%", y: "28%", label: "International Airport" },
    { x: "70%", y: "55%", label: "IT Corridor" },
    { x: "40%", y: "62%", label: "Commercial Zone" },
    { x: "22%", y: "70%", label: "Schools & Hospitals" },
  ];
  return (
    <section
      id="location"
      className="relative h-[100svh] min-h-[760px] w-full overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={locationMap.src}
          alt="Strategic location aerial map around TATRA STAR CITY"
          loading="lazy"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f3ead5]/85 via-[#f3ead5]/40 to-transparent lg:via-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/30" />
      </div>

      {/* pins */}
      {pins.map((p, i) => (
        <motion.div
          key={p.label}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.18, duration: 0.6, ease }}
          className="absolute z-10 hidden md:block"
          style={{ left: p.x, top: p.y }}
        >
          <div className="relative">
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-[#c9a24c]/60 ping-slow" />
            <div className="relative h-3 w-3 rounded-full bg-[#c9a24c] ring-2 ring-white shadow-md" />
            <div className="absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-foreground/80">
              {p.label}
            </div>
          </div>
        </motion.div>
      ))}

      <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10">
        <Reveal>
          <div className="ml-auto w-full max-w-md glass rounded-sm p-8 lg:p-10 shadow-[0_30px_80px_-30px_rgba(60,40,20,0.3)]">
            <SectionLabel>03 / Strategic Location</SectionLabel>
            <h2 className="mt-6 font-serif text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.05]">
              Held at the centre of
              <em className="italic gold-text"> tomorrow's city.</em>
            </h2>
            <p className="mt-5 text-foreground/70 leading-relaxed text-[15px]">
              At the intersection of the new metro line, the regional IT
              corridor and the commercial district — STAR CITY sits on a piece
              of land time will only make more valuable.
            </p>

            <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3 text-[13px] text-foreground/75">
              {[
                ["10 min", "Metro Station"],
                ["12 min", "IT Hub"],
                ["18 min", "Int'l Schools"],
                ["20 min", "Tertiary Hospitals"],
                ["25 min", "Airport"],
                ["05 min", "Retail Spine"],
              ].map(([t, l]) => (
                <li key={l} className="flex flex-col">
                  <span className="font-serif text-xl gold-text">{t}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                    {l}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-foreground/60">
              <MapPin className="h-3.5 w-3.5" />
              Coordinates available on request
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ Highlights -------------------------------- */

function Highlights() {
  const cards = [
    {
      t: "Between Two Lakes",
      s: "A rare site held by water on either flank.",
      img: galleryLake,
    },
    {
      t: "Premium Plotted Layouts",
      s: "Generous, well-proportioned, future-built.",
      img: galleryAvenue,
    },
    {
      t: "Modern Infrastructure",
      s: "Underground utilities & smart-ready roads.",
      img: amenityClubhouse,
    },
    {
      t: "Investment Corridor",
      s: "High-growth, institutionally-tracked geography.",
      img: ctaDusk,
    },
    {
      t: "Landscaped Community",
      s: "Forty percent open, deliberately green.",
      img: galleryGarden,
    },
    {
      t: "Urban Connectivity",
      s: "Metro, airport and commercial in 25 mins.",
      img: locationMap,
    },
  ];
  return (
    <section
      id="highlights"
      className="relative bg-background py-28 lg:py-36 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between gap-10 flex-wrap mb-14">
          <div className="space-y-6">
            <SectionLabel>04 / Project Highlights</SectionLabel>
            <Reveal>
              <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.05] max-w-2xl text-balance">
                Six convictions, drawn into
                <em className="italic gold-text"> the land itself.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="text-[11px] uppercase tracking-[0.28em] text-foreground/55 max-w-xs">
              Scroll horizontally to read the project's defining notes.
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-6 lg:gap-8 px-6 lg:px-10 snap-x snap-mandatory">
          {cards.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06}>
              <article className="snap-start group relative w-[78vw] sm:w-[420px] lg:w-[460px] shrink-0">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={c.img.src}
                    alt={c.t}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute top-5 left-5 text-[10px] uppercase tracking-[0.28em] text-white/85">
                    /0{i + 1}
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="font-serif text-3xl lg:text-4xl leading-tight">
                      {c.t}
                    </h3>
                    <p className="mt-2 text-sm text-white/80 max-w-sm">{c.s}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
          <div className="w-8 shrink-0" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Amenities -------------------------------- */

function Amenities() {
  const list = [
    { icon: Waves, name: "Swimming Pool" },
    { icon: Bike, name: "Cycling Track" },
    { icon: Flower2, name: "Yoga Spaces" },
    { icon: Building2, name: "Clubhouse" },
    { icon: Trophy, name: "Sports Courts" },
    { icon: Baby, name: "Kids Play Area" },
    { icon: Trees, name: "Landscaped Gardens" },
    { icon: Footprints, name: "Jogging Track" },
    { icon: ShieldCheck, name: "24×7 Security" },
    { icon: Sparkles, name: "Community Lounge" },
    { icon: Store, name: "Retail Spaces" },
    { icon: Coffee, name: "Café Areas" },
    { icon: HeartPulse, name: "Wellness Zones" },
  ];
  return (
    <section id="amenities" className="relative bg-secondary/40 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-7 space-y-6">
            <SectionLabel>05 / The Resort Within</SectionLabel>
            <Reveal>
              <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.05] text-balance">
                Amenities composed like a
                <em className="italic gold-text"> private resort.</em>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={0.15}>
              <p className="text-foreground/65 leading-relaxed">
                Thirteen experiences threaded across the township — water,
                wellness, sport, community and quiet. Designed not as a list,
                but as a daily rhythm.
              </p>
            </Reveal>
          </div>
        </div>

        {/* feature masonry */}
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <div className="group relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden">
              <img
                src={amenityPool.src}
                alt="Infinity pool"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/80">
                  / 01 — Water
                </div>
                <h3 className="font-serif text-3xl lg:text-5xl mt-2">
                  Infinity Pool
                </h3>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-5">
            <div className="group relative aspect-[4/3] overflow-hidden">
              <img
                src={amenityClubhouse.src}
                alt="Clubhouse"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/80">
                  / 02 — Gather
                </div>
                <h3 className="font-serif text-2xl lg:text-3xl mt-1">
                  The Clubhouse
                </h3>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.14} className="lg:col-span-3">
            <div className="group relative aspect-square overflow-hidden">
              <img
                src={amenityYoga.src}
                alt="Yoga pavilion"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/80">
                  / 03
                </div>
                <h3 className="font-serif text-xl mt-1">Yoga Pavilion</h3>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="lg:col-span-2">
            <div className="h-full bg-background border border-foreground/10 p-5 flex flex-col justify-between aspect-square lg:aspect-auto">
              <div className="text-[10px] uppercase tracking-[0.28em] text-foreground/55">
                / 04
              </div>
              <div>
                <div className="font-serif text-4xl gold-text">13</div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-foreground/55 mt-1">
                  Curated Experiences
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* list */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
          {list.map((a, i) => {
            const Icon = a.icon;
            return (
              <Reveal key={a.name} delay={i * 0.03}>
                <div className="group bg-background p-5 lg:p-6 flex items-center gap-4 hover:bg-secondary/60 transition-colors h-full">
                  <Icon
                    className="h-5 w-5 text-[#b8893a] shrink-0"
                    strokeWidth={1.4}
                  />
                  <span className="text-[13px] tracking-wide text-foreground/80">
                    {a.name}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- Lifestyle -------------------------------- */

function Lifestyle() {
  return (
    <section className="relative bg-background py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <Reveal>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={lifestyleFamily.src}
                alt="Family by the lake at golden hour"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-6 hidden md:block w-56 h-72 overflow-hidden border-8 border-background shadow-[0_30px_60px_-25px_rgba(60,40,20,0.35)]">
              <img
                src={amenityTrack.src}
                alt="Jogging track"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>
        <div className="space-y-8">
          <SectionLabel>06 / A Life, Slowly Earned</SectionLabel>
          <Reveal>
            <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.04] text-balance">
              Mornings by the lake.
              <br />
              Afternoons in the trees.
              <em className="italic gold-text"> Evenings that matter.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-foreground/65 leading-relaxed max-w-lg">
              STAR CITY is built for families who want their children to grow up
              in a place where wellness is the default, where nature is the
              neighbour, and where the long-term value of land matches the
              long-term value of memory.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <ul className="space-y-3 max-w-lg">
              {[
                "Modern family living, rooted in nature",
                "Wellness woven into the everyday",
                "An investment that compounds across generations",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-foreground/75"
                >
                  <Check
                    className="h-4 w-4 mt-1 text-[#b8893a]"
                    strokeWidth={2}
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Master Plan ------------------------------- */

function MasterPlanSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  return (
    <section
      id="masterplan"
      ref={ref}
      className="relative bg-secondary/40 py-28 lg:py-36 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 mb-14 flex items-end justify-between gap-10 flex-wrap">
        <div className="space-y-6">
          <SectionLabel>07 / The Master Plan</SectionLabel>
          <Reveal>
            <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.05] max-w-2xl text-balance">
              The township, drawn at
              <em className="italic gold-text"> city scale.</em>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <p className="max-w-sm text-foreground/65 leading-relaxed">
            A composition of plots, parks, water and avenues — engineered to age
            beautifully.
          </p>
        </Reveal>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6 lg:px-10">
        <div className="relative overflow-hidden bg-[#efe6ce]">
          <motion.img
            style={{ scale }}
            src={masterPlan.src}
            alt="TATRA STAR CITY master plan"
            loading="lazy"
            className="w-full h-auto object-cover"
          />
          {/* floating labels */}
          {[
            { x: "20%", y: "40%", t: "Lake Promenade" },
            { x: "48%", y: "52%", t: "Central Clubhouse" },
            { x: "72%", y: "32%", t: "Retail Spine" },
            { x: "60%", y: "78%", t: "Wellness Park" },
          ].map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.8, ease }}
              className="absolute hidden md:flex items-center gap-2 glass rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.26em] text-foreground/80"
              style={{ left: p.x, top: p.y }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a24c]" />
              {p.t}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Investment ------------------------------- */

function Investment() {
  const bars = [42, 58, 71, 88, 100];
  return (
    <section className="relative bg-background py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-7">
          <SectionLabel>08 / Investment Value</SectionLabel>
          <Reveal>
            <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.04] text-balance">
              Land remembers.
              <br />
              <em className="italic gold-text">Capital compounds.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-foreground/65 leading-relaxed max-w-md">
              Positioned in a high-growth corridor, anchored by trusted
              development and built for long-term value creation — STAR CITY is
              a thesis on patient capital, written in land.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="space-y-3 pt-3 max-w-md">
              {[
                "High-growth investment corridor",
                "Strategic appreciation potential",
                "Trusted, future-ready development",
                "Designed for long-term value",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-center gap-3 text-foreground/75 text-[14px]"
                >
                  <span className="h-px w-6 bg-[#c9a24c]" />
                  {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <div className="glass p-8 lg:p-10 rounded-sm">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-foreground/55">
                <span>Projected Land Value Index</span>
                <span>2025 — 2030</span>
              </div>
              <div className="mt-10 flex items-end justify-between gap-4 h-56">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    whileInView={{ height: `${h}%`, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 1, ease }}
                    className="flex-1 bg-gradient-to-t from-[#8c6a2a] to-[#e7c986] rounded-t-sm relative"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-foreground/55">
                      {2025 + i}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
                {[
                  ["1.8×", "Projected Appreciation"],
                  ["A+", "Corridor Rating"],
                  ["100%", "Clear Title Plots"],
                ].map(([n, l]) => (
                  <div key={l} className="bg-background p-6">
                    <div className="font-serif text-3xl gold-text">{n}</div>
                    <div className="text-[10px] uppercase tracking-[0.26em] text-foreground/55 mt-2">
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Gallery -------------------------------- */

function Gallery() {
  const items = [
    { img: galleryLake, t: "Lake at Dawn", c: "lg:col-span-4 aspect-[4/5]" },
    { img: amenityPool, t: "Infinity Edge", c: "lg:col-span-3 aspect-[4/5]" },
    { img: galleryAvenue, t: "The Avenue", c: "lg:col-span-5 aspect-[4/3]" },
    {
      img: galleryGarden,
      t: "Garden Pavilion",
      c: "lg:col-span-5 aspect-[4/3]",
    },
    { img: amenityYoga, t: "Pavilion", c: "lg:col-span-3 aspect-[4/5]" },
    { img: ctaDusk, t: "Township at Dusk", c: "lg:col-span-4 aspect-[4/5]" },
  ];
  return (
    <section id="gallery" className="relative bg-secondary/40 py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-end justify-between mb-14 gap-8 flex-wrap">
          <div className="space-y-6">
            <SectionLabel>09 / The Gallery</SectionLabel>
            <Reveal>
              <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.05] text-balance max-w-xl">
                A portrait of the
                <em className="italic gold-text"> township to come.</em>
              </h2>
            </Reveal>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.05} className={it.c}>
              <figure className="group relative h-full overflow-hidden">
                <img
                  src={it.img.src}
                  alt={it.t}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <figcaption className="absolute bottom-5 left-5 text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 text-[11px] uppercase tracking-[0.28em]">
                  {it.t}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Enquire -------------------------------- */

function Enquire() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    interest: "Plotted Development",
    message: "",
  });
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please complete name, phone and email.");
      return;
    }
    setSubmitted(true);
    toast.success("Request received. Our team will be in touch shortly.");
  };

  return (
    <section id="enquire" className="relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={ctaDusk.src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/60 to-background/95" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-7">
          <SectionLabel>10 / Request a Consultation</SectionLabel>
          <Reveal>
            <h2 className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] text-balance">
              Speak to a<em className="italic gold-text-dark"> Senior Advisor.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-foreground/65 leading-relaxed max-w-md">
              A private walkthrough of the master plan, pricing and investment
              thesis — at a time that suits you.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="space-y-3 text-[13px] text-foreground/70">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#b8893a]" /> +91 98XXX XXXXX
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#b8893a]" />{" "}
                investors@tatracapital.com
              </div>
              <a
                href="https://wa.me/919800000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-[12px] uppercase tracking-[0.24em] hover:bg-[#20BA5A] transition-colors"
              >
                Chat on WhatsApp <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <div className="glass rounded-sm p-7 lg:p-10 shadow-[0_40px_100px_-40px_rgba(60,40,20,0.35)]">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={onSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {[
                    { k: "name", l: "Full Name", t: "text", full: true },
                    { k: "phone", l: "Phone Number", t: "tel" },
                    { k: "email", l: "Email Address", t: "email" },
                  ].map((f) => (
                    <label
                      key={f.k}
                      className={`block ${f.full ? "md:col-span-2" : ""}`}
                    >
                      <span className="block text-[10px] uppercase tracking-[0.28em] text-foreground/55 mb-2">
                        {f.l}
                      </span>
                      <input
                        type={f.t}
                        value={(form as any)[f.k]}
                        onChange={(e) =>
                          setForm({ ...form, [f.k]: e.target.value })
                        }
                        className="w-full bg-transparent border-b border-foreground/25 focus:border-foreground/80 outline-none py-2 text-[15px] transition-colors"
                        required
                      />
                    </label>
                  ))}
                  <label className="block md:col-span-2">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-foreground/55 mb-2">
                      Interested In
                    </span>
                    <select
                      value={form.interest}
                      onChange={(e) =>
                        setForm({ ...form, interest: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-foreground/25 focus:border-foreground/80 outline-none py-2 text-[15px]"
                    >
                      <option>Plotted Development</option>
                      <option>Investment Opportunity</option>
                      <option>Site Visit</option>
                      <option>Brochure & Pricing</option>
                    </select>
                  </label>
                  <label className="block md:col-span-2">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-foreground/55 mb-2">
                      Message
                    </span>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full bg-transparent border-b border-foreground/25 focus:border-foreground/80 outline-none py-2 text-[15px] resize-none"
                    />
                  </label>
                  <div className="md:col-span-2 pt-4 flex flex-wrap items-center gap-5 justify-between">
                    <p className="text-[11px] text-foreground/50 max-w-xs">
                      Your details remain confidential and are used only by
                      TATRA Capital.
                    </p>
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 px-7 py-3.5 text-[12px] uppercase tracking-[0.28em] text-white bg-gradient-to-br from-[#b8893a] via-[#d4a85a] to-[#8c6a2a] hover:shadow-[0_20px_50px_-20px_rgba(184,137,58,0.6)] transition-all"
                    >
                      Request a Consultation
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease }}
                  className="py-12 text-center"
                >
                  <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-[#b8893a] to-[#8c6a2a] flex items-center justify-center text-white">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-3xl mt-6">
                    Thank you, {form.name.split(" ")[0]}.
                  </h3>
                  <p className="text-foreground/65 mt-3 max-w-md mx-auto">
                    A senior advisor from TATRA Capital will reach out within
                    one business day to schedule your private consultation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Final CTA ------------------------------ */

function FinalCTA() {
  return (
    <section className="relative h-[90svh] min-h-[600px] w-full overflow-hidden">
      <img
        src={ctaDusk.src}
        alt="Township at dusk"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
        <Reveal>
          <SectionLabel>
            <span className="text-white/80">The Future, Held in Land</span>
          </SectionLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-8 font-serif text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.95] text-white text-balance max-w-5xl">
            Own the future with
            <br />
            <em className="italic gold-text">TATRA STAR CITY.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-10">
            <GoldButton href="#enquire">Begin Your Enquiry</GoldButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------- Footer -------------------------------- */

function Footer() {
  return (
    <footer className="bg-background border-t border-foreground/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-3">
            <img src={logo.src} alt="TATRA STAR CITY" className="h-12 w-auto" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground/55">
                TATRA Capital
              </div>
              <div className="text-[14px] font-medium tracking-[0.18em]">
                STAR CITY
              </div>
            </div>
          </div>
          <p className="text-foreground/60 max-w-sm leading-relaxed">
            A premium plotted development crafted for future-focused investors
            and elevated living — a signature address by TATRA Capital.
          </p>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-foreground/55">
            Navigate
          </div>
          <ul className="space-y-2 text-[14px] text-foreground/75">
            {[
              ["Vision", "#vision"],
              ["Location", "#location"],
              ["Highlights", "#highlights"],
              ["Amenities", "#amenities"],
              ["Master Plan", "#masterplan"],
              ["Enquire", "#enquire"],
            ].map(([l, h]) => (
              <li key={h}>
                <a href={h} className="hover:text-foreground transition-colors">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-foreground/55">
            Contact
          </div>
          <ul className="space-y-2 text-[14px] text-foreground/75">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-[#b8893a]" /> +91 98XXX XXXXX
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-[#b8893a]" />{" "}
              investors@tatracapital.com
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#b8893a]" /> TATRA Capital HQ,
              India
            </li>
          </ul>
          <div className="flex items-center gap-3 pt-2">
            {[Instagram, Linkedin, Facebook].map((Ic, i) => (
              <a
                key={i}
                href="#"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-foreground/20 hover:border-foreground/60 hover:text-foreground text-foreground/60 transition-colors"
              >
                <Ic className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-foreground/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex items-center justify-between text-[11px] uppercase tracking-[0.26em] text-foreground/50 flex-wrap gap-3">
          <span>
            © {new Date().getFullYear()} TATRA Capital. All rights reserved.
          </span>
          <span>RERA details available on request</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ Sticky CTA -------------------------------- */

function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#enquire"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.5, ease }}
          className="fixed bottom-6 right-6 z-40 hidden lg:inline-flex items-center gap-3 px-6 py-3.5 text-[11px] uppercase tracking-[0.26em] text-white bg-gradient-to-br from-[#b8893a] via-[#d4a85a] to-[#8c6a2a] rounded-full shadow-[0_25px_60px_-20px_rgba(184,137,58,0.7)] hover:scale-[1.02] transition-transform"
        >
          Book Consultation <ArrowUpRight className="h-3.5 w-3.5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------- Page ---------------------------------- */

function Index() {
  return (
    <main className="relative bg-background text-foreground antialiased overflow-x-hidden">
      <Toaster position="top-center" richColors />
      <Nav />
      <Hero />
      <Marquee />
      <Vision />
      <Trust />
      <Location />
      <Highlights />
      <Amenities />
      <Lifestyle />
      <MasterPlanSection />
      <Investment />
      <Gallery />
      <Enquire />
      <FinalCTA />
      <Footer />
      <StickyCTA />
    </main>
  );
}

export { Index };
