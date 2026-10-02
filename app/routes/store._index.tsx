import type { Route } from "./+types/store._index";
import { Link } from "react-router";
import { ArrowRight, HardHat } from "lucide-react";
import { buttonClasses } from "~/components/ui/Button";
import { Reveal } from "~/components/Reveal";
import { site } from "~/lib/site";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `${site.name} — roofing sheet, profile and fabrication` },
    {
      name: "description",
      content:
        "Roofing sheet, profile and fabrication supplied to spec, with cut-to-length and on-site roll forming.",
    },
  ];
}

export default function HomePage() {
  return (
    <>
      <section className="hero-animate border-b border-line bg-raised">
        <div className="shell-container py-20 sm:py-28">
          <p className="eyebrow">Roofing sheet &amp; fabrication</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
            Profiles, sheets and fabrication, supplied to spec.
          </h1>
          <p className="text-muted mt-6 max-w-xl text-base">
            Cut to length, delivered on site, and rolled on site when the run is too
            short to ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className={buttonClasses({ size: "lg" })}>
              Browse products
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              to="/fabrication"
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              Request fabrication
            </Link>
          </div>
        </div>
      </section>

      <Reveal as="section" className="shell-container py-16">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            { title: "Warranty", body: "Manufacturer warranty on every profile and sheet." },
            { title: "Delivery", body: "Nationwide delivery, or collect from the yard." },
            { title: "On-site roll forming", body: "Roll forming on site for short runs." },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="text-base">{item.title}</h2>
              <p className="text-muted mt-2 text-sm">{item.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal as="section" stagger className="bg-raised border-t border-line">
        <div className="shell-container flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <HardHat aria-hidden className="text-accent size-8" />
            <h2 className="mt-4 text-2xl">Need a profile that is not listed?</h2>
            <p className="text-muted mt-2 max-w-prose text-sm">
              Send us the section you need and we will quote the fabrication.
            </p>
          </div>
          <Link
            to="/fabrication"
            className={buttonClasses({ variant: "secondary", size: "lg" })}
          >
            Start a fabrication request
          </Link>
        </div>
      </Reveal>
    </>
  );
}