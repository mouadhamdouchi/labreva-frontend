const routePreloaders: Record<string, () => Promise<unknown>> = {
  "/": () => import("@/pages/Home"),
  "/menu": () => import("@/pages/Menu"),
  "/reservation": () => import("@/pages/Reservation"),
  "/events": () => import("@/pages/Events"),
  "/gallery": () => import("@/pages/Gallery"),
  "/about": () => import("@/pages/About"),
  "/contact": () => import("@/pages/Contact"),
};

const preloadedRoutes = new Set<string>();

export function preloadRoute(path: string) {
  if (preloadedRoutes.has(path)) return;

  const preload = routePreloaders[path];
  if (!preload) return;

  preloadedRoutes.add(path);
  void preload().catch(() => {
    preloadedRoutes.delete(path);
  });
}

export function preloadCoreRoutes() {
  const preload = () => {
    ["/menu", "/gallery", "/events", "/reservation"].forEach(preloadRoute);
  };

  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };

  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(preload, { timeout: 1500 });
    return;
  }

  globalThis.setTimeout(preload, 250);
}
