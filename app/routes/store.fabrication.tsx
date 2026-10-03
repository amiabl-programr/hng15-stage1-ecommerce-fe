import React, { useState } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  HardHat,
  PhoneCall,
  Ruler,
  Send,
  Wrench,
} from "lucide-react";
import { submitFabricationRequest } from "~/lib/api/endpoints";
import { site } from "~/lib/site";
import { ApiError } from "~/lib/api/client";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Field } from "~/components/ui/Field";
import type { ContactPreference, ServiceType } from "~/types/api";

export function meta() {
  return [
    { title: `Custom Fabrication & Roll Forming — ${site.name}` },
    {
      name: "description",
      content:
        "Request custom on-site roll forming, bespoke flashings, industrial guttering, and architectural curves.",
    },
  ];
}

export default function FabricationPage() {
  const [formData, setFormData] = useState({
    serviceType: "roof" as ServiceType,
    fullName: "",
    email: "",
    phone: "",
    city: "Lagos",
    state: "Lagos State",
    description: "",
    measurements: "",
    budget: "",
    preferredContact: "email" as ContactPreference,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "A valid email address is required";
    }
    if (!formData.phone.trim() || formData.phone.length < 5) {
      errors.phone = "Phone number is required";
    }
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.description.trim() || formData.description.trim().length < 20) {
      errors.description = "Please describe the work in at least 20 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitFabricationRequest({
        serviceType: formData.serviceType,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        description: formData.description.trim(),
        measurements: formData.measurements.trim() || undefined,
        budget: formData.budget ? parseInt(formData.budget, 10) : undefined,
        preferredContact: formData.preferredContact,
      });

      setSubmittedId(res.id);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && err.fields.length > 0) {
          const apiErrors: Record<string, string> = {};
          err.fields.forEach((f) => {
            apiErrors[f.path] = f.message;
          });
          setFieldErrors(apiErrors);
        }
        setGeneralError(err.message || "Failed to submit request. Please check inputs.");
      } else {
        setGeneralError("An unexpected network error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="shell-container py-16 max-w-2xl text-center">
        <Card className="p-8 md:p-12 bg-page border border-line rounded-2xl">
          <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="size-10" />
          </div>
          <p className="eyebrow text-emerald-600 mb-2">Request Received</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg mb-3">
            Custom Fabrication Inquiry Logged
          </h1>
          <p className="text-sm text-muted mb-6">
            Our engineering estimation team is reviewing your specifications. An engineer will get back to you within 24 hours.
          </p>

          <div className="bg-raised p-4 rounded-xl text-xs font-mono text-muted mb-8">
            Reference ID: <span className="font-bold text-fg">{submittedId}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setSubmittedId(null);
                setFormData({
                  serviceType: "roof",
                  fullName: "",
                  email: "",
                  phone: "",
                  city: "Lagos",
                  state: "Lagos State",
                  description: "",
                  measurements: "",
                  budget: "",
                  preferredContact: "email",
                });
              }}
            >
              Submit Another Request
            </Button>
            <Link to="/products">
              <Button variant="primary">Browse Catalogue</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="shell-container py-10 md:py-16 max-w-4xl">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="size-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
          <Wrench className="size-6" />
        </div>
        <p className="eyebrow mb-1">Custom Engineering</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-fg">
          Request Custom Fabrication
        </h1>
        <p className="text-sm text-muted mt-2">
          From on-site longspan roll forming to custom architectural flashings and industrial gutters.
        </p>
      </div>

      {generalError && (
        <div className="mb-8 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger flex items-start gap-3 text-sm">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Service Type Selection */}
        <Card className="p-6 bg-page border border-line rounded-2xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4">
            1. Select Required Service
          </h2>

          <div className="grid gap-3 sm:grid-cols-5">
            {[
              { id: "roof" as ServiceType, label: "Custom Roof / Longspan" },
              { id: "gutter" as ServiceType, label: "Box & Valley Gutters" },
              { id: "skylight" as ServiceType, label: "Polycarbonate Skylights" },
              { id: "cladding" as ServiceType, label: "Wall Cladding / Panels" },
              { id: "other" as ServiceType, label: "Other Metalwork" },
            ].map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, serviceType: srv.id }))}
                className={`btn-press p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                  formData.serviceType === srv.id
                    ? "border-accent bg-accent/10 text-accent ring-1 ring-accent"
                    : "border-line bg-raised text-muted hover:border-accent hover:text-fg"
                }`}
              >
                {srv.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Project Specification */}
        <Card className="p-6 bg-page border border-line rounded-2xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4">
            2. Project Details &amp; Dimensions
          </h2>

          <div className="space-y-4">
            <Field
              id="description"
              label="Detailed Work Description (minimum 20 characters)"
              error={fieldErrors.description}
              required
            >
              {(props) => (
                <textarea
                  {...props}
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your roof profile requirements, gauge preference (e.g. 0.55mm aluminium), curves, angles, or on-site forming access..."
                  className="w-full rounded-lg border border-line bg-raised py-2.5 px-3.5 text-sm focus:border-accent"
                />
              )}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="measurements" label="Key Measurements (Length, Rake, Slope, Width)">
                {(props) => (
                  <input
                    {...props}
                    name="measurements"
                    value={formData.measurements}
                    onChange={handleChange}
                    placeholder="e.g. 14 runs @ 12.5m, 2 valley gutters @ 10m"
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>

              <Field id="budget" label="Target Budget (₦, Optional)">
                {(props) => (
                  <input
                    {...props}
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g. 2500000"
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6 bg-page border border-line rounded-2xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4">
            3. Contact &amp; Site Location
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field id="fullName" label="Full Name" error={fieldErrors.fullName} required>
                {(props) => (
                  <input
                    {...props}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Engr. Kunle Adeleke"
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div>
              <Field id="email" label="Email Address" error={fieldErrors.email} required>
                {(props) => (
                  <input
                    {...props}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="kunle@construct.ng"
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div>
              <Field id="phone" label="Phone Number" error={fieldErrors.phone} required>
                {(props) => (
                  <input
                    {...props}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 802 345 6789"
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div>
              <Field id="preferredContact" label="Preferred Contact Channel">
                {(props) => (
                  <select
                    {...props}
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm font-bold focus:border-accent"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                )}
              </Field>
            </div>

            <div>
              <Field id="city" label="Project City" error={fieldErrors.city} required>
                {(props) => (
                  <input
                    {...props}
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Lekki"
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div>
              <Field id="state" label="State" error={fieldErrors.state} required>
                {(props) => (
                  <input
                    {...props}
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Lagos State"
                    className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="py-3 px-8 flex items-center gap-2 font-bold text-base"
          >
            {isSubmitting ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Inquiry...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Submit Fabrication Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}