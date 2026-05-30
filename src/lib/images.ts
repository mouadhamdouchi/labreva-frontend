const LOCAL_PICTS_PREFIX = "/picts/";
const LOCAL_IMAGE_EXT_RE = /\.(jpe?g|png)$/i;
const RESPONSIVE_WIDTHS = [480, 800, 1200] as const;

function isLocalPicture(src: string) {
  return src.startsWith(LOCAL_PICTS_PREFIX);
}

function isUnsplashPicture(src: string) {
  return src.startsWith("https://images.unsplash.com/");
}

function unsplashPictureUrl(src: string, width: (typeof RESPONSIVE_WIDTHS)[number]) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", url.searchParams.get("q") ?? "75");
  url.searchParams.set("auto", url.searchParams.get("auto") ?? "format");
  return url.toString();
}

export function imageSrc(src: string | null | undefined, width: (typeof RESPONSIVE_WIDTHS)[number] = 800) {
  if (!src) return "";
  if (isUnsplashPicture(src)) return unsplashPictureUrl(src, width);
  return src;
}

export function imageSrcSet(src: string | null | undefined) {
  if (!src) return undefined;

  if (isUnsplashPicture(src)) {
    return RESPONSIVE_WIDTHS.map((width) => `${unsplashPictureUrl(src, width)} ${width}w`).join(", ");
  }

  // Local pictures no longer have responsive variants — single source is served as-is.
  if (!isLocalPicture(src) || !LOCAL_IMAGE_EXT_RE.test(src)) {
    return undefined;
  }
  return undefined;
}

export function preloadImages(srcs: Array<string | null | undefined>, width: (typeof RESPONSIVE_WIDTHS)[number] = 800) {
  const preload = () => {
    srcs.filter(Boolean).forEach((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = imageSrc(src, width);
    });
  };

  const idleWindow = window as Window & {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  };

  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(preload, { timeout: 1200 });
    return;
  }

  globalThis.setTimeout(preload, 1);
}
