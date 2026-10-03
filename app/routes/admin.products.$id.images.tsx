import type { Route } from "./+types/admin.products.$id.images";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import {
  deleteImage,
  getAdminProductById,
  getMediaForEntity,
  setImagePermission,
  setPrimaryImage,
  uploadImage,
} from "~/lib/api/endpoints";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Field } from "~/components/ui/Field";
import type { AdminImage, ImageRole, PermissionStatus, Product } from "~/types/api";

export function meta() {
  return [{ title: `Product Images — ${site.name} Admin` }];
}

export default function AdminProductImagesPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<AdminImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadRole, setUploadRole] = useState<ImageRole>("main");
  const [altText, setAltText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [prodRes, mediaRes] = await Promise.all([
        getAdminProductById(id),
        getMediaForEntity("product", id),
      ]);
      setProduct(prodRes.product);
      setImages(mediaRes.items || []);
      if (!altText && prodRes.product) {
        setAltText(`Photograph of ${prodRes.product.name}`);
      }
    } catch {
      setErrorMessage("Failed to load product details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (product) {
        setAltText(`Photograph of ${product.name} (${uploadRole})`);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !selectedFile) return;
    if (altText.length < 8) {
      setErrorMessage("Alt text must be at least 8 characters");
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await uploadImage(selectedFile, "product", id, uploadRole, altText);
      setStatusMessage("Image uploaded successfully!");
      setSelectedFile(null);
      await fetchData();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!id) return;
    try {
      await setPrimaryImage(id, imageId);
      setStatusMessage("Primary image updated.");
      await fetchData();
    } catch {
      setErrorMessage("Failed to set primary image.");
    }
  };

  const handlePermissionChange = async (imageId: string, permissionStatus: PermissionStatus) => {
    try {
      await setImagePermission(imageId, { permissionStatus });
      await fetchData();
    } catch {
      setErrorMessage("Failed to update image permission.");
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm("Are you sure you want to remove this image?")) return;
    try {
      await deleteImage(imageId);
      setStatusMessage("Image removed.");
      await fetchData();
    } catch {
      setErrorMessage("Failed to delete image.");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-fg mb-6"
      >
        <ArrowLeft className="size-3.5" />
        Back to products
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">Media Management</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">
            {product?.name || "Product Images"}
          </h1>
          <p className="text-xs text-muted mt-1 font-mono">
            ID: {id}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={isLoading}
          className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
          title="Refresh images"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-bold flex items-center gap-2">
          <AlertCircle className="size-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Upload Form */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-raised border border-line rounded-2xl sticky top-24">
            <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4 flex items-center gap-2">
              <Upload className="size-4 text-accent" />
              Upload Image Asset
            </h2>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Field id="imageFile" label="Image File (JPEG / PNG / WebP)" required>
                  {(props) => (
                    <input
                      {...props}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full text-xs text-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-accent file:text-on-accent hover:file:bg-accent/90 cursor-pointer"
                    />
                  )}
                </Field>
              </div>

              <div>
                <Field id="uploadRole" label="Image Role" required>
                  {(props) => (
                    <select
                      {...props}
                      value={uploadRole}
                      onChange={(e) => setUploadRole(e.target.value as ImageRole)}
                      className="w-full rounded-lg border border-line bg-page py-2 px-3 text-xs font-bold focus:border-accent"
                    >
                      <option value="main">Main Photograph</option>
                      <option value="profile">Profile Geometry Diagram</option>
                      <option value="installed">Installed Site View</option>
                      <option value="detail">Detail Close-up</option>
                    </select>
                  )}
                </Field>
              </div>

              <div>
                <Field id="altText" label="Accessible Alt Text (8–200 chars)" required>
                  {(props) => (
                    <input
                      {...props}
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="e.g. Cross section diagram of 0.55mm longspan"
                      className="w-full rounded-lg border border-line bg-page py-2 px-3 text-xs focus:border-accent"
                    />
                  )}
                </Field>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!selectedFile || isUploading}
                className="w-full flex items-center justify-center gap-2 font-bold"
              >
                {isUploading ? "Uploading..." : "Upload Asset"}
              </Button>
            </form>
          </Card>
        </div>

        {/* Existing Images Gallery */}
        <div className="lg:col-span-7">
          <h2 className="text-sm font-black uppercase tracking-wider text-fg mb-4">
            Attached Media Assets ({images.length})
          </h2>

          {isLoading ? (
            <div className="py-20 text-center text-sm text-muted">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading images...
            </div>
          ) : images.length === 0 ? (
            <Card className="p-12 text-center bg-raised border border-line rounded-2xl">
              <ImageIcon className="size-10 text-muted mx-auto mb-2" />
              <p className="font-bold text-fg">No media uploaded yet</p>
              <p className="text-xs text-muted mt-1">
                The storefront currently falls back to the technical SVG profile diagram.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {images.map((img) => (
                <Card
                  key={img.id}
                  className="p-4 bg-raised border border-line rounded-2xl flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-page mb-3 border border-line">
                    <img
                      src={`http://localhost:4000/storage/v1/object/public/products/${img.storagePath}`}
                      alt={img.altText}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                      className="w-full h-full object-cover"
                    />
                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 bg-accent text-on-accent text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <Star className="size-3 fill-current" />
                        Primary
                      </span>
                    )}
                    <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      {img.role}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 mb-3">
                    <p className="font-bold text-fg line-clamp-1">{img.altText}</p>
                    <p className="text-muted text-[11px] font-mono truncate">
                      {img.storagePath}
                    </p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-muted">Permission:</span>
                      <select
                        value={img.permissionStatus}
                        onChange={(e) =>
                          handlePermissionChange(img.id, e.target.value as PermissionStatus)
                        }
                        className="rounded border border-line bg-page text-[11px] font-bold px-2 py-0.5"
                      >
                        <option value="approved">Approved</option>
                        <option value="own">Own Copyright</option>
                        <option value="pending">Pending Review</option>
                        <option value="not-required">Not Required</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line/60">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className="btn-press text-xs font-bold text-accent hover:underline flex items-center gap-1"
                      >
                        <Star className="size-3" />
                        Make Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      className="btn-press text-xs font-bold text-danger hover:underline ml-auto flex items-center gap-1"
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}