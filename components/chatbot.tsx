"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Loader2, Sparkles, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState<string | null>(null);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "🇮🇩 Halo! Aku asisten virtual Waskita. Ada yang bisa aku bantu hari ini?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: data.answer || "⚠️ Maaf, aku belum punya jawaban untuk itu.",
        },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Ups, koneksi bermasalah. Coba lagi nanti ya!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAsk = (text: string) => {
    setInput(text);
    setTimeout(() => handleSend(), 200);
  };

  return (
    <>
      {/* 🔴 Floating Button */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.15 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-400 text-white p-4 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.5)] transition-all"
        >
          <MessageCircle size={26} />
        </motion.button>
      )}

      {/* 💬 Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 130, damping: 12 }}
            className="fixed bottom-6 right-6 w-[22rem] h-[28rem] bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-red-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-700 to-red-500 text-white flex justify-between items-center px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="animate-pulse" />
                <h2 className="font-semibold text-sm">Asisten Waskita</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Chat */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-[13px] bg-gradient-to-b from-white to-red-50">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    msg.sender === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`relative ${
                      msg.sender === "bot"
                        ? "bg-white border border-red-200 text-gray-800"
                        : "bg-gradient-to-r from-red-600 to-red-500 text-white"
                    } px-3 py-2 rounded-2xl shadow-sm max-w-[75%] leading-snug`}
                  >
                    {/* crop text panjang */}
                    {msg.text.length > 300 ? (
                      <div className="flex flex-col gap-1">
                        <p className="line-clamp-5 overflow-hidden">{msg.text}</p>
                        <button
                          onClick={() => setPopup(msg.text)}
                          className="flex items-center gap-1 text-[10px] text-red-600 hover:text-red-700 font-medium"
                        >
                          <ZoomIn size={11} /> Lihat selengkapnya
                        </button>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing */}
              {loading && (
                <div className="flex items-center space-x-1 text-gray-400 text-[11px] italic">
                  <Loader2 className="animate-spin" size={12} />
                  <span>asisten mengetik...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="flex flex-wrap gap-1 px-3 pb-2 bg-white/80 border-t border-gray-100">
              {["Apa itu HIV?", "Cara penularan?", "Apakah bisa sembuh?"].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAsk(q)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 text-[11px] rounded-full border border-red-100 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 bg-white/70 p-2 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 px-3 py-1.5 text-[13px] border border-red-200 rounded-full focus:outline-none focus:ring-1 focus:ring-red-400 bg-white"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={loading}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full px-3 py-1.5 text-[12px] shadow transition disabled:opacity-50"
              >
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup full text */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setPopup(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-md max-h-[70vh] overflow-y-auto rounded-xl shadow-lg p-5 space-y-3 text-gray-800 relative"
            >
              <button
                onClick={() => setPopup(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
              <h3 className="text-red-600 font-semibold text-base">Jawaban Lengkap</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed">{popup}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
