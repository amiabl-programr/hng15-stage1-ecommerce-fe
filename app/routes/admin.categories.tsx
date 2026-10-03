import type { Route } from "./+types/admin.categories";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle2, Layers, Plus, RefreshCw } from "lucide-react";
import { createAdminCategory, getAdminCategories } from "~/lib/api/endpoints";
import { site } from "~/lib/site";
import { ApiError } from "~/lib/api/client";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import { Field } from "~/components/ui/Field";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";
import type { Category } from "~/types/api";

export function meta() {
  return [{ title: `Categories Management — ${site.name} Admin` }];
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCategories();
      setCategories(res.items || []);
    } catch {
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Category name is required";
    if (!formData.slug.trim()) errors.slug = "Category slug is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await createAdminCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
      });

      setSuccessMessage(`Category "${formData.name}" created successfully.`);
      setFormData({ name: "", slug: "", description: "" });
      setShowCreateModal(false);
      await fetchCategories();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && err.fields.length > 0) {
          const apiErrors: Record<string, string> = {};
          err.fields.forEach((f) => {
            apiErrors[f.path] = f.message;
          });
          setFieldErrors(apiErrors);
        }
        setGeneralError(err.message || "Failed to create category.");
      } else {
        setGeneralError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">Taxonomy</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Category Management</h1>
          <p className="text-xs text-muted mt-1">
            Organise products into customer-facing roofing collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCategories}
            disabled={isLoading}
            className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
            title="Refresh categories"
          >
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 font-bold"
          >
            <Plus className="size-4" />
            New Category
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Creation Modal / Section */}
      {showCreateModal && (
        <Card className="p-6 bg-raised border border-accent/40 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-fg">Add New Product Category</h2>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="text-xs text-muted hover:text-fg font-bold"
            >
              Cancel
            </button>
          </div>

          {generalError && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-xs flex items-center gap-2">
              <AlertCircle className="size-4" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="catName" label="Category Name" error={fieldErrors.name} required>
                {(props) => (
                  <input
                    {...props}
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g. Industrial Box Gutters"
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm focus:border-accent"
                  />
                )}
              </Field>

              <Field id="catSlug" label="URL Slug" error={fieldErrors.slug} required>
                {(props) => (
                  <input
                    {...props}
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="e.g. industrial-box-gutters"
                    className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm font-mono focus:border-accent"
                  />
                )}
              </Field>

              <div className="sm:col-span-2">
                <Field id="catDesc" label="Description">
                  {(props) => (
                    <textarea
                      {...props}
                      rows={2}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Brief description for category browsing and search SEO..."
                      className="w-full rounded-lg border border-line bg-page py-2 px-3 text-sm focus:border-accent"
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting}
                className="font-bold"
              >
                {isSubmitting ? "Creating..." : "Save Category"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading categories...
        </div>
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center bg-raised border border-line rounded-2xl">
          <Layers className="size-10 text-muted mx-auto mb-2" />
          <p className="font-bold text-fg">No categories yet</p>
          <p className="text-xs text-muted mt-1 mb-4">
            Organise your roofing catalogue by creating categories.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
            Add First Category
          </Button>
        </Card>
      ) : (
        <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>URL Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-bold text-fg">{cat.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="text-xs text-muted max-w-md truncate">
                    {cat.description || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      to={`/products?category=${cat.slug}`}
                      target="_blank"
                      className="btn-press text-xs font-bold text-accent hover:underline"
                    >
                      View on Store
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}