"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const recipient = "prajwalkoirala05@gmail.com";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `Portfolio inquiry from ${name || "a visitor"}`;
    const body = [
      "Hi Prajwal,",
      "",
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      "",
      "Project details:",
      message || "-",
    ].join("\n");

    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-white/70">Your name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jane Doe"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/60"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-white/70">Your email</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="jane@company.com"
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-emerald-400/60"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm text-white/70">Project details</span>
        <textarea
          name="message"
          rows={7}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell me about the product, timeline, or what you need help with."
          className="resize-none rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-cyan-400/60"
        />
      </label>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button
          type="submit"
          className="h-11 rounded-full bg-white px-6 text-black hover:bg-white/90"
        >
          Open Email Draft
          <Send className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-sm text-white/45">
          This opens your email app with your message pre-filled.
        </p>
      </div>
    </form>
  );
}
