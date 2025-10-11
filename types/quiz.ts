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

// Updated QuizResult interface to include user data
export interface QuizResult {
  id: number;
  nama: string;
  email?: string;
  tanggal: string;
  nilai: number;
  user_id?: number;
  isRegisteredUser?: boolean;
}

// For user profile in quiz context
export interface QuizUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

// For quiz statistics
export interface QuizStatistics {
  totalParticipants: number;
  averageScore: string;
  highestScore: number;
  lowestScore: number;
  registeredUsers: number;
  guestUsers: number;
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

// For quiz submission from user
export interface QuizSubmission {
  quizId: number;
  nilai: number;
  namaPeserta?: string; // Optional, will use authenticated user's name if not provided
}
