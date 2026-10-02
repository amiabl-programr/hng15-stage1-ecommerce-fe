import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInView } from "./useInView";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-reduced-motion") && reducedMotion,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function Probe() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="target" className={inView ? "reveal is-visible" : "reveal"} />
  );
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  vi.unstubAllGlobals();
});

describe("useInView", () => {
  it("reveals immediately when reduced motion is requested", () => {
    // There is nothing to animate to, so waiting on an observer that may
    // never fire would leave content hidden for no reason.
    mockMatchMedia(true);
    render(<Probe />);
    expect(screen.getByTestId("target")).toHaveClass("is-visible");
  });

  it("reveals immediately when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    mockMatchMedia(false);
    render(<Probe />);
    expect(screen.getByTestId("target")).toHaveClass("is-visible");
  });

  it("stays hidden until the observer reports an intersection", () => {
    let trigger: ((entries: unknown[]) => void) | undefined;

    class FakeObserver {
      constructor(private callback: (entries: unknown[]) => void) {
        trigger = callback;
      }
      observe() {}
      disconnect() {}
    }

    vi.stubGlobal("IntersectionObserver", FakeObserver);
    mockMatchMedia(false);

    render(<Probe />);
    expect(screen.getByTestId("target")).not.toHaveClass("is-visible");

    act(() => trigger?.([{ isIntersecting: true }]));
    expect(screen.getByTestId("target")).toHaveClass("is-visible");
  });
});