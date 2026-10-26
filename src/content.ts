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
  role: "WEB DESIGNER & DIGITAL CREATIVE",
  tagline: "WEB DESIGNER",
  // Hero headline parts
  heroHeadline: ["PORTFOLIO"],
  bio: "I craft clean, modern, and user-focused websites that help brands stand out and connect with the right audience.",
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
  email: "hello@alexmorgan.design",
  emailLabel: "hello@alexmorgan.design",
  website: "www.alexmorgan.design",
  websiteLabel: "www.alexmorgan.design",
  instagram: "https://instagram.com/alexmorgan",
  vimeo: "https://vimeo.com/alexmorgan",
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
    title: "Avenue & Co.",
    category: "Luxury Fashion Brand",
    description:
      "A travel piece shot across three continents, edited to follow the arc of the journey rather than the itinerary.",
    image: "/project-02.png",
    videoUrl: "",
    youtubeId: "eRsGyueVLvQ",
    url: "#projects",
  },
  {
    number: "03",
    title: "The Journal",
    category: "Editorial Platform",
    description:
      "A music video where the cut lives inside the beat — every transition lands on the downbeat.",
    image: "/project-03.png",
    videoUrl: "",
    youtubeId: "R6MlUcmOul8",
    url: "#projects",
  },
  {
    number: "04",
    title: "Fuel Performance",
    category: "Sports Nutrition Brand",
    description:
      "Consistent, punchy YouTube editing that keeps the audience past the three-second mark, every episode.",
    image: "/project-04.png",
    videoUrl: "",
    youtubeId: "WhWc3b3KhnY",
    url: "#projects",
  },
  {
    number: "05",
    title: "Northwind Studio",
    category: "Brand Identity Studio",
    description:
      "A complete brand system for a sustainable architecture studio, built on restraint and material honesty.",
    image: "/project-05.png",
    videoUrl: "",
    youtubeId: "Y-rmzh0PI3c",
    url: "#projects",
  },
  {
    number: "06",
    title: "Lumen Health",
    category: "Healthcare App",
    description:
      "Mobile app for mental wellness tracking and guided meditation, designed for calm and clarity.",
    image: "/project-06.png",
    videoUrl: "",
    youtubeId: "mN0zPOpADL4",
    url: "#projects",
  },
  {
    number: "07",
    title: "Atlas Travel",
    category: "Travel Platform",
    description:
      "A booking platform for curated independent hotels, with a focus on discovery and trust.",
    image: "/project-07.png",
    videoUrl: "",
    youtubeId: "SkVqJ1SGeL0",
    url: "#projects",
  },
  {
    number: "08",
    title: "Verde Market",
    category: "Organic E-Commerce",
    description:
      "Online marketplace for local organic produce delivery, connecting growers and neighbors.",
    image: "/project-08.png",
    videoUrl: "",
    youtubeId: "TLkA0RELQ1g",
    url: "#projects",
  },
];

// ---------- Software / tools ----------
export const software = [
  "Figma",
  "Adobe Creative Suite",
  "Webflow",
  "VS Code",
  "WordPress",
];

// ---------- Skills with progress ----------
export const skills = [
  { name: "UI / UX DESIGN", level: 95 },
  { name: "WEB DEVELOPMENT", level: 90 },
  { name: "BRANDING", level: 85 },
  { name: "RESPONSIVE DESIGN", level: 90 },
  { name: "INTERACTION DESIGN", level: 80 },
  { name: "CMS (WORDPRESS)", level: 85 },
];

// ---------- Services / Principles ----------
export const services = [
  {
    number: "01",
    title: "USER-CENTERED DESIGN",
    description: "Focus on creating seamless and meaningful user experiences.",
  },
  {
    number: "02",
    title: "CLEAN & MODERN CODE",
    description: "High-quality, scalable, and performant development.",
  },
  {
    number: "03",
    title: "FULLY RESPONSIVE",
    description: "Websites that look and work perfectly on any device.",
  },
  {
    number: "04",
    title: "PERFORMANCE DRIVEN",
    description: "Speed, SEO, and best practices built into every project.",
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
      "Alex is an incredible designer. He understood our vision perfectly and delivered a website that exceeded our expectations.",
    author: "Jessica Lee",
    role: "Founder, Avenue & Co.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200",
  },
  {
    quote:
      "Professional, creative, and detail-oriented. The whole process was smooth from start to finish.",
    author: "David Carter",
    role: "CEO, Studio Form",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200",
  },
  {
    quote:
      "Our new website not only looks amazing but also performs exceptionally well. Highly recommended!",
    author: "James Wilson",
    role: "Marketing Director, Fuel Performance",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200",
  },
];

// ---------- Quote ----------
export const quote = {
  text: "I design and build digital experiences that are not only beautiful but also functional, intuitive, and impactful.",
  attribution: personal.name,
};

// ---------- Footer ----------
export const footerSocials = [
  { label: "Instagram", href: contact.instagram },
  { label: "Vimeo", href: contact.vimeo },
];
