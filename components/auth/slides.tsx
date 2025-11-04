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
  {
    src: "/news/workshop-wpa.jpg",
    alt: "Foto Bersama Anggota WPA Kelurahan Tembalang",
    title:
      "Workshop Pembentukan Warga Peduli AIDS: Warga Tembalang Siap Jadi Agen Edukasi HIV AIDS",
    category: "Workshop",
    date: "2025-10-09",
    author: "Choerun Nisya",
    tags: ["wpa", "tembalang", "aids", "humaniora", "sosbud"],
    source: "Stophiva Universitas Diponegoro",
    description:
      "Tim PPK Ormawa STOPHIVA Fakultas Kesehatan Masyarakat Universitas Diponegoro menggelar Workshop Pembentukan Warga Peduli AIDS (WPA) Kelurahan Tembalang.",
  },
  {
    src: "/news/tim-stophiva-audiensi.png",
    alt: "Audiensi Tim STOPHIVA dan Karang Taruna Tembalang",
    title:
      "Bangun Komitmen Bersama, Tim STOPHIVA Audiensi dengan Karang Taruna Tembalang Soal Edukasi HIV AIDS",
    category: "Audiensi",
    date: "2025-07-20",
    author: "Surya Natanegara",
    tags: ["AIDS", "Audiensi", "edukasi", "HIV", "StopHIVa"],
    source: "LPM Publica Health",
    description:
      "Dalam memperluas jangkauan edukasi HIV AIDS di Kelurahan Tembalang, Tim PPK Ormawa STOPHIVA berkolaborasi dengan Karang Taruna Kelurahan Tembalang.",
  },
  {
    src: "/news/gelar-transfer-learning.jpeg",
    alt: "Anggota WPA Kelurahan Tembalang bersama Tim PPK Ormawa STOPHIVA",
    title:
      "Dari UNDIP untuk Warga: WPA Kelurahan Tembalang Gelar Transfer Learning Seputar HIV AIDS",
    category: "Pengabdian Masyarakat",
    date: "2025-09-30",
    author: "Direktorat Jejaring Media, Komunitas, dan Komunikasi Publik",
    tags: ["UNDIP", "WPA", "Tembalang", "HIV", "AIDS", "Transfer Learning"],
    source: "Universitas Diponegoro",
    description:
      "Warga Peduli AIDS (WPA) Kelurahan Tembalang yang diinisiasi oleh Tim PPK Ormawa STOPHIVA dari Fakultas Kesehatan Masyarakat Universitas Diponegoro, sukses menggelar kegiatan transfer learning tentang HIV AIDS untuk warga Tembalang.",
  },
  {
    src: "/news/Interview-ppk-stophiva.jpg",
    alt: "Program Indepth Interview PPK STOPHIVA di Kelurahan Tembalang",
    title:
      "In-depth Interview PPK STOPHIVA di Tembalang Jadi Pondasi Pembentukan Warga Peduli AIDS",
    category: "Wawancara",
    date: "2025-10-09",
    author: "Ghina Zalfaronaa",
    tags: [
      "PPK ORMAWA",
      "Universitas Diponegoro",
      "FKM UNDIP",
      "STOPHIVA",
      "Semarang",
    ],
    source: "NNC Netralnews",
    description:
      "Sebagai langkah awal dalam pembentukan Warga Peduli AIDS (WPA) di Kelurahan Tembalang, Tim PPK Ormawa STOPHIVA melakukan kegiatan in-depth interview kepada masyarakat.",
  },
];

export default slides;
