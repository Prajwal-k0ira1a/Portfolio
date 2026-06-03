import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const email = "prajwalkoirala05@gmail.com";

const links = [
  { label: "Home", href: "/" },
  { label: "Contact", href: "/contact" },
  { label: "Library Manager", href: "https://library-frontend-taupe.vercel.app/" },
  { label: "Cinema Hub", href: "https://cinemahub-frontend.vercel.app/" },
  { label: "Mero Paalo", href: "https://meropaalo-queue-frontend.vercel.app/" },
];

export default function Footer() {
  return (
    <footer className="bg-[#121212] px-6 pb-10 pt-8 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl border-t border-white/10 pt-10 md:pt-14">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <Badge
              variant="outline"
              className="border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/50"
            >
              Available for selected work
            </Badge>
            <h2 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Designing and building frontend work that feels calm, useful, and fast.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/52">
              If you have a product idea, a redesign in progress, or a frontend role to discuss, send a note and we can take it from there.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                render={<Link href="/contact" />}
                className="h-11 rounded-full bg-white px-6 text-black hover:bg-white/90"
              >
                Contact Me
              </Button>
              <Button
                render={<a href={`mailto:${email}`} />}
                variant="ghost"
                className="h-11 rounded-full border border-white/10 bg-transparent px-5 text-white/75 hover:bg-white/5 hover:text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                {email}
              </Button>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/35">
                Location
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-white/58">
                <MapPin className="h-4 w-4" />
                Nepal
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/35">
                Links
              </p>
              <div className="mt-4 grid gap-3">
                {links.map((link) => {
                  const isExternal = link.href.startsWith("http");

                  return isExternal ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between border-b border-white/10 pb-3 text-sm text-white/58 transition hover:text-white"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex items-center justify-between border-b border-white/10 pb-3 text-sm text-white/58 transition hover:text-white"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs uppercase tracking-[0.24em] text-white/28 md:flex-row md:items-center md:justify-between">
          <p>Prajwal Koirala</p>
          <p>Full Stack Developer</p>
        </div>
      </div>
    </footer>
  );
}
