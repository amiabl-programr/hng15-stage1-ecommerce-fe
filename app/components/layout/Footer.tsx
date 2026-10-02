import { Link } from "react-router";
import { HardHat, Mail, MapPin, PhoneCall } from "lucide-react";
import {
  accountNav,
  categoryNav,
  companyNav,
  servicesNav,
  site,
  type NavItem,
} from "~/lib/site";

function NavColumn({ heading, items }: { heading: string; items: NavItem[] }) {
  return (
    <div>
      <h2 className="eyebrow mb-4">{heading}</h2>
      {items.length === 0 ? (
        <p className="text-muted text-sm">
          Categories arrive with the catalogue.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li key={`${heading}-${item.to}-${item.label}`}>
              <Link
                to={item.to}
                className="text-muted hover:text-fg text-sm transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-raised mt-auto border-t border-line">
      <div className="shell-container py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
              <HardHat aria-hidden className="text-accent size-6" />
              <span>{site.name}</span>
            </Link>
            <p className="text-muted mt-4 max-w-sm text-sm">{site.tagline}</p>

            <address className="text-muted mt-6 space-y-2.5 text-sm not-italic">
              <a
                href={`mailto:${site.email}`}
                className="hover:text-fg flex items-center gap-2 transition-colors"
              >
                <Mail aria-hidden className="size-4 shrink-0" />
                {site.email}
              </a>
              <a
                href={`tel:${site.phone.replace(/\s+/g, "")}`}
                className="hover:text-fg flex items-center gap-2 transition-colors"
              >
                <PhoneCall aria-hidden className="size-4 shrink-0" />
                {site.phone}
              </a>
              <p className="flex items-center gap-2">
                <MapPin aria-hidden className="size-4 shrink-0" />
                {site.address}
              </p>
            </address>
          </div>

          <NavColumn heading="Catalogue" items={categoryNav} />
          <NavColumn heading="Services" items={servicesNav} />
          <NavColumn heading="Company" items={companyNav} />
          <NavColumn heading="Account" items={accountNav} />
        </div>

        <p className="text-muted mt-12 border-t border-line pt-6 text-xs">
          &copy; {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}