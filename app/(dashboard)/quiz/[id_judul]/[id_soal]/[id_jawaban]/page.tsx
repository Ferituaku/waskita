"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const EditJawabanPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const id_judul = params?.id_judul as string;
  const id_soal = params?.id_soal as string;
  const id_jawaban = params?.id_jawaban as string;

  const [loading, setLoading] = useState(false);
  const [pertanyaan, setPertanyaan] = useState("");
  const [semuaJawaban, setSemuaJawaban] = useState<any[]>([]); // ✅ semua opsi jawaban
  const [teksJawaban, setTeksJawaban] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  // Ambil soal + semua jawaban
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch soal
      const soalRes = await fetch(`/api/quiz/soal?id_soal=${id_soal}`);
      const soalData = await soalRes.json();
      if (soalData && soalData.pertanyaan) {
        setPertanyaan(soalData.pertanyaan);
      }

      // Fetch jawaban
      const jawabanRes = await fetch(`/api/quiz/jawaban?id_soal=${id_soal}`);
      const jawabanData = await jawabanRes.json();
      setSemuaJawaban(jawabanData);

      // Cari jawaban yang sedang diedit
      const jawaban = jawabanData.find(
        (item: any) => String(item.id_jawaban) === id_jawaban
      );

      if (jawaban) {
        setTeksJawaban(jawaban.teks_jawaban);
        setIsCorrect(jawaban.is_correct === 1);
      }
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_jawaban]);

  // Simpan perubahan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/quiz/jawaban/${id_jawaban}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teks_jawaban: teksJawaban,
          is_correct: isCorrect ? 1 : 0,
        }),
      });
      router.push(`/quiz/${id_judul}/${id_soal}`);
    } catch (err) {
      console.error("Gagal update jawaban:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto">
        <h2 className="text-lg font-bold mb-2">Edit Jawaban</h2>

        {/* ✅ Tampilkan pertanyaan */}
        <p className="text-gray-700 mb-4">
          <span className="font-semibold">Soal:</span> {pertanyaan}
        </p>

        {/* ✅ Tampilkan pilihan ganda */}
        <div className="mb-6 space-y-2">
          {semuaJawaban.map((jwb) => (
            <div
              key={jwb.id_jawaban}
              className={`flex items-center gap-2 p-2 rounded-lg border ${
                String(jwb.id_jawaban) === id_jawaban
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                checked={jwb.is_correct === 1}
                readOnly
                className="radio"
              />
              <span>{jwb.teks_jawaban}</span>
              {String(jwb.id_jawaban) === id_jawaban && (
                <span className="ml-auto text-xs text-blue-600 font-semibold">
                  (sedang diedit)
                </span>
              )}
            </div>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="teks_jawaban"
                className="block text-sm font-medium text-gray-700"
              >
                Edit Teks Jawaban
              </label>
              <input
                type="text"
                id="teks_jawaban"
                value={teksJawaban}
                onChange={(e) => setTeksJawaban(e.target.value)}
                className="mt-1 block w-full input input-bordered"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_correct"
                checked={isCorrect}
                onChange={(e) => setIsCorrect(e.target.checked)}
              />
              <label htmlFor="is_correct">Jawaban benar?</label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Link
                href={`/quiz/${id_judul}/${id_soal}`}
                className="btn bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Kembali
              </Link>
              <button
                type="submit"
                className="btn bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditJawabanPage;
