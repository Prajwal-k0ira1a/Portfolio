import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactCta() {
  return (
    <section className="relative z-10 bg-[#121212] px-6 pb-24 md:px-12 md:pb-32 lg:px-24">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-gradient-to-r from-white/[0.06] via-white/[0.03] to-emerald-500/[0.08] p-8 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-400/80">
              Contact
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Have a project in mind?
            </h2>
            <p className="mt-4 text-base leading-7 text-white/55 md:text-lg">
              Start with a simple message and I&apos;ll get back with the next best step.
            </p>
          </div>

          <Button
            render={<Link href="/contact" />}
            className="h-11 rounded-full bg-white px-6 text-black hover:bg-white/90"
          >
            Contact Me
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
