import fs from "fs";
import path from "path";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";

let vectorStore: MemoryVectorStore | null = null;
const JSON_PATH = path.resolve("./documents.json");
const CACHE_PATH = path.resolve("./embeddingCache.json");

/* ================================
   🔹 1. Intent Classification
================================ */
interface Intent {
  type: string;
  confidence: number;
  keywords: string[];
}

function classifyIntent(message: string): Intent {
  const msg = message.toLowerCase().trim();
  
  const intents = [
    {
      type: "greeting",
      patterns: /(^|\s)(halo|hai|hi|hey|hello|pagi|siang|malam|yo)(\s|$)/,
      keywords: ["halo", "hai", "hi"],
    },
    {
      type: "what_is_hiv",
      patterns: /(apa itu hiv|pengertian hiv|definisi hiv|hiv itu apa|hiv adalah)/,
      keywords: ["hiv", "apa", "pengertian", "definisi"],
    },
    {
      type: "what_is_aids",
      patterns: /(apa itu aids|pengertian aids|definisi aids|aids itu apa|aids adalah)/,
      keywords: ["aids", "apa", "pengertian", "definisi"],
    },
    {
      type: "hiv_vs_aids",
      patterns: /(perbedaan hiv dan aids|beda hiv aids|hiv vs aids)/,
      keywords: ["perbedaan", "beda", "hiv", "aids"],
    },
    {
      type: "transmission",
      patterns: /(cara penularan|bagaimana menular|penularan hiv|tertular hiv|penularan aids|bisa menular)/,
      keywords: ["penularan", "menular", "tertular", "cara"],
    },
    {
      type: "prevention",
      patterns: /(cara mencegah|pencegahan|hindari|cegah hiv|prevent)/,
      keywords: ["cegah", "pencegahan", "hindari", "prevent"],
    },
    {
      type: "treatment",
      patterns: /(cara mengobati|pengobatan|obat hiv|arv|terapi|cara mengatasi)/,
      keywords: ["obat", "pengobatan", "arv", "terapi", "mengatasi"],
    },
    {
      type: "symptoms",
      patterns: /(gejala|tanda-tanda|ciri-ciri|symptom)/,
      keywords: ["gejala", "tanda", "ciri"],
    },
    {
      type: "testing",
      patterns: /(tes hiv|cek hiv|periksa hiv|dimana tes|test hiv)/,
      keywords: ["tes", "cek", "periksa", "test"],
    },
    {
      type: "living_with_hiv",
      patterns: /(hidup dengan hiv|odha|penderita hiv|living with)/,
      keywords: ["hidup", "odha", "penderita"],
    },
    {
      type: "wpa",
      patterns: /(wpa|warga peduli aids)/,
      keywords: ["wpa", "warga", "peduli"],
    },
    {
      type: "thanks",
      patterns: /(terima kasih|makasih|thanks|thank you|thx)/,
      keywords: ["terima", "makasih", "thanks"],
    },
    {
      type: "goodbye",
      patterns: /(bye|dadah|sampai jumpa|see you|goodbye)/,
      keywords: ["bye", "dadah", "jumpa"],
    },
  ];

  for (const intent of intents) {
    if (intent.patterns.test(msg)) {
      return {
        type: intent.type,
        confidence: 0.9,
        keywords: intent.keywords,
      };
    }
  }

  return { type: "unknown", confidence: 0.3, keywords: [] };
}

/* ================================
   🔹 2. Natural Response Generator
================================ */
function generateNaturalResponse(intent: Intent, context?: string): string {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  switch (intent.type) {
    case "greeting":
      return pick([
        "Halo! 👋 Senang bisa bantu kamu hari ini. Ada yang mau kamu tanyain soal HIV/AIDS?",
        "Hai! Gimana kabarnya? Ada info apa yang bisa aku bantu? 😊",
        "Halo juga! Aku siap bantu kamu cari info seputar HIV/AIDS nih 💪",
      ]);

    case "what_is_hiv":
      return pick([
        "HIV itu singkatan dari Human Immunodeficiency Virus — virus yang menyerang sistem kekebalan tubuh kita, khususnya sel CD4. Kalau dibiarkan tanpa pengobatan, sistem imun jadi lemah dan gampang kena infeksi lain.\n\n💡 Tapi kabar baiknya, HIV sekarang bisa dikontrol dengan obat ARV lho! Mau tahu lebih lanjut tentang pengobatannya?",
        
        "Jadi gini, HIV adalah virus yang melemahkan daya tahan tubuh dengan cara nyerang sel-sel imun kita. Tapi tenang, dengan pengobatan yang tepat (ARV), orang dengan HIV bisa hidup normal dan sehat kok! 💪\n\nAda yang mau ditanyain lagi tentang cara penularannya atau pencegahannya?",
        
        "HIV (Human Immunodeficiency Virus) itu virus yang bikin sistem imun kita jadi lemah. Bayangkan sistem imun kayak pasukan pertahanan tubuh — nah HIV ini melemahkan pasukannya.\n\nTapi good news! Dengan ARV, virus bisa dikontrol sampai hampir nggak terdeteksi 🎯"
      ]);

    case "what_is_aids":
      return pick([
        "AIDS itu tahap lanjut dari infeksi HIV, bukan penyakit terpisah ya. Jadi AIDS muncul kalau HIV-nya nggak diobati dan sistem imun udah sangat lemah.\n\n⚠️ Tapi penting banget diingat: Nggak semua orang dengan HIV akan sampai tahap AIDS! Kalau rutin minum ARV, virus bisa tetap terkontrol dan nggak sampai AIDS.\n\nMau tahu bedanya HIV sama AIDS?",
        
        "AIDS (Acquired Immune Deficiency Syndrome) adalah kondisi ketika HIV udah bikin sistem imun sangat lemah, sehingga muncul infeksi oportunistik atau penyakit serius lainnya.\n\nKabar baiknya: Dengan pengobatan modern, kebanyakan orang dengan HIV nggak akan sampai ke tahap AIDS 💪\n\nAda pertanyaan lain?",
      ]);

    case "hiv_vs_aids":
      return pick([
        "Bagus nih pertanyaannya! Banyak yang masih bingung soal ini.\n\n🦠 **HIV** = Virus penyebabnya\n🏥 **AIDS** = Tahap lanjut infeksinya\n\nAnalogi simpelnya: HIV kayak bibit penyakit, AIDS kayak penyakitnya yang udah parah. Jadi semua orang dengan AIDS pasti punya HIV, tapi TIDAK semua orang dengan HIV akan kena AIDS!\n\nDengan pengobatan ARV yang teratur, ODHA bisa hidup sehat tanpa sampai ke tahap AIDS 🎯",
        
        "Oke, ini beda mendasarnya:\n\n• HIV itu virusnya — yang masuk ke tubuh dan nyerang sistem imun\n• AIDS itu kondisi yang muncul kalau HIV-nya dibiarkan dan sistem imun udah hancur\n\nJadi HIV → (tanpa pengobatan) → AIDS\n\nTapi dengan ARV, rantai ini bisa diputus! Makanya pengobatan dini itu penting banget 💊"
      ]);

    case "transmission":
      return pick([
        "Penularan HIV itu lewat **cairan tubuh tertentu** yang mengandung virus dalam jumlah tinggi, yaitu:\n\n🔴 Darah\n💧 Cairan sperma\n💧 Cairan vagina  \n🍼 ASI (Air Susu Ibu)\n\n❌ **TIDAK menular lewat:**\n• Bersalaman atau pelukan\n• Berbagi alat makan\n• Gigitan nyamuk\n• Keringat atau air liur\n• Toilet umum\n\nJadi tenang aja, interaksi sehari-hari sama ODHA itu aman kok! 🤝\n\nMau tahu cara pencegahannya?",
        
        "HIV menular lewat kontak dengan cairan tubuh yang terinfeksi. Cara penularan utamanya:\n\n1️⃣ Hubungan seks tanpa kondom\n2️⃣ Berbagi jarum suntik\n3️⃣ Dari ibu ke bayi (saat hamil, lahir, atau menyusui)\n4️⃣ Transfusi darah yang tidak aman\n\nYang penting diingat: HIV nggak menular lewat kontak kasual seperti jabat tangan, pelukan, atau pakai toilet yang sama ya! 🙌\n\nAda yang mau ditanyain lagi?"
      ]);

    case "prevention":
      return pick([
        "Pencegahan HIV itu sebenarnya simpel kok! Ini beberapa cara efektifnya:\n\n✅ Gunakan kondom saat berhubungan seks\n✅ Jangan berbagi jarum suntik\n✅ Pastikan darah transfusi sudah di-screening\n✅ Tes HIV secara rutin (terutama kalau berisiko)\n✅ Ibu hamil dengan HIV konsumsi ARV biar nggak menular ke bayi\n\n💊 Ada juga PrEP (Pre-Exposure Prophylaxis) — obat pencegahan untuk orang yang berisiko tinggi.\n\nIngat: Pencegahan itu investasi kesehatan! 🛡️",
        
        "Cara cegah HIV itu ada banyak, dan semuanya efektif kalau dilakukan konsisten:\n\n🔹 **Seks aman** - Pakai kondom dengan benar\n🔹 **Hindari narkoba suntik** - Atau minimal pakai jarum steril\n🔹 **Tes rutin** - Tahu status HIV kamu dan pasangan\n🔹 **Edukasi** - Pahami cara penularan yang benar\n\nKalau kamu atau pasangan HIV positif, konsumsi ARV rutin juga bisa cegah penularan lho! (U=U: Undetectable = Untransmittable) 🎯"
      ]);

    case "treatment":
      return pick([
        "Pengobatan HIV sekarang udah sangat maju! 🎉\n\n💊 **ARV (Antiretroviral)** adalah obat utamanya. ARV bekerja dengan cara:\n• Menghambat perkembangan virus HIV\n• Menjaga sistem imun tetap kuat\n• Menekan jumlah virus sampai tidak terdeteksi\n\nYang penting: **Konsumsi rutin dan konsisten!** Dengan disiplin minum ARV, ODHA bisa:\n✨ Hidup normal dan produktif\n✨ Umur panjang kayak orang tanpa HIV\n✨ Nggak menularkan ke orang lain (kalau viral load undetectable)\n\nPengobatan gratis di Puskesmas atau RS rujukan lho! 🏥",
        
        "Kabar baiknya, HIV sekarang bisa dikontrol dengan sangat baik! 💪\n\nObat ARV modern:\n• Cukup 1-2 tablet per hari\n• Efek samping minimal\n• Efektivitas tinggi\n• Gratis dari pemerintah!\n\nKuncinya: **Rutin dan konsisten**. Kalau disiplin, virus HIV bisa ditekan sampai hampir nggak ada (undetectable). Artinya:\n🎯 Tetap sehat\n🎯 Tidak menular ke orang lain\n🎯 Bisa punya keluarga normal\n\nMau info tentang dimana bisa akses pengobatan?"
      ]);

    case "testing":
      return pick([
        "Tes HIV itu penting dan mudah kok! 🏥\n\n📍 **Dimana bisa tes:**\n• Puskesmas\n• Rumah Sakit (bagian VCT/PDP)\n• Klinik swasta\n• Layanan tes mobile\n\n💰 **Biaya:** Gratis di banyak layanan pemerintah!\n\n⏱️ **Prosesnya:** Cepat (10-30 menit), cuma ambil sampel darah sedikit.\n\n🔒 **Kerahasiaan:** Dijamin rahasia sesuai etika medis.\n\nKapan terakhir kamu tes? Kalau udah lebih dari setahun atau punya faktor risiko, ayo tes lagi! 💉",
        
        "Mau tes HIV? Gampang kok prosesnya! \n\nKamu bisa ke:\n✅ Puskesmas terdekat (biasanya gratis)\n✅ RS dengan layanan VCT (Voluntary Counseling & Testing)\n✅ Klinik kesehatan\n\nProsesnya:\n1. Konseling pre-test (penjelasan)\n2. Ambil sampel darah (sedikit aja)\n3. Tunggu hasil (20-30 menit)\n4. Konseling post-test (penjelasan hasil)\n\nRahasia terjamin 100%! Dan kalau hasilnya positif, kamu langsung dapat pendampingan untuk mulai pengobatan 💪"
      ]);

    case "living_with_hiv":
      return pick([
        "ODHA (Orang Dengan HIV/AIDS) bisa hidup normal dan bahagia kok! 💪\n\n**Tips hidup sehat dengan HIV:**\n\n🏃 **Fisik:**\n• Minum ARV teratur (paling penting!)\n• Olahraga rutin\n• Makan bergizi\n• Istirahat cukup\n\n💭 **Mental & Sosial:**\n• Gabung support group\n• Cerita ke orang terpercaya\n• Tetap produktif dan berkarya\n• Jangan malu minta bantuan\n\n❤️ **Fakta penting:**\n• Bisa bekerja normal\n• Bisa menikah dan punya anak (dengan pengobatan yang tepat)\n• Harapan hidup sama dengan orang tanpa HIV\n\nYang penting: Jangan berhenti minum ARV dan tetap positif! 🌟",
        
        "Dengan pengobatan modern, ODHA bisa punya kualitas hidup yang sama baiknya dengan orang lain! 🎯\n\nYang perlu dilakukan:\n\n1️⃣ **Disiplin ARV** - Ini kunci utamanya\n2️⃣ **Pola hidup sehat** - Makan sehat, olahraga, hindari rokok/alkohol\n3️⃣ **Cek rutin** - Pantau viral load & CD4 secara berkala\n4️⃣ **Support system** - Kelilingi diri dengan orang yang supportive\n5️⃣ **Stay informed** - Terus update info tentang HIV\n\nIngat: HIV bukan akhir segalanya, tapi awal perjalanan hidup yang lebih aware 💚"
      ]);

    case "wpa":
      return pick([
        "WPA (Warga Peduli AIDS) itu keren banget perannya! ❤️\n\n**Apa itu WPA?**\nKelompok relawan dari masyarakat yang peduli sama isu HIV/AIDS.\n\n**Peran WPA:**\n🎯 Edukasi masyarakat tentang HIV/AIDS\n🤝 Dampingi dan support ODHA\n💪 Kurangi stigma dan diskriminasi\n📢 Sosialisasi pencegahan & tes HIV\n🏘️ Bangun lingkungan yang inklusif\n\n**Kenapa penting?**\nMereka jadi jembatan antara layanan kesehatan dengan masyarakat. Banyak ODHA yang terbantu berkat dukungan WPA!\n\nTertarik jadi WPA? Hubungi Puskesmas atau Dinkes daerahmu! 🌟"
      ]);

    case "thanks":
      return pick([
        "Sama-sama! 🤗 Senang bisa bantu. Kalau ada pertanyaan lagi, jangan sungkan ya!",
        "Anytime! Semoga informasinya bermanfaat. Ada lagi yang mau ditanyain? 😊",
        "Sama-sama! Aku di sini kalau kamu butuh info lagi 💪",
      ]);

    case "goodbye":
      return pick([
        "Dadah! Jaga kesehatan selalu ya 🌈 Semoga harimu menyenangkan!",
        "Sampai jumpa! Stay safe and stay informed 💪✨",
        "Bye-bye! Ingat, pengetahuan adalah kunci pencegahan. See you! 👋",
      ]);

    default:
      // Kalau ada context dari dokumen, format dengan natural
      if (context && context.length > 50) {
        // Ambil poin-poin penting dan format ulang
        const formatted = formatDocumentContext(context);
        return formatted;
      }
      return "";
  }
}

/* ================================
   🔹 3. Format Document Context
================================ */
function formatDocumentContext(rawContent: string): string {
  // Clean up
  let content = rawContent.trim();
  
  // Kalau terlalu panjang, ringkas
  if (content.length > 600) {
    content = content.substring(0, 600) + "...";
  }
  
  // Tambah pembuka yang natural
  const openers = [
    "Berdasarkan info yang aku punya,",
    "Oke, ini yang aku temukan:",
    "Jadi gini,",
    "Nah, tentang ini nih:",
  ];
  
  const opener = openers[Math.floor(Math.random() * openers.length)];
  
  // Format response
  return `${opener}\n\n${content}\n\n💡 Ada yang mau ditanyain lagi tentang ini?`;
}

/* ================================
   🔹 4. Text Preprocessing
================================ */
function preprocessIndonesianText(text: string): string {
  let processed = text.toLowerCase();
  processed = processed.replace(/[.,!?;:()]/g, " ");
  processed = processed.replace(/\s+/g, " ").trim();
  
  const stopwords = [
    "yang", "di", "ke", "dari", "dan", "atau", "dengan", "untuk", 
    "pada", "oleh", "adalah", "itu", "ini", "saya", "kamu", "aku",
    "ya", "kok", "sih", "dong", "deh", "loh", "kan", "aja", "juga"
  ];
  
  const words = processed.split(" ");
  const filtered = words.filter(word => 
    word.length > 2 && !stopwords.includes(word)
  );
  
  return filtered.join(" ");
}

/* ================================
   🔹 5. Keyword Matching
================================ */
function keywordSearch(query: string, documents: any[]): any[] {
  const queryWords = preprocessIndonesianText(query).split(" ");
  
  const scored = documents.map(doc => {
    const docText = preprocessIndonesianText(doc.content);
    let score = 0;
    
    queryWords.forEach(word => {
      const regex = new RegExp(word, "gi");
      const matches = docText.match(regex);
      if (matches) {
        score += matches.length * 2; // Bobot lebih tinggi
      }
    });
    
    return { ...doc, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

/* ================================
   🔹 6. CachedEmbeddings
================================ */
class CachedEmbeddings extends Embeddings {
  private cachedEmbeddings: number[][];

  constructor(params?: EmbeddingsParams) {
    super(params ?? {});
    if (!fs.existsSync(CACHE_PATH)) {
      throw new Error("❌ File embeddingCache.json tidak ditemukan");
    }
    this.cachedEmbeddings = JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    return this.cachedEmbeddings.slice(0, documents.length);
  }

  async embedQuery(text: string): Promise<number[]> {
    const avgEmbedding = this.cachedEmbeddings[0].map((_, i) => {
      const sum = this.cachedEmbeddings.slice(0, 5).reduce((acc, emb) => acc + emb[i], 0);
      return sum / Math.min(5, this.cachedEmbeddings.length);
    });
    return avgEmbedding;
  }
}

/* ================================
   🔹 7. Initialize Vector Store
================================ */
async function initializeVectorStore() {
  if (vectorStore) return vectorStore;

  if (!fs.existsSync(JSON_PATH))
    throw new Error("❌ File documents.json tidak ditemukan");

  const rawData = fs.readFileSync(JSON_PATH, "utf-8");
  const docsData: { title: string; content: string }[] = JSON.parse(rawData);
  const allTexts = docsData.map((d) => d.content);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
    separators: ["\n\n", "\n", ". ", "! ", "? ", " "]
  });

  const docs = await splitter.createDocuments(allTexts);
  const embeddings = new CachedEmbeddings();
  vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  console.log(`✅ VectorStore siap dengan ${docs.length} chunks`);
  return vectorStore;
}

/* ================================
   🔹 8. Hybrid Search
================================ */
async function hybridSearch(
  query: string, 
  store: MemoryVectorStore
): Promise<string | null> {
  const processedQuery = preprocessIndonesianText(query);
  
  // Coba semantic search
  const semanticResults = await store.similaritySearchWithScore(query, 5);
  const goodResults = semanticResults.filter(([doc, score]) => score > 0.5);
  
  if (goodResults.length > 0) {
    return goodResults[0][0].pageContent;
  }
  
  // Fallback ke keyword
  const rawData = fs.readFileSync(JSON_PATH, "utf-8");
  const docsData = JSON.parse(rawData);
  const keywordResults = keywordSearch(query, docsData);
  
  if (keywordResults.length > 0 && keywordResults[0].score > 3) {
    return keywordResults[0].content;
  }
  
  return null;
}

/* ================================
   🔹 9. Main Handler
================================ */
export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message)
      return new Response(JSON.stringify({ error: "Message required" }), {
        status: 400,
      });

    const text = message.trim();
    
    // ✅ 1. Classify intent
    const intent = classifyIntent(text);
    
    // ✅ 2. Coba generate dari NLP patterns dulu
    const nlpResponse = generateNaturalResponse(intent);
    
    if (nlpResponse) {
      return new Response(JSON.stringify({ answer: nlpResponse }), {
        status: 200,
      });
    }

    // ✅ 3. Kalau NLP nggak dapat, cari di dokumen
    const store = await initializeVectorStore();
    const searchResult = await hybridSearch(text, store);

    if (!searchResult) {
      // Response yang lebih helpful
      const fallbackResponses = [
        `Hmm, aku belum bisa nemuin info spesifik tentang "${text}" di database-ku 🤔\n\nCoba tanya dengan cara lain, atau mungkin tanya hal lain tentang HIV/AIDS? Misalnya:\n• Apa itu HIV?\n• Cara penularan HIV\n• Pengobatan HIV\n• Cara mencegah HIV`,
        
        `Wah, pertanyaan yang bagus! Tapi kayaknya aku belum punya info lengkap tentang ini.\n\nKalau kamu mau tahu tentang:\n✨ Dasar-dasar HIV/AIDS\n✨ Cara penularan dan pencegahan\n✨ Pengobatan dan tes HIV\n\nAku siap bantu! Coba tanya salah satu topik di atas ya 😊`,
      ];
      
      return new Response(
        JSON.stringify({
          answer: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
        }),
        { status: 200 }
      );
    }

    // ✅ 4. Format hasil dari dokumen dengan natural
    const formattedAnswer = formatDocumentContext(searchResult);

    return new Response(JSON.stringify({ answer: formattedAnswer }), { 
      status: 200 
    });
    
  } catch (err: any) {
    console.error("Chatbot Error:", err);
    return new Response(
      JSON.stringify({ 
        error: "Waduh, ada error nih 😅 Coba lagi ya!" 
      }), 
      { status: 500 }
    );
  }
}