import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  HardHat,
  Info,
  Lock,
  Package,
  PhoneCall,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { cleanCustomSpecs, useCart } from "~/store/cart";
import { useAuth } from "~/store/session";
import { createOrder } from "~/lib/api/endpoints";
import { formatMoney } from "~/lib/format";
import { site } from "~/lib/site";
import { ApiError } from "~/lib/api/client";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Field } from "~/components/ui/Field";
import { cn } from "~/lib/cn";
import type { PaymentMethod } from "~/types/api";

const DELIVERY_FEE = 15000;

export function meta() {
  return [{ title: `Secure Checkout — ${site.name}` }];
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const totalPayable = subtotal + DELIVERY_FEE;
  const { user, isAuthenticated, isLoading, isInitialized, fetchSession } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    streetAddress: "",
    city: "Lagos",
    state: "Lagos State",
    additionalInstructions: "",
    paymentMethod: "transfer" as PaymentMethod,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  useEffect(() => {
    // Check auth status from backend on mount
    fetchSession().finally(() => {
      setCheckingAuth(false);
    });
  }, [fetchSession]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    // Guard: user must be authenticated to checkout
    if (!checkingAuth && isInitialized && !isAuthenticated && !isLoading) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
  }, [checkingAuth, isInitialized, isAuthenticated, isLoading, navigate]);

  if (checkingAuth || isLoading || !isInitialized || !isHydrated) {
    return (
      <div className="shell-container py-24 text-center">
        <div className="size-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-bold text-fg">Verifying account authentication...</p>
        <p className="text-xs text-muted mt-1">Checking session status with backend server</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="shell-container py-20 text-center max-w-md mx-auto">
        <div className="size-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <Lock className="size-8 text-accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-3">Sign in required to checkout</h1>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          You must be logged in to place a verified roofing order. Sign in to link your order to your account and track site deliveries.
        </p>
        <Link to="/login?redirect=/checkout">
          <Button variant="primary" size="lg" className="w-full font-bold">
            Sign In with Google
          </Button>
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell-container py-20 text-center max-w-lg mx-auto">
        <div className="size-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
          <Package className="size-8 text-accent" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-3">Your cart is empty</h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          Please add roofing sheets, profiles, or accessories from our catalogue before completing your order.
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold px-8">
            Browse Products Catalogue
          </Button>
        </Link>
      </div>
    );
  }

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

    // Client validation
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required for delivery manifests";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "A valid email address is required for invoices";
    }
    if (!formData.phone.trim() || formData.phone.length < 5) {
      errors.phone = "Phone number is required for site delivery coordination";
    }
    if (!formData.streetAddress.trim()) {
      errors.streetAddress = "Site delivery destination address is required";
    }
    if (!formData.city.trim()) errors.city = "City / Town is required";
    if (!formData.state.trim()) errors.state = "State is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError("Please complete the required details highlighted below.");

      // Scroll smoothly to first invalid input so mobile users see it immediately
      const firstFieldId = Object.keys(errors)[0];
      const targetElement = document.getElementById(firstFieldId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        targetElement.focus();
      }
      return;
    }

    if (!isAuthenticated || !user) {
      setGeneralError("Authentication required: Please sign in to submit your order.");
      navigate("/login?redirect=/checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          streetAddress: formData.streetAddress.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          additionalInstructions: formData.additionalInstructions.trim() || undefined,
          paymentMethod: formData.paymentMethod,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId?.trim() || undefined,
          quantity: item.quantity,
          customSpecs: cleanCustomSpecs(item.customSpecs),
        })),
      };

      const res = await createOrder(orderPayload);
      clearCart();
      navigate(
        `/checkout/success?orderNumber=${encodeURIComponent(
          res.order.orderNumber
        )}&id=${encodeURIComponent(res.order.id)}`,
        { state: { order: res.order } }
      );
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fields && err.fields.length > 0) {
          const apiFieldErrors: Record<string, string> = {};
          err.fields.forEach((f) => {
            const fieldKey = f.path.replace(/^customer\./, "");
            apiFieldErrors[fieldKey] = f.message;
          });
          setFieldErrors(apiFieldErrors);
        }
        setGeneralError(err.message || "Failed to place order. Please verify your details.");
      } else {
        setGeneralError("An unexpected error occurred. Please check your network and retry.");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell-container py-8 sm:py-12 md:py-16">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-6 sm:mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-fg mb-3 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to cart ({items.length} items)</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-fg">
              Direct Mill Order Checkout
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Verify delivery address and select payment terms. Your order is backed by manufacturer warranty.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0">
            <ShieldCheck className="size-4" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Order Summary Accordion (< lg screens) */}
      <div className="lg:hidden mb-6 rounded-2xl border border-line bg-raised overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full flex items-center justify-between p-4 text-left active:bg-line/40 transition-colors cursor-pointer"
          aria-expanded={mobileSummaryOpen}
        >
          <div className="flex items-center gap-2.5 text-sm font-bold text-fg">
            <Package className="size-4 text-accent" />
            <span>{mobileSummaryOpen ? "Hide order items" : "Show order items"}</span>
            <span className="text-xs text-muted font-normal">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted transition-transform duration-200",
                mobileSummaryOpen && "rotate-180"
              )}
            />
          </div>
          <span className="text-base font-black text-fg tracking-tight">
            {formatMoney(totalPayable)}
          </span>
        </button>

        {mobileSummaryOpen && (
          <div className="border-t border-line p-4 space-y-3 bg-page animate-in fade-in duration-200">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs py-1 border-b border-line/50 last:border-0">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="size-10 rounded-lg object-cover border border-line shrink-0"
                    />
                  ) : (
                    <div className="size-10 rounded-lg bg-raised border border-line flex items-center justify-center shrink-0">
                      <Package className="size-4 text-muted" />
                    </div>
                  )}
                  <div className="truncate flex-1">
                    <p className="font-bold text-fg truncate">{item.productName}</p>
                    <p className="text-[11px] text-muted">
                      {item.quantity} × {formatMoney(item.unitPrice)}
                      {item.customSpecs?.lengthMetres && ` (${item.customSpecs.lengthMetres}m)`}
                    </p>
                  </div>
                </div>
                <span className="font-black text-fg shrink-0">{formatMoney(item.lineTotal)}</span>
              </div>
            ))}

            <div className="pt-2 text-xs space-y-1.5 border-t border-line">
              <div className="flex justify-between text-muted">
                <span>Material Subtotal</span>
                <span className="font-bold text-fg">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Standard Delivery Logistics</span>
                <span className="font-bold text-fg">{formatMoney(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between text-xs pt-1.5 border-t border-line font-black text-fg">
                <span>Total Payable</span>
                <span className="text-sm font-black text-accent">{formatMoney(totalPayable)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Validation Alert */}
      {generalError && (
        <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/30 text-danger flex items-start gap-3 text-sm animate-in fade-in">
          <AlertCircle className="size-5 shrink-0 mt-0.5 text-danger" />
          <div>
            <p className="font-bold">Please check your form details</p>
            <p className="text-xs mt-0.5">{generalError}</p>
          </div>
        </div>
      )}

      {/* Main Checkout Grid */}
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Form: Contact, Destination & Payment */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Customer Contact */}
          <Card className="p-5 sm:p-7 bg-page border border-line rounded-2xl shadow-xs">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-line/60">
              <span className="size-7 rounded-full bg-accent text-on-accent text-xs flex items-center justify-center font-black shrink-0">
                1
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-fg">Contact Information</h2>
                <p className="text-[11px] sm:text-xs text-muted">Order waybill, invoicing and driver notifications</p>
              </div>
            </div>

            {user && (
              <div className="mb-4 flex items-center justify-between rounded-xl bg-accent/10 border border-accent/20 px-3.5 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-accent" />
                  <span className="font-bold text-fg">
                    Signed in as {user.fullName || user.email}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-accent">Verified Session</span>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="fullName" label="Full Name (or Company Representative)" error={fieldErrors.fullName} required>
                  {(props) => (
                    <input
                      {...props}
                      name="fullName"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Victor Okafor / Apex Build Ltd"
                      className={cn(
                        "w-full rounded-xl border bg-raised py-3 px-3.5 text-sm font-medium focus:border-accent focus:bg-page transition-colors",
                        fieldErrors.fullName ? "border-danger ring-1 ring-danger" : "border-line"
                      )}
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
                      inputMode="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className={cn(
                        "w-full rounded-xl border bg-raised py-3 px-3.5 text-sm font-medium focus:border-accent focus:bg-page transition-colors",
                        fieldErrors.email ? "border-danger ring-1 ring-danger" : "border-line"
                      )}
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
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0803 123 4567 or +234..."
                      className={cn(
                        "w-full rounded-xl border bg-raised py-3 px-3.5 text-sm font-medium focus:border-accent focus:bg-page transition-colors",
                        fieldErrors.phone ? "border-danger ring-1 ring-danger" : "border-line"
                      )}
                    />
                  )}
                </Field>
              </div>
            </div>
          </Card>

          {/* Step 2: Site Delivery Destination */}
          <Card className="p-5 sm:p-7 bg-page border border-line rounded-2xl shadow-xs">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-line/60">
              <span className="size-7 rounded-full bg-accent text-on-accent text-xs flex items-center justify-center font-black shrink-0">
                2
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-fg">Site Delivery Destination</h2>
                <p className="text-[11px] sm:text-xs text-muted">Direct site crane offloading location</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="streetAddress" label="Site Street Address & Landmark" error={fieldErrors.streetAddress} required>
                  {(props) => (
                    <input
                      {...props}
                      name="streetAddress"
                      autoComplete="street-address"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      placeholder="Plot 14, Commercial Avenue, Industrial Estate, Ikeja"
                      className={cn(
                        "w-full rounded-xl border bg-raised py-3 px-3.5 text-sm font-medium focus:border-accent focus:bg-page transition-colors",
                        fieldErrors.streetAddress ? "border-danger ring-1 ring-danger" : "border-line"
                      )}
                    />
                  )}
                </Field>
              </div>

              <div>
                <Field id="city" label="City / Town" error={fieldErrors.city} required>
                  {(props) => (
                    <input
                      {...props}
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ikeja / Lekki / Ibadan"
                      className={cn(
                        "w-full rounded-xl border bg-raised py-3 px-3.5 text-sm font-medium focus:border-accent focus:bg-page transition-colors",
                        fieldErrors.city ? "border-danger ring-1 ring-danger" : "border-line"
                      )}
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
                      placeholder="Lagos State"
                      className={cn(
                        "w-full rounded-xl border bg-raised py-3 px-3.5 text-sm font-medium focus:border-accent focus:bg-page transition-colors",
                        fieldErrors.state ? "border-danger ring-1 ring-danger" : "border-line"
                      )}
                    />
                  )}
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field id="additionalInstructions" label="Site Access, Offload Notes & Contact Person">
                  {(props) => (
                    <textarea
                      {...props}
                      name="additionalInstructions"
                      rows={2}
                      value={formData.additionalInstructions}
                      onChange={handleChange}
                      placeholder="e.g. Call Engineer Musa on site (+234...). High-clearance gate available for long-bed crane truck."
                      className="w-full rounded-xl border border-line bg-raised py-2.5 px-3.5 text-sm font-medium focus:border-accent focus:bg-page transition-colors"
                    />
                  )}
                </Field>
              </div>
            </div>
          </Card>

          {/* Step 3: Payment Method */}
          <Card className="p-5 sm:p-7 bg-page border border-line rounded-2xl shadow-xs">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-line/60">
              <span className="size-7 rounded-full bg-accent text-on-accent text-xs flex items-center justify-center font-black shrink-0">
                3
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-black text-fg">Payment Terms</h2>
                <p className="text-[11px] sm:text-xs text-muted">Select your approved payment option</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  id: "transfer" as PaymentMethod,
                  title: "Bank Transfer",
                  desc: "Direct corporate account",
                  icon: Wallet,
                },
                {
                  id: "cash_on_delivery" as PaymentMethod,
                  title: "Pay on Delivery",
                  desc: "Transfer/POS at offload",
                  icon: Truck,
                },
                {
                  id: "card" as PaymentMethod,
                  title: "Debit / Card",
                  desc: "Instant card checkout",
                  icon: CreditCard,
                },
              ].map((method) => {
                const isSelected = formData.paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, paymentMethod: method.id }))
                    }
                    className={cn(
                      "btn-press p-4 rounded-xl border text-left flex flex-col justify-between transition-all relative cursor-pointer",
                      isSelected
                        ? "border-accent bg-accent/10 ring-2 ring-accent/30 shadow-xs"
                        : "border-line bg-raised hover:border-accent/40"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3 w-full">
                      <method.icon className={cn("size-5", isSelected ? "text-accent" : "text-muted")} />
                      <div className={cn(
                        "size-4 rounded-full border flex items-center justify-center transition-colors",
                        isSelected ? "border-accent bg-accent text-on-accent" : "border-line bg-page"
                      )}>
                        {isSelected && <div className="size-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-black text-fg">{method.title}</div>
                      <div className="text-[11px] text-muted mt-0.5">{method.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanatory Note for Selected Method */}
            <div className="mt-4 p-3.5 rounded-xl bg-raised border border-line/60 flex items-start gap-2.5 text-xs text-muted">
              <Info className="size-4 text-accent shrink-0 mt-0.5" />
              <div>
                {formData.paymentMethod === "transfer" && (
                  <span>
                    <strong>Corporate Bank Transfer:</strong> An official proforma invoice with verified commercial bank details (Zenith / GTBank) will be generated. Stock is reserved immediately.
                  </span>
                )}
                {formData.paymentMethod === "cash_on_delivery" && (
                  <span>
                    <strong>Site Inspection & Pay on Delivery:</strong> Our driver verifies bundle gauges and quantities upon arrival. Payment can be completed via bank transfer or POS before crane offloading.
                  </span>
                )}
                {formData.paymentMethod === "card" && (
                  <span>
                    <strong>Instant Card Payment:</strong> Fast, 256-bit encrypted checkout. Payment receipt dispatched instantly and order receives priority factory scheduling.
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Order Review & Submit Card (Sticky) */}
        <div className="lg:col-span-5 sticky top-24">
          <Card className="p-5 sm:p-7 bg-raised border border-line rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-fg">Order Summary</h2>
              <span className="text-xs font-bold bg-page border border-line px-2.5 py-1 rounded-full text-muted">
                {items.length} {items.length === 1 ? "Item" : "Items"}
              </span>
            </div>

            {/* Items List */}
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1 mb-5 border-b border-line pb-5">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between text-xs gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="size-10 rounded-lg object-cover border border-line shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-lg bg-page border border-line flex items-center justify-center shrink-0">
                        <Package className="size-4 text-muted" />
                      </div>
                    )}
                    <div className="truncate flex-1">
                      <p className="font-bold text-fg truncate">{item.productName}</p>
                      <p className="text-[11px] text-muted">
                        {item.quantity} × {formatMoney(item.unitPrice)}
                        {item.customSpecs?.lengthMetres && ` (${item.customSpecs.lengthMetres}m)`}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-fg shrink-0">{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-sm border-b border-line pb-4">
              <div className="flex justify-between">
                <span className="text-muted text-xs">Material Total</span>
                <span className="font-bold text-fg">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Standard Delivery Logistics</span>
                <span className="font-bold text-fg">{formatMoney(DELIVERY_FEE)}</span>
              </div>
            </div>

            {/* Total Price Display */}
            <div className="py-4 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-black text-fg block">Total Order Payable</span>
                <span className="text-[11px] text-muted">Includes materials & logistics</span>
              </div>
              <span className="text-2xl font-black text-fg tracking-tight">{formatMoney(totalPayable)}</span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full py-4 flex items-center justify-center gap-2 font-bold text-base shadow-md shadow-accent/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  <span>Place Verified Order</span>
                </>
              )}
            </Button>

            {/* Trust and Hotline Info */}
            <div className="mt-5 space-y-2 text-center text-xs text-muted border-t border-line/60 pt-4">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-bold">
                <ShieldCheck className="size-4 shrink-0" />
                <span>Certified Factory Stock Guarantee</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-muted">
                <PhoneCall className="size-3.5 shrink-0" />
                <span>Support hotline: {site.phone}</span>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}