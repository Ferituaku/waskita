// components/auth/slides.tsx

export type NewsSlide = {
  src: string;
  alt: string;
  title: string;
  category: string;
  date: string;
  author?: string;
  tags?: string[];
  source?: string;
  description?: string;
};

export const slides: NewsSlide[] = [
  {
    src: "/news/tot_1_waskita.jpg",
    alt: "WASKITA by StopHIVa Training on Trainers",
    title: "Training on Trainers (ToT) Warga Peduli AIDS #1",
    category: "Pelatihan",
    date: "2025-10-08",
    author: "Tim StopHIVa",
    tags: ["ToT", "Edukasi", "Peer Counselor"],
    source: "Stophiva Universitas Diponegoro",
    description:
      "Program pelatihan intensif untuk meningkatkan kapasitas peer educator dalam edukasi HIV/AIDS di komunitas.",
  },
  {
    src: "/news/tot_2_oktober_11.JPG",
    alt: "WASKITA by StopHIVa Training on Trainers",
    title: "Training on Trainers (ToT) Warga Peduli AIDS #2",
    category: "Pelatihan",
    date: "2025-10-11",
    author: "Tim StopHIVa",
    tags: ["Komunitas", "Media", "ToT"],
    source: "Stophiva Universitas Diponegoro",
    description:
      "Kolaborasi dengan berbagai komunitas dalam pembelajaran media intervensi.",
  },
];

export default slides;
