"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const SoalDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const id_judul = params?.id_judul as string;
  const id_soal = params?.id_soal as string;

  const [loading, setLoading] = useState(false);
  const [soal, setSoal] = useState<any>(null);
  const [jawabanList, setJawabanList] = useState<any[]>([]);

  // Fetch soal + jawaban
  const fetchData = async () => {
    setLoading(true);
    try {
      // Ambil soal
      const resSoal = await fetch(`/api/quiz/soal?id_judul=${id_judul}`);
      const dataSoal = await resSoal.json();
      const detailSoal = dataSoal.find(
        (item: any) => String(item.id_soal) === id_soal
      );
      setSoal(detailSoal);

      // Ambil jawaban
      const resJawaban = await fetch(`/api/quiz/jawaban?id_soal=${id_soal}`);
      const dataJawaban = await resJawaban.json();
      setJawabanList(dataJawaban);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_soal]);

  // Hapus jawaban
  const handleDelete = async (id_jawaban: number) => {
    if (!confirm("Yakin ingin menghapus jawaban ini?")) return;
    try {
      await fetch(`/api/quiz/jawaban/${id_jawaban}`, { method: "DELETE" });
      fetchData(); // refresh list
    } catch (err) {
      console.error("Gagal hapus jawaban:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Soal */}
            <h2 className="text-xl font-bold mb-4">
              Soal: {soal?.pertanyaan}
            </h2>

            {/* List Jawaban */}
            <h3 className="text-lg font-semibold mb-2">Jawaban:</h3>
            <ul className="space-y-2">
              {jawabanList.map((jwb) => (
                <li
                  key={jwb.id_jawaban}
                  className={`flex items-center justify-between p-2 border rounded-lg ${
                    jwb.is_correct === 1
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <span>{jwb.teks_jawaban}</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/quiz/${id_judul}/${id_soal}/${jwb.id_jawaban}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(jwb.id_jawaban)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Tombol kembali */}
            <div className="mt-6 flex justify-end">
              <Link
                href={`/quiz/${id_judul}`}
                className="btn bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Kembali
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SoalDetailPage;
