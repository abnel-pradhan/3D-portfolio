import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

// Simple email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ state: "error", msg: "All fields are required." });
      return;
    }
    if (!isValidEmail(form.email)) {
      setStatus({ state: "error", msg: "Please enter a valid email address." });
      return;
    }

    setStatus({ state: "loading", msg: "" });

    try {
      // Sending data to Web3Forms
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // 👇 REPLACE WITH YOUR ACTUAL WEB3FORMS ACCESS KEY 👇
          access_key: "4d1858e8-98ec-4975-8b12-1ba1cf1e3ad5",
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus({ state: "ok", msg: "Message sent! I'll get back to you soon." });
        setForm({ name: "", email: "", message: "" }); // Clear the form
      } else {
        setStatus({ state: "error", msg: data.message || "Failed to send. Please try again." });
      }
    } catch (err) {
      setStatus({ state: "error", msg: "Network error. Please try again later." });
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="relative py-24 md:py-40 border-t border-white/10"
    >
      <div className="container-x grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="section-label" data-testid="contact-label">
            005 / CONTACT
          </div>
          <h2 className="font-display text-6xl md:text-8xl mt-6 leading-[0.85] uppercase">
            Let's
            <br />
            <span className="text-[color:var(--accent)]">build.</span>
          </h2>
          <p className="mt-6 text-sm text-[color:var(--muted)] leading-relaxed max-w-sm">
            Have a project, a wild idea, or just want to say hi? Drop a line — I read every message.
          </p>
          <div className="mt-10 space-y-4 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Email</span>
              <a
                href="mailto:abnel@portfolio.dev"
                className="text-white hover:text-[color:var(--accent)] transition-colors"
              >
                abnelpradhan7@gmail.com
              </a>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Status</span>
              <span className="text-[color:var(--accent)]">● OPEN FOR WORK</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Response</span>
              <span className="text-white">&lt; 48 HRS</span>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="md:col-span-7 space-y-8"
          data-testid="contact-form-wrapper"
        >
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Name
            </label>
            <input
              data-testid="contact-name"
              className="term-input"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Email
            </label>
            <input
              data-testid="contact-email"
              type="email"
              className="term-input"
              placeholder="you@somewhere.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
              Message
            </label>
            <textarea
              data-testid="contact-message"
              rows={5}
              className="term-input resize-none"
              placeholder="Tell me what you're building..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          {status.state === "ok" && (
            <div
              data-testid="contact-success"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--accent)] border border-[color:var(--accent)]/40 px-4 py-3"
            >
              <CheckCircle2 size={14} /> {status.msg}
            </div>
          )}
          {status.state === "error" && (
            <div
              data-testid="contact-error"
              className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-red-400 border border-red-400/40 px-4 py-3"
            >
              <AlertCircle size={14} /> {status.msg}
            </div>
          )}

          <button
            onClick={submit}
            data-testid="contact-submit"
            disabled={status.state === "loading"}
            className="btn-sharp btn-primary disabled:opacity-50"
          >
            {status.state === "loading" ? "Sending..." : "Send Message"}
            <ArrowUpRight size={14} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}