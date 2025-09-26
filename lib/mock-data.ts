// app/lib/mock-data.ts

// Definisikan tipe data sesuai skema database
export interface Judul {
    id_judul: number;
    judul: string;
    tanggal_terbuat: Date;
    cover: string; // path to image
}

export interface Soal {
    id_soal: number;
    id_judul: number;
    pertanyaan: string;
}

export interface Jawaban {
    id_jawaban: number;
    id_soal: number;
    teks_jawaban: string;
    is_correct: boolean;
}

// Data Mock untuk Tabel Judul
export const mockJudul: Judul[] = [
  { id_judul: 1, judul: "QUIZ 1: Bahaya AIDS", tanggal_terbuat: new Date('2023-01-01'), cover: 'cover1.png' },
  { id_judul: 2, judul: "QUIZ 2: Pencegahan HIV", tanggal_terbuat: new Date('2023-02-01'), cover: 'cover2.png' },
  { id_judul: 3, judul: "QUIZ 3: Mitos & Fakta", tanggal_terbuat: new Date('2023-03-01'), cover: 'cover3.png' },
];

// Data Mock untuk Tabel Soal
export const mockSoal: Soal[] = [
    // Soal untuk Kuis 1
    { id_soal: 101, id_judul: 1, pertanyaan: "Apa kepanjangan dari HIV?" },
    { id_soal: 102, id_judul: 1, pertanyaan: "Bagaimana cara penularan HIV yang paling umum?" },
    // Soal untuk Kuis 2
    { id_soal: 201, id_judul: 2, pertanyaan: "Metode pencegahan HIV yang dikenal dengan sebutan 'ABC' adalah..." },
    { id_soal: 202, id_judul: 2, pertanyaan: "Apakah penggunaan kondom efektif mencegah penularan HIV?" },
    // Soal untuk Kuis 3
    { id_soal: 301, id_judul: 3, pertanyaan: "Benar atau Salah: HIV dapat menular melalui gigitan nyamuk." },
];

// Data Mock untuk Tabel Jawaban
export const mockJawaban: Jawaban[] = [
    // Jawaban untuk soal 101 (Kuis 1)
    { id_jawaban: 1001, id_soal: 101, teks_jawaban: "Human Immunodeficiency Virus", is_correct: true },
    { id_jawaban: 1002, id_soal: 101, teks_jawaban: "Human Infection Virus", is_correct: false },
    { id_jawaban: 1003, id_soal: 101, teks_jawaban: "Hepatitis Infection Virus", is_correct: false },
    { id_jawaban: 1004, id_soal: 101, teks_jawaban: "Highly Infectious Virus", is_correct: false },
    // Jawaban untuk soal 102 (Kuis 1)
    { id_jawaban: 1005, id_soal: 102, teks_jawaban: "Melalui udara", is_correct: false },
    { id_jawaban: 1006, id_soal: 102, teks_jawaban: "Berjabat tangan", is_correct: false },
    { id_jawaban: 1007, id_soal: 102, teks_jawaban: "Hubungan seksual tanpa pengaman", is_correct: true },
    { id_jawaban: 1008, id_soal: 102, teks_jawaban: "Makan bersama", is_correct: false },

    // Jawaban untuk soal 201 (Kuis 2)
    { id_jawaban: 2001, id_soal: 201, teks_jawaban: "Abstinence, Be faithful, Condom", is_correct: true },
    { id_jawaban: 2002, id_soal: 201, teks_jawaban: "Avoid, Believe, Care", is_correct: false },
    { id_jawaban: 2003, id_soal: 201, teks_jawaban: "Antivirus, Bacteria, Cure", is_correct: false },
    
    // Jawaban untuk soal 202 (Kuis 2)
    { id_jawaban: 2004, id_soal: 202, teks_jawaban: "Ya, sangat efektif jika digunakan dengan benar dan konsisten.", is_correct: true },
    { id_jawaban: 2005, id_soal: 202, teks_jawaban: "Tidak, sama sekali tidak efektif.", is_correct: false },

    // Jawaban untuk soal 301 (Kuis 3)
    { id_jawaban: 3001, id_soal: 301, teks_jawaban: "Benar", is_correct: false },
    { id_jawaban: 3002, id_soal: 301, teks_jawaban: "Salah", is_correct: true },
];
