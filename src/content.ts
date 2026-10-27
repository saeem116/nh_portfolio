/**
 * Centralized portfolio content.
 *
 * ALL personal information, media URLs, and copy live here so the owner can
 * personalize the site in one obvious place. Replace the placeholder values
 * below with the editor's real name, portrait, projects, and contact details.
 *
 * Every image URL has been verified to resolve at write time. If the owner
 * replaces them, the page still renders gracefully via the `<img>` fallback
 * styling in globals.css.
 */

// ---------- Personal info ----------
export const personal = {
  name: "NH Pavel",
  greeting: "HELLO, I'M",
  role: "VIDEO EDITOR & MOTION DESIGNER",
  tagline: "VIDEO EDITOR",
  // Hero headline parts
  heroHeadline: ["PORTFOLIO"],
  bio: "I edit videos that hold attention: sharp cuts, cinematic color, and sound design that makes every story land.",
  location: "Remote Worldwide",
  available: "AVAILABLE WORLDWIDE",
  // Placeholder stats
  years: 8,
  projects: 120,
  clients: 65,
  portrait: "/hero-portrait.png",
  portraitMobile: "/hero-portrait.png",
  // Actual PNG asset usage
  heroImage: "/hero-portrait.png",
};

// ---------- Contact ----------
export const contact = {
  email: "hello@nhpavel.com",
  emailLabel: "hello@nhpavel.com",
  website: "nh-pavel-portfolio.vercel.app",
  websiteLabel: "nh-pavel-portfolio.vercel.app",
  instagram: "https://www.instagram.com/nh_pavel9090/",
  vimeo: "https://vimeo.com/nhpavel",
  locationLabel: "Remote Worldwide",
  cta: "LET'S CREATE SOMETHING GREAT",
};

// ---------- Nav ----------
export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// ---------- Showreel (kept for backward compat) ----------
export const showreel = {
  title: "THE SHOWREEL",
  subtitle: "A collection of stories told frame by frame.",
  videoUrl: "",
  duration: "02:46",
  description:
    "A condensed journey across commercial, documentary, and narrative work — rhythm, color, and sound in motion.",
  poster:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200",
};

// ---------- Projects ----------
export type Project = {
  number: string;
  title: string;
  category: string;
  description: string;
  image: string;
  videoUrl: string;
  youtubeId: string;
  url?: string;
};

export const projects: Project[] = [
  {
    number: "01",
    title: "apple style animation",
    category: "Motion Design",
    description:
      "A short-form motion piece that demonstrates a clean, modern, and user-focused approach to animation.",
    image: "/project-01.png",
    videoUrl: "",
    youtubeId: "NhuWgCFB5Io",
    url: "#projects",
  },
  {
    number: "02",
    title: "Avenue Fashion Film",
    category: "FASHION FILM",
    description:
      "A travel piece shot across three continents, edited to follow the arc of the journey rather than the itinerary.",
    image: "/project-02.png",
    videoUrl: "",
    youtubeId: "VgXtpj5XgS8",
    url: "#projects",
  },
  {
    number: "03",
    title: "The Journal Documentary",
    category: "DOCUMENTARY",
    description:
      "A music video where the cut lives inside the beat — every transition lands on the downbeat.",
    image: "/project-03.png",
    videoUrl: "",
    youtubeId: "X1aFkAkFASk",
    url: "#projects",
  },
  {
    number: "04",
    title: "Fuel Sports Promo",
    category: "SPORTS PROMO",
    description:
      "Consistent, punchy YouTube editing that keeps the audience past the three-second mark, every episode.",
    image: "/project-04.png",
    videoUrl: "",
    youtubeId: "cILXVO90DeI",
    url: "#projects",
  },
  {
    number: "05",
    title: "Northwind Brand Film",
    category: "BRAND FILM",
    description:
      "A complete brand system for a sustainable architecture studio, built on restraint and material honesty.",
    image: "/project-05.png",
    videoUrl: "",
    youtubeId: "TS8wb9IMHA4",
    url: "#projects",
  },
  {
    number: "06",
    title: "Lumen Explainer",
    category: "EXPLAINER VIDEO",
    description:
      "Mobile app for mental wellness tracking and guided meditation, designed for calm and clarity.",
    image: "/project-06.png",
    videoUrl: "",
    youtubeId: "bgYnwHPJupE",
    url: "#projects",
  },
  {
    number: "07",
    title: "Atlas Travel Vlog",
    category: "TRAVEL FILM",
    description:
      "A booking platform for curated independent hotels, with a focus on discovery and trust.",
    image: "/project-07.png",
    videoUrl: "",
    youtubeId: "rz1B4B2yBZY",
    url: "#projects",
  },
  {
    number: "08",
    title: "Verde Music Video",
    category: "MUSIC VIDEO",
    description:
      "Online marketplace for local organic produce delivery, connecting growers and neighbors.",
    image: "/project-08.png",
    videoUrl: "",
    youtubeId: "z5y8Clp_TdE",
    url: "#projects",
  },
];

// ---------- Software / tools ----------
export const software = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Photoshop",
  "Audition",
];

// ---------- Skills with progress ----------
export const skills = [
  { name: "VIDEO EDITING", level: 95 },
  { name: "COLOR GRADING", level: 90 },
  { name: "MOTION GRAPHICS", level: 85 },
  { name: "SOUND DESIGN", level: 90 },
  { name: "VFX & COMPOSITING", level: 80 },
  { name: "STORYTELLING", level: 85 },
];

// ---------- Services / Principles ----------
export const services = [
  {
    number: "01",
    title: "STORY FIRST",
    description:
      "Every edit starts with the story, the message, and the audience.",
  },
  {
    number: "02",
    title: "RHYTHM & PACING",
    description: "Cuts, music, and motion timed to keep viewers watching.",
  },
  {
    number: "03",
    title: "EVERY PLATFORM",
    description:
      "Formats and exports tuned for YouTube, Reels, TikTok, and the big screen.",
  },
  {
    number: "04",
    title: "ON-TIME DELIVERY",
    description:
      "Clear communication, organized revisions, and fast turnarounds.",
  },
];

// ---------- Testimonials ----------
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Pavel is an incredible editor. He understood our vision perfectly and delivered a video that exceeded our expectations.",
    author: "Jessica Lee",
    role: "Founder, Avenue & Co.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200",
  },
  {
    quote:
      "Professional, creative, and detail-oriented. Fast turnarounds and the whole process was smooth from start to finish.",
    author: "David Carter",
    role: "CEO, Studio Form",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200",
  },
  {
    quote:
      "Our new campaign video looks amazing and performs exceptionally well. Highly recommended!",
    author: "James Wilson",
    role: "Marketing Director, Fuel Performance",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200",
  },
];

// ---------- Quote ----------
export const quote = {
  text: "I edit stories that are not only beautiful to watch but also paced, emotional, and impossible to scroll past.",
  attribution: personal.name,
};

// ---------- Footer ----------
export const footerSocials = [
  { label: "Instagram", href: contact.instagram },
  { label: "Vimeo", href: contact.vimeo },
];
