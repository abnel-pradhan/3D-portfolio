import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Terminal, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "What can Abnel build?",
  "Tell me about NewarPrime",
  "Which projects use React?",
  "Is Abnel open for work?",
];

const SYSTEM_PROMPT = `You are Abnel's AI portfolio assistant. Abnel Pradhan is a BCA student, full-stack developer and video storyteller based in Kathmandu, Nepal.

Key facts about Abnel:
- Skills: React, Next.js, Node.js, MongoDB, Tailwind CSS, Three.js/R3F, JavaScript (ES6+), Git, Video Editing, Creative AI Tools
- Projects:
  1. NewarPrime (Flagship, 2026) — His own learn & earn platform. Users learn skills, complete missions, and earn rewards. Built end-to-end with React, Node, MongoDB, and AI.
  2. E-Commerce Platform — Production-ready storefront with product management, auth, cart and checkout. Stack: React, Node.js, MongoDB.
  3. Real-time Chat App — Low-latency WebSocket chat with rooms, presence, typing indicators. Stack: Vue.js, Socket.IO, Express.
  4. Data Visualization Dashboard — Interactive D3.js charts, filters, tooltips. Stack: HTML/CSS/JS, D3.js, Tailwind.
- Status: OPEN FOR WORK
- Email: abnel@portfolio.dev
- Response time: < 48 hours
- Currently shipping NewarPrime
- Personality: Obsessed with craft. Spends late nights on WebSocket backends, mornings color-grading video, and experimenting with AI.

Answer questions about Abnel in a direct, confident, slightly witty tone. Keep responses concise (2-4 sentences max). If asked something outside Abnel's portfolio, redirect gracefully.`;

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello — I'm Abnel's AI Assistant. Ask me anything about Abnel's skills, projects (like NewarPrime), or how to hire him.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history for API (exclude initial assistant greeting)
      const apiMessages = newMessages
        .slice(1) // skip the initial greeting since it's in system prompt context
        .map((m) => ({ role: m.role, content: m.content }));

      // Ensure we start with a user message
      const firstUserIdx = apiMessages.findIndex((m) => m.role === "user");
      const trimmedMessages = firstUserIdx >= 0 ? apiMessages.slice(firstUserIdx) : apiMessages;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: trimmedMessages.length > 0 ? trimmedMessages : [{ role: "user", content: msg }],
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const reply =
        data.content?.find((b) => b.type === "text")?.text ||
        "I couldn't generate a response. Please try again.";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Connection lost. Please try again in a moment, or use the contact form below.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <section
      id="ai"
      data-testid="ai-section"
      className="relative py-24 md:py-40 border-t border-white/10"
    >
      <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="section-label" data-testid="ai-label">
            004 / AI ASSISTANT
          </div>
          <h2 className="font-display text-5xl md:text-7xl mt-6 leading-[0.9] uppercase">
            Talk to
            <br />
            <span className="text-[color:var(--accent)]">my brain.</span>
          </h2>
          <p className="mt-6 text-sm text-[color:var(--muted)] leading-relaxed max-w-sm">
            A real Claude-powered assistant trained on Abnel's projects, skills and personality.
            Ask anything — get a straight answer.
          </p>
          <div className="mt-8 space-y-2">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)] mb-3">
              Try asking:
            </div>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s)}
                data-testid={`ai-suggestion-${i}`}
                className="w-full text-left text-xs md:text-sm px-3 py-2 border border-white/10 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors text-[color:var(--muted)] font-mono"
              >
                <span className="text-[color:var(--accent)]">›</span> {s}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="md:col-span-8 border border-white/10 bg-[color:var(--surface)]/70 backdrop-blur-md noise-bg flex flex-col h-[70vh] md:h-[600px]"
          data-testid="ai-terminal"
        >
          {/* terminal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)] font-mono">
              <Terminal size={12} className="text-[color:var(--accent)]" />
              ABNEL@PORTFOLIO ~ %
            </div>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-white/20" />
              <span className="w-2 h-2 bg-white/20" />
              <span className="w-2 h-2 bg-[color:var(--accent)]" />
            </div>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 font-mono text-sm"
            data-testid="ai-messages"
          >
            {messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className={`text-xs uppercase tracking-[0.2em] flex-shrink-0 mt-0.5 ${
                    m.role === "user" ? "text-white" : "text-[color:var(--accent)]"
                  }`}
                >
                  {m.role === "user" ? "›YOU:" : "›AI:"}
                </span>
                <p className="text-[color:var(--text)] leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 items-center text-[color:var(--accent)]">
                <span className="text-xs uppercase tracking-[0.2em]">›AI:</span>
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs text-[color:var(--muted)]">
                  thinking<span className="blink">_</span>
                </span>
              </div>
            )}
          </div>

          {/* input — using div + button instead of form to avoid nested form issues */}
          <div className="border-t border-white/10 p-3 md:p-4 flex items-center gap-3 bg-black/40">
            <span className="text-[color:var(--accent)] font-mono text-sm">›</span>
            <input
              data-testid="ai-input"
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={loading}
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/30 font-mono text-sm"
            />
            <button
              onClick={() => send()}
              data-testid="ai-send"
              disabled={loading || !input.trim()}
              className="btn-sharp btn-primary py-2 px-3 disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}