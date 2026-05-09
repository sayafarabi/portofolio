import {
  FiGithub,
  FiLinkedin,
  FiInstagram,
  FiMail,
  FiMonitor,
  FiShoppingCart,
  FiBook,
  FiGitBranch,
  FiPlay,
  FiCalendar,
} from "react-icons/fi";

export const personalInfo = {
  name: "Rafi Achmad Farabi",
  title: "Frontend Developer & CS Student",
  description:
    "Saya adalah mahasiswa Ilmu Komputer yang bersemangat membangun pengalaman web interaktif, modern, dan responsif. Fokus pada React, Tailwind, dan UI/UX design.",
  cvLink: "/cv.pdf", // ganti dengan link CV Anda
  // Gunakan Picsum dengan seed 'raka' untuk foto profil (ukuran 300x300)
  profileImage: "/foto farabi.JPG",
  socialLinks: [
    { name: "GitHub", icon: FiGithub, url: "https://github.com/sayafarabi" },
    {
      name: "LinkedIn",
      icon: FiLinkedin,
      url: "https://www.linkedin.com/in/rafi-achmad-farabi-2b3a952b7/",
    },
    {
      name: "Instagram",
      icon: FiInstagram,
      url: "https://www.instagram.com/rafifarab1/",
    },
    { name: "Email", icon: FiMail, url: "rafifarabi21@email.com" },
  ],
};

export const aboutStats = [
  { label: "Projects", value: 15 },
  { label: "Skills", value: 12 },
  { label: "Pengalaman ( tahun)", value: 2 },
];

export const skills = [
  {
    category: "Frontend",
    items: [
      { name: "HTML", level: 95, icon: "🔹" },
      { name: "CSS", level: 90, icon: "🎨" },
      { name: "JavaScript", level: 85, icon: "📜" },
      { name: "React", level: 80, icon: "⚛️" },
      { name: "Tailwind CSS", level: 88, icon: "🌊" },
    ],
  },
  {
    category: "Tools",
    items: [
      { name: "Git", level: 85, icon: "🔧" },
      { name: "GitHub", level: 90, icon: "🐙" },
      { name: "Figma", level: 75, icon: "🖌️" },
      { name: "VS Code", level: 95, icon: "💻" },
    ],
  },
  {
    category: "Backend Dasar",
    items: [
      { name: "Node.js", level: 60, icon: "🟢" },
      { name: "Firebase", level: 70, icon: "🔥" },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "Website Seminar & Workshop",
    description:
      "Landing page interaktif untuk acara seminar kampus dengan pendaftaran online dan countdown timer.",
    tech: ["React", "Tailwind", "Framer Motion"],
    // Seed 'seminar' menghasilkan gambar abstrak bertema seminar
    image: "https://picsum.photos/seed/seminar/600/400",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "Website Toko Online",
    description:
      "Frontend e-commerce responsif dengan filter produk, keranjang belanja, dan checkout sederhana.",
    tech: ["React", "Redux", "Tailwind", "Stripe(API)"],
    image: "https://picsum.photos/seed/toko/600/400",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 3,
    title: "Sistem Manajemen Perpustakaan C++",
    description:
      "Aplikasi konsol untuk mengelola buku, anggota, dan peminjaman menggunakan struktur data linked list.",
    tech: ["C++", "OOP", "CLI"],
    image: "https://picsum.photos/seed/perpus/600/400",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 4,
    title: "Sistem Pohon Keluarga",
    description:
      "Program pohon keluarga interaktif dengan fitur tambah anggota, cari relasi, dan visualisasi teks.",
    tech: ["C++", "Tree", "Algoritma"],
    image: "https://picsum.photos/seed/pohon/600/400",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Game Flappy Bird C++",
    description:
      "Clone game Flappy Bird sederhana berjalan di terminal menggunakan library ncurses.",
    tech: ["C++", "ncurses", "Game Dev"],
    image: "https://picsum.photos/seed/flappy/600/400",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Website Event IT FEST",
    description:
      "Website informasi dan registrasi untuk acara IT Festival kampus dengan dashboard admin.",
    tech: ["Next.js", "Tailwind", "Firebase"],
    image: "https://picsum.photos/seed/itfest/600/400",
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const experienceTimeline = [
  {
    year: "2022",
    title: "Mulai Belajar HTML & CSS",
    description:
      "Memahami dasar web development, membuat halaman statis, dan mendalami Flexbox serta Grid.",
  },
  {
    year: "2023",
    title: "Belajar JavaScript",
    description:
      "Menguasai DOM manipulation, event handling, dan asynchronous programming.",
  },
  {
    year: "2023",
    title: "Project Pertama",
    description:
      "Membuat website portofolio pribadi dan aplikasi to-do list sebagai latihan.",
  },
  {
    year: "2024",
    title: "Mendalami React & Ekosistemnya",
    description:
      "Belajar React, state management, routing, dan integrasi API. Membangun beberapa proyek frontend.",
  },
  {
    year: "2024",
    title: "Membangun Portfolio Modern",
    description:
      "Merancang portofolio profesional dengan React, Tailwind, dan animasi Framer Motion.",
  },
  {
    year: "2025",
    title: "Proyek Kuliah & Kolaborasi",
    description:
      "Mengerjakan proyek tim menggunakan Git, mengimplementasikan UI/UX design, dan belajar Node.js.",
  },
];