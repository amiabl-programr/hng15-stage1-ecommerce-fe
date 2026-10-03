import type { Route } from "./+types/admin.products.new";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AlertCircle, ArrowLeft, Check, HardHat, PackagePlus } from "lucide-react";
import { createAdminProduct, getAdminCategories } from "~/lib/api/endpoints";
import { site } from "~/lib/site";
import { ApiError } from "~/lib/api/client";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Field } from "~/components/ui/Field";
import type { Category, ProfileKind, ProductType, UnitType } from "~/types/api";

export function meta() {
  return [{ title: `New Product — ${site.name} Admin` }];
}

export default function NewProductPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    profileKind: "longspan" as ProfileKind,
    productType: "dimensioned" as ProductType,
    unitType: "metre" as UnitType,
    basePrice: "4500",
    minOrderQuantity: "1",
    categoryId: "",
    isActive: true,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAdminCategories()
      .then((res) => setCategories(res.items || []))
      .catch(() => {});
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
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
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.slug.trim()) errors.slug = "Product slug is required";
    if (!formData.basePrice || parseInt(formData.basePrice, 10) < 0) {
      errors.basePrice = "A valid base price in Naira is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createAdminProduct({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        profileKind: formData.profileKind,
        productType: formData.productType,
        unitType: formData.unitType,
        basePrice: parseInt(formData.basePrice, 10),
        minOrderQuantity: parseInt(formData.minOrderQuantity, 10) || 1,
        categoryId: formData.categoryId || undefined,
        isActive: formData.isActive,
      });

      navigate(`/admin/products/${res.product.id}/images`);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && err.fields.length > 0) {
          const apiErrors: Record<string, string> = {};
          err.fields.forEach((f) => {
            apiErrors[f.path] = f.message;
          });
          setFieldErrors(apiErrors);
        }
        setGeneralError(err.message || "Failed to create product.");
      } else {
        setGeneralError("An unexpected network error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-fg mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Back to product catalogue
      </Link>

      <div className="mb-8">
        <p className="eyebrow mb-1">Create Item</p>
        <h1 className="text-2xl sm:text-3xl font-black text-fg">New Product</h1>
        <p className="text-xs text-muted mt-1">
          Add a roofing sheet, structural accessory, or fabrication service to the catalogue.
        </p>
      </div>

      {generalError && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <p>{generalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 bg-raised border border-line rounded-2xl space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-2">
            General Information
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field id="name" label="Product Name" error={fieldErrors.name} required>
                {(props) => (
                  <input
                    {...props}
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. 0.55mm Steeltile Aluminium Sheet"
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-medium focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div>
              <Field id="slug" label="URL Slug" error={fieldErrors.slug} required>
                {(props) => (
                  <input
                    {...props}
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="e.g. steeltile-aluminium-sheet"
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-mono focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field id="description" label="Description">
                {(props) => (
                  <textarea
                    {...props}
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Technical description of the profile, coating characteristics, and application..."
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div>
              <Field id="categoryId" label="Product Category">
                {(props) => (
                  <select
                    {...props}
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-bold focus:border-accent"
                  >
                    <option value="">No category (Unassigned)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>

            <div>
              <Field id="profileKind" label="Profile Geometry" required>
                {(props) => (
                  <select
                    {...props}
                    name="profileKind"
                    value={formData.profileKind}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-bold focus:border-accent"
                  >
                    <option value="longspan">Longspan Rib</option>
                    <option value="metcoppo">Metcoppo Tile</option>
                    <option value="step-tile">Step Tile</option>
                    <option value="corrugated">Corrugated Wave</option>
                    <option value="shingle">Stone Coated Shingle</option>
                    <option value="ridge">Ridge Cap</option>
                    <option value="gutter">Gutter Channel</option>
                    <option value="flashing">Wall Flashing</option>
                    <option value="trimmer">Trimmer / Edge</option>
                    <option value="fastener">Roofing Fastener</option>
                    <option value="roll-forming">Roll-forming Service</option>
                    <option value="bending">Sheet Bending</option>
                  </select>
                )}
              </Field>
            </div>
          </div>
        </Card>

        {/* Pricing & Units */}
        <Card className="p-6 bg-raised border border-line rounded-2xl space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-2">
            Pricing &amp; Dimensions
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Field id="basePrice" label="Base Rate (₦)" error={fieldErrors.basePrice} required>
                {(props) => (
                  <input
                    {...props}
                    name="basePrice"
                    type="number"
                    min="0"
                    value={formData.basePrice}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-bold focus:border-accent"
                  />
                )}
              </Field>
            </div>

            <div>
              <Field id="unitType" label="Billing Unit" required>
                {(props) => (
                  <select
                    {...props}
                    name="unitType"
                    value={formData.unitType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-bold focus:border-accent"
                  >
                    <option value="metre">per Metre (m)</option>
                    <option value="piece">per Piece</option>
                    <option value="bundle">per Bundle</option>
                    <option value="sqm">per Square Metre (sqm)</option>
                    <option value="roll">per Roll</option>
                    <option value="service">Service fee</option>
                  </select>
                )}
              </Field>
            </div>

            <div>
              <Field id="productType" label="Product Type" required>
                {(props) => (
                  <select
                    {...props}
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-bold focus:border-accent"
                  >
                    <option value="dimensioned">Dimensioned (Length calculation)</option>
                    <option value="standard">Standard fixed unit</option>
                    <option value="service">Service</option>
                  </select>
                )}
              </Field>
            </div>

            <div>
              <Field id="minOrderQuantity" label="Min. Order Quantity" required>
                {(props) => (
                  <input
                    {...props}
                    name="minOrderQuantity"
                    type="number"
                    min="1"
                    value={formData.minOrderQuantity}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-bold focus:border-accent"
                  />
                )}
              </Field>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-fg">
            <input
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="size-4 rounded border-line text-accent focus:ring-accent"
            />
            Publish product immediately (Active)
          </label>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="flex items-center gap-2 font-bold"
          >
            {isSubmitting ? "Creating..." : "Save & Proceed to Images"}
          </Button>
        </div>
      </form>
    </div>
  );
}