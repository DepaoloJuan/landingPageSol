import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';

// Animations finish instantly, so exits (closing the viewer, switching tabs) complete right away
MotionGlobalConfig.skipAnimations = true;

// jsdom has no layout engine: these browser APIs are missing and the components need them.

// No reduced-motion preference and no media query matches
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

window.scrollTo = (() => {}) as typeof window.scrollTo;

class FakeResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;

// Nothing is reported in view by itself. Scrolling an element into view (what the
// price viewer does to move between services) reports that element as intersecting
// to every observer watching it, which is what a browser would do after the scroll.
class FakeIntersectionObserver {
  static instances = new Set<FakeIntersectionObserver>();
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  private readonly targets = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.add(this);
  }

  observe(target: Element) {
    this.targets.add(target);
  }

  unobserve(target: Element) {
    this.targets.delete(target);
  }

  disconnect() {
    this.targets.clear();
    FakeIntersectionObserver.instances.delete(this);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  reportInView(target: Element) {
    if (!this.targets.has(target)) return;
    const entry = { target, isIntersecting: true, intersectionRatio: 1 } as unknown as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}
window.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;

Element.prototype.scrollIntoView = function scrollIntoView(this: Element) {
  FakeIntersectionObserver.instances.forEach(observer => observer.reportInView(this));
};

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.style.overflow = '';
});
