import Link from "next/link";
import type { Metadata } from "next";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Prajwal Koirala",
  description: "Get in touch with Prajwal Koirala about frontend projects, freelance work, and collaborations.",
};

const email = "prajwalkoirala05@gmail.com";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#121212] px-6 py-10 text-white md:px-12 lg:px-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center justify-between gap-4">
          <Button
            render={<Link href="/" />}
            variant="ghost"
            className="w-fit text-white/70 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back Home
          </Button>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
          >
            <Mail className="h-4 w-4" />
            {email}
          </a>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 shadow-2xl backdrop-blur-md md:p-10">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-emerald-400/80">
              Contact
            </p>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight md:text-6xl">
              Let&apos;s build something clear, fast, and useful.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
              Use the form below to open a pre-filled email draft, or reach out directly with the links on this page.
            </p>
            <ContactForm />
          </div>

          <aside className="grid gap-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-400/80">
                Direct
              </p>
              <a
                href={`mailto:${email}`}
                className="mt-5 block text-2xl font-semibold tracking-tight text-white transition hover:text-emerald-400"
              >
                {email}
              </a>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Best for freelance opportunities, collaborations, and frontend product work.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-white/70">
                Availability
              </p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-white">
                Open to select projects and long-term product work.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/60">
                If you already know the scope, include timeline, goals, and current stack in your message.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
