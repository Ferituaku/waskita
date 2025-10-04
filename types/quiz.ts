export interface Judul {
  id_judul: number;
  judul: string;
  tanggal_terbuat?: string | Date;
  jumlah_registrasi?: number;
  cover?: string | null;
  questionCount?: number;
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
  is_correct: boolean | number;
}

export interface QuizResult {
  id: number;
  nama: string;
  tanggal: string;
  nilai: number;
}

// For the batch update endpoint
export interface BatchUpdatePayload {
  // CORRECTED: This type MUST be Soal[] to include the temporary id_soal
  // for linking new answers to new questions.
  questions_to_add: Soal[];
  questions_to_update: Soal[];
  questions_to_delete: number[]; // array of id_soal
  answers_to_add: Omit<Jawaban, "id_jawaban">[];
  answers_to_update: Jawaban[];
  answers_to_delete: number[]; // array of id_jawaban
}

