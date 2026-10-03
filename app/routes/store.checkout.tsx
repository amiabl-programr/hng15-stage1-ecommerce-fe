import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  HardHat,
  Lock,
  Package,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { useCart } from "~/store/cart";
import { useAuth } from "~/store/session";
import { createOrder } from "~/lib/api/endpoints";
import { formatMoney } from "~/lib/format";
import { site } from "~/lib/site";
import { ApiError } from "~/lib/api/client";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Field } from "~/components/ui/Field";
import type { PaymentMethod } from "~/types/api";

export function meta() {
  return [{ title: `Checkout — ${site.name}` }];
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, isHydrated, clearCart } = useCart();
  const { user } = useAuth();

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

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  if (!isHydrated) {
    return (
      <div className="shell-container py-16 text-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-muted">Preparing checkout...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell-container py-16 text-center">
        <h1 className="text-2xl font-black mb-4">Your cart is empty</h1>
        <p className="text-sm text-muted mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products">
          <Button variant="primary">Browse Products</Button>
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
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) {
      errors.email = "A valid email address is required";
    }
    if (!formData.phone.trim() || formData.phone.length < 5) {
      errors.phone = "Phone number is required (min. 5 digits)";
    }
    if (!formData.streetAddress.trim()) {
      errors.streetAddress = "Delivery street address is required";
    }
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
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
          variantId: item.variantId || undefined,
          quantity: item.quantity,
          customSpecs: item.customSpecs
            ? {
                lengthMetres: item.customSpecs.lengthMetres,
                colour: item.customSpecs.colour,
                finish: item.customSpecs.finish,
                notes: item.customSpecs.notes,
              }
            : undefined,
        })),
      };

      const res = await createOrder(orderPayload);
      clearCart();
      navigate(
        `/checkout/success?orderNumber=${encodeURIComponent(
          res.order.orderNumber
        )}&id=${encodeURIComponent(res.order.id)}`
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shell-container py-10 md:py-16">
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-fg mb-3"
        >
          <ArrowLeft className="size-3.5" />
          Back to cart
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-fg">Secure Checkout</h1>
        <p className="text-sm text-muted mt-1">
          Provide your delivery details and choose your preferred payment method.
        </p>
      </div>

      {generalError && (
        <div className="mb-8 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger flex items-start gap-3 text-sm">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Unable to process order</p>
            <p>{generalError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-12">
        {/* Left Form: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Info Card */}
          <Card className="p-6 bg-page border border-line rounded-2xl">
            <h2 className="text-lg font-black text-fg mb-4 flex items-center gap-2">
              <span className="size-6 rounded-full bg-accent text-on-accent text-xs flex items-center justify-center font-black">
                1
              </span>
              Contact Information
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="fullName" label="Full Name" error={fieldErrors.fullName} required>
                  {(props) => (
                    <input
                      {...props}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Victor Okafor"
                      className="w-full rounded-lg border border-line bg-raised py-2.5 px-3.5 text-sm font-medium focus:border-accent"
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
                      placeholder="victor@example.com"
                      className="w-full rounded-lg border border-line bg-raised py-2.5 px-3.5 text-sm font-medium focus:border-accent"
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
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 800 123 4567"
                      className="w-full rounded-lg border border-line bg-raised py-2.5 px-3.5 text-sm font-medium focus:border-accent"
                    />
                  )}
                </Field>
              </div>
            </div>
          </Card>

          {/* Delivery Address Card */}
          <Card className="p-6 bg-page border border-line rounded-2xl">
            <h2 className="text-lg font-black text-fg mb-4 flex items-center gap-2">
              <span className="size-6 rounded-full bg-accent text-on-accent text-xs flex items-center justify-center font-black">
                2
              </span>
              Site Delivery Destination
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field id="streetAddress" label="Site Street Address" error={fieldErrors.streetAddress} required>
                  {(props) => (
                    <input
                      {...props}
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleChange}
                      placeholder="Plot 14, Commercial Avenue, Industrial Layout"
                      className="w-full rounded-lg border border-line bg-raised py-2.5 px-3.5 text-sm font-medium focus:border-accent"
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
                      placeholder="Ikeja"
                      className="w-full rounded-lg border border-line bg-raised py-2.5 px-3.5 text-sm font-medium focus:border-accent"
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
                      className="w-full rounded-lg border border-line bg-raised py-2.5 px-3.5 text-sm font-medium focus:border-accent"
                    />
                  )}
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field id="additionalInstructions" label="Additional Instructions (Site Access, Offloading)">
                  {(props) => (
                    <textarea
                      {...props}
                      name="additionalInstructions"
                      rows={2}
                      value={formData.additionalInstructions}
                      onChange={handleChange}
                      placeholder="e.g. Call before dispatch, crane access available from side gate"
                      className="w-full rounded-lg border border-line bg-raised py-2 px-3 text-sm focus:border-accent"
                    />
                  )}
                </Field>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6 bg-page border border-line rounded-2xl">
            <h2 className="text-lg font-black text-fg mb-4 flex items-center gap-2">
              <span className="size-6 rounded-full bg-accent text-on-accent text-xs flex items-center justify-center font-black">
                3
              </span>
              Payment Method
            </h2>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  id: "transfer" as PaymentMethod,
                  title: "Bank Transfer",
                  desc: "Direct corporate bank transfer",
                  icon: Wallet,
                },
                {
                  id: "cash_on_delivery" as PaymentMethod,
                  title: "Pay on Delivery",
                  desc: "Cash or POS at site handover",
                  icon: Truck,
                },
                {
                  id: "card" as PaymentMethod,
                  title: "Debit / Card",
                  desc: "Instant card checkout",
                  icon: CreditCard,
                },
              ].map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, paymentMethod: method.id }))
                  }
                  className={`btn-press p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    formData.paymentMethod === method.id
                      ? "border-accent bg-accent/10 ring-1 ring-accent"
                      : "border-line bg-raised hover:border-accent"
                  }`}
                >
                  <method.icon className={`size-5 mb-2 ${formData.paymentMethod === method.id ? "text-accent" : "text-muted"}`} />
                  <div>
                    <div className="text-xs font-black text-fg">{method.title}</div>
                    <div className="text-[11px] text-muted mt-0.5">{method.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5">
          <Card className="p-6 bg-raised border border-line rounded-2xl sticky top-24">
            <h2 className="text-lg font-black text-fg mb-4">Order Items ({items.length})</h2>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 mb-4 border-b border-line pb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                  <div className="truncate flex-1">
                    <p className="font-bold text-fg truncate">{item.productName}</p>
                    <p className="text-muted text-[11px]">
                      {item.quantity} × {formatMoney(item.unitPrice)}
                      {item.customSpecs?.lengthMetres && ` (${item.customSpecs.lengthMetres}m)`}
                    </p>
                  </div>
                  <span className="font-bold text-fg">{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-b border-line pb-4">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-bold text-fg">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Estimated Delivery</span>
                <span className="font-bold text-fg">Calculated on confirmation</span>
              </div>
            </div>

            <div className="py-4 flex justify-between items-baseline">
              <div>
                <span className="text-base font-black text-fg block">Indicative Total</span>
                <span className="text-[11px] text-muted">Final rates verified in order</span>
              </div>
              <span className="text-2xl font-black text-fg">{formatMoney(subtotal)}</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full py-3.5 flex items-center justify-center gap-2 font-bold text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Order...
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Place Verified Order
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Direct transaction verified with factory stock</span>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}