"use client";
import { useParams } from "next/navigation";
import Quiz1 from "../data/Quiz1.json";
import Quiz2 from "../data/Quiz2.json";
import App from "./edit/App";

const quizMap: Record<string, any> = {
  "1": Quiz1,
  "2": Quiz2,
  // nanti bisa tambah Quiz3 dst
};

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const quizData = quizMap[quizId];

  if (!quizData) {
    return <p>Quiz tidak ditemukan</p>;
  }

  return <App quizData={quizData} />;
}
