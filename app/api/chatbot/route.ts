import fs from "fs";
import path from "path";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings"; // Import Embeddings dan EmbeddingsParams

let vectorStore: MemoryVectorStore | null = null;
const JSON_PATH = path.resolve("./documents.json");
const CACHE_PATH = path.resolve("./embeddingCache.json");

// =================================================================
// 1. Buat Class Baru yang meng-extend Embeddings dari LangChain
// =================================================================
class CachedEmbeddings extends Embeddings {
  private cachedEmbeddings: number[][];

  constructor(params?: EmbeddingsParams) {
    super(params ?? {});
    // Muat cache saat class diinisialisasi
    if (!fs.existsSync(CACHE_PATH)) {
      throw new Error(
        "❌ File embeddingCache.json tidak ditemukan saat inisialisasi CachedEmbeddings"
      );
    }
    this.cachedEmbeddings = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
  }

  // Implementasikan metode embedDocuments
  async embedDocuments(documents: string[]): Promise<number[][]> {
    console.log(`Menggunakan cache untuk ${documents.length} dokumen.`);
    // Cukup kembalikan cache yang sudah ada
    return this.cachedEmbeddings.slice(0, documents.length);
  }

  // Implementasikan metode embedQuery
  async embedQuery(text: string): Promise<number[]> {
    console.log("Menggunakan cache untuk query.");
    // Kembalikan embedding pertama dari cache sebagai representasi query
    return this.cachedEmbeddings[0] || Array(1536).fill(0);
  }
}

/* ================================
   🔹 Inisialisasi Vector Store
================================ */
async function initializeVectorStore() {
  if (vectorStore) return vectorStore;

  if (!fs.existsSync(JSON_PATH))
    throw new Error("❌ File documents.json tidak ditemukan");

  const rawData = fs.readFileSync(JSON_PATH, "utf-8");
  const docsData: { title: string; content: string }[] = JSON.parse(rawData);

  const allText = docsData.map((d) => d.content).join("\n\n");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const docs = await splitter.createDocuments([allText]);

  // 2. Buat instance dari class CachedEmbeddings yang baru
  const embeddings = new CachedEmbeddings();

  // Sekarang, `embeddings` adalah instance class yang valid dan diterima oleh fromDocuments
  vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);
  console.log("✅ VectorStore siap (lokal)");

  return vectorStore;
}

/* ================================
   🔹 2. Fungsi NLP sederhana
================================ */
function basicChatResponse(message: string): string | null {
  const msg = message.toLowerCase().trim();

  // 🔸 Sapaan
  if (/(halo|hai|hi|hey|hello|yo|pagi|siang|malam)/.test(msg))
    return "Halo juga! Senang bisa ngobrol 😊";

  // 🔸 Basa-basi
  if (/(apa kabar|gimana kabarnya|lagi apa|lagi ngapain)/.test(msg))
    return "Aku baik-baik aja! Kamu sendiri gimana nih? 😄";

  // 🔸 Terima kasih
  if (/(terima kasih|makasih|thanks|thank you)/.test(msg))
    return "Sama-sama! Senang bisa bantu 🤗";

  // 🔸 Tanya identitas
  if (/(siapa kamu|kamu siapa|lu siapa)/.test(msg))
    return "Aku chatbot asisten kamu yang suka bantu cari info dari dokumen 💡";

  // 🔸 Ucapan perpisahan
  if (/(bye|dadah|sampai jumpa|see you|goodbye)/.test(msg))
    return "Sampai jumpa lagi! Semoga harimu menyenangkan 🌞";

  return null;
}

/* ================================
   🔹 3. Handler utama API Chat
================================ */
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message)
      return new Response(JSON.stringify({ error: "Message required" }), {
        status: 400,
      });

    const text = message.trim();

    // 1️⃣ Pesan pendek → kemungkinan sapaan / basa-basi
    if (text.split(" ").length <= 3) {
      const response = basicChatResponse(text);
      if (response)
        return new Response(JSON.stringify({ answer: response }), {
          status: 200,
        });
    }

    // 2️⃣ Coba tangani small talk umum
    const smallTalk = basicChatResponse(text);
    if (smallTalk)
      return new Response(JSON.stringify({ answer: smallTalk }), {
        status: 200,
      });

    // 3️⃣ Kalau bukan, cari jawaban dari dokumen
    const store = await initializeVectorStore();
    const results = await store.similaritySearch(text, 3);

    if (results.length === 0) {
      return new Response(
        JSON.stringify({
          answer: "Maaf, aku tidak menemukan jawaban yang relevan di dokumen.",
        }),
        { status: 200 }
      );
    }

    const bestMatch = results[0].pageContent;
    const answer = `Berdasarkan dokumen, berikut informasinya:\n\n${bestMatch}`;

    return new Response(JSON.stringify({ answer }), { status: 200 });
  } catch (err: any) {
    console.error("Chatbot Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
