import { HardHat, Mail, MapPin, Phone, ShieldCheck, Truck, Wrench } from "lucide-react";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";

export function meta() {
  return [
    { title: `About Us — ${site.name}` },
    {
      name: "description",
      content:
        "Premier industrial and residential roofing manufacturer, roll-forming contractor, and structural sheet fabricator.",
    },
  ];
}

export default function AboutPage() {
  return (
    <div className="shell-container py-12 md:py-20 max-w-5xl">
      {/* Hero */}
      <div className="mb-12">
        <p className="eyebrow mb-2">Our Company</p>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-fg">
          Engineered Roofing &amp; Architectural Fabrication
        </h1>
        <p className="text-muted mt-4 text-base leading-relaxed max-w-2xl">
          We manufacture and supply high-precision aluminium, aluzinc, and stone-coated roofing sheets engineered to withstand harsh coastal and tropical climates.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid gap-6 sm:grid-cols-3 mb-16">
        <Card className="p-6 bg-raised border border-line rounded-2xl">
          <ShieldCheck className="size-8 text-accent mb-4" />
          <h2 className="text-lg font-black text-fg mb-2">Certified Grade Metal</h2>
          <p className="text-xs text-muted leading-relaxed">
            All coils are certified AZ150 zinc-aluminium coated or 0.55mm heavy gauge tempered aluminium with anti-corrosion PVDF coatings.
          </p>
        </Card>

        <Card className="p-6 bg-raised border border-line rounded-2xl">
          <Wrench className="size-8 text-accent mb-4" />
          <h2 className="text-lg font-black text-fg mb-2">Continuous Roll Forming</h2>
          <p className="text-xs text-muted leading-relaxed">
            Eliminate mid-roof lap joints. Our mobile forming mills roll seamless sheets directly on your construction site at lengths up to 30 metres.
          </p>
        </Card>

        <Card className="p-6 bg-raised border border-line rounded-2xl">
          <Truck className="size-8 text-accent mb-4" />
          <h2 className="text-lg font-black text-fg mb-2">Site Logistics</h2>
          <p className="text-xs text-muted leading-relaxed">
            Dedicated crane trucks and logistics coordination ensuring scheduled deliveries without sheet warping or edge damage.
          </p>
        </Card>
      </div>

      {/* Contact & Yards Block */}
      <section id="contact" className="rounded-2xl border border-line bg-page p-8 md:p-10">
        <h2 className="text-2xl font-black text-fg mb-6">Contact Engineering &amp; Sales</h2>

        <div className="grid gap-6 sm:grid-cols-3 text-sm">
          <div className="flex items-start gap-3">
            <Phone className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-fg block">Direct Telephone</span>
              <a href={`tel:${site.phone}`} className="text-muted hover:text-accent mt-0.5 block">
                {site.phone}
              </a>
              <span className="text-[11px] text-muted">Mon–Sat: 8:00 AM – 6:00 PM</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-fg block">Sales &amp; Inquiries</span>
              <a href={`mailto:${site.email}`} className="text-muted hover:text-accent mt-0.5 block">
                {site.email}
              </a>
              <span className="text-[11px] text-muted">Quotations &amp; drawings review</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-fg block">Fabrication Yard</span>
              <p className="text-muted mt-0.5">Plot 12 Industrial Avenue, Ikeja, Lagos State</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}