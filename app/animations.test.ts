import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Read from the project root rather than import.meta.url: under the
// vmThreads pool the module URL is not a file: URL.
const css = readFileSync(resolve(process.cwd(), "app/animations.css"), "utf8");

/**
 * jsdom does not evaluate media queries or CSS, so the reduced-motion
 * block cannot be exercised behaviourally. What is checked here is that
 * it still exists and still names the effects it has to cover — deleting
 * or renaming an animation without extending the block is the realistic
 * way this regresses, and it is invisible in a component test.
 */
describe("animations.css", () => {
  const reducedMotionBlock = css.slice(css.indexOf("prefers-reduced-motion"));

  it("has a reduced-motion block", () => {
    expect(reducedMotionBlock.length).toBeGreaterThan(0);
    expect(reducedMotionBlock).toContain("animation-duration");
    expect(reducedMotionBlock).toContain("transition-duration");
  });

  it("forces the reveal end-state rather than trusting a fast transition", () => {
    expect(reducedMotionBlock).toMatch(/\.reveal[\s\S]*opacity:\s*1\s*!important/);
  });

  it.each([
    "fade-up",
    "fade-in",
    "slide-right",
    "pop",
    "shimmer",
    "hero-animate",
    "reveal-stagger",
    "product-card-shadow",
    "card-action",
    "cart-badge-pop",
    "btn-press",
    "promo-shimmer",
  ])("defines %s", (name) => {
    expect(css).toContain(name);
  });

  it("keeps .reveal visible by default so no-JS readers still see the content", () => {
    // The hidden state must be gated behind .js-reveal. If `.reveal` alone
    // were hidden, a crawler or a blocked script would ship a blank page.
    const rule = css.match(/\.reveal\s*\{([^}]*)\}/);
    expect(rule).not.toBeNull();
    expect(rule?.[1]).toContain("opacity: 1");
  });
});