import { NextResponse } from "next/server";

// 🛡️ Simple In-Memory Rate Limiter
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 chats per minute per IP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    // Reset window
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);
  return record.count > MAX_REQUESTS_PER_WINDOW;
}

export async function POST(req: Request) {
  try {
    // 🛡️ 1. Get Client IP (Basic header check for Next.js)
    const ip = req.headers.get("x-forwarded-for") || "unknown-ip";
    
    // 🛡️ 2. Check Rate Limit
    if (isRateLimited(ip)) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { answer: "⏳ Waduh, terlalu cepat! Tunggu sebentar ya sebelum kirim pesan lagi. (Rate limit: 5 pesan/menit)" },
        { status: 429 }
      );
    }

    const { message } = await req.json();

    // 🛡️ 3. Input Validation
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be text" }, { status: 400 });
    }

    const cleanedMessage = message.trim().slice(0, 500); // ✂️ Max 500 chars

    if (cleanedMessage.length < 3) {
      return NextResponse.json(
        { answer: "🤔 Pesannya terlalu pendek. Coba ketik lebih lengkap ya?" },
        { status: 400 } // Use 200 with warning message if you want valid UI display, but 400 is semantically correct
      );
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nUrl) {
      console.error("❌ N8N_WEBHOOK_URL is not defined in .env");
      return NextResponse.json(
        { answer: "⚠️ Maaf, sistem chatbot sedang mengalami gangguan konfigurasi." },
        { status: 503 }
      );
    }

    console.log(`📡 Sending to n8n (${ip}):`, cleanedMessage.substring(0, 50) + "...");

    try {
      const n8nResponse = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: cleanedMessage }),
      });

      if (n8nResponse.ok) {
        const data = await n8nResponse.json();
        // Support various common output keys from n8n
        const aiAnswer = data.answer || data.output || data.text || data.response;

        if (aiAnswer) {
          return NextResponse.json({ answer: aiAnswer }, { status: 200 });
        } else {
            console.warn("⚠️ n8n response missing answer field:", data);
            return NextResponse.json(
                { answer: "Maaf, saya tidak dapat memproses jawaban saat ini." },
                { status: 502 }
            );
        }
      } else {
        console.error(`❌ n8n Error: ${n8nResponse.status} ${n8nResponse.statusText}`);
        return NextResponse.json(
          { answer: "Maaf, asisten virtual sedang sibuk. Coba lagi nanti ya! 🙏" },
          { status: 502 }
        );
      }
    } catch (fetchError) {
      console.error("❌ n8n Connection Failed:", fetchError);
      return NextResponse.json(
        { answer: "Maaf, terjadi kesalahan koneksi ke server AI." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Chatbot Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
