import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL, DEFAULT_SEO, SeoConfig, seoConfig } from "@/lib/seo";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const toAbsoluteUrl = (value?: string) => {
  if (!value) {
    return BASE_URL;
  }

  if (ABSOLUTE_URL_REGEX.test(value)) {
    return value;
  }

  const normalizedBase = BASE_URL.replace(/\/$/, "");
  const normalizedPath = value.startsWith("/") ? value : `/${value}`;

  return `${normalizedBase}${normalizedPath}`;
};

const MetaManager = () => {
  const location = useLocation();

  const computedMeta = useMemo(() => {
    const routeConfig: Partial<SeoConfig> = seoConfig[location.pathname] ?? {};
    const merged = { ...DEFAULT_SEO, ...routeConfig };
    const canonicalPath = routeConfig.canonical ?? (location.pathname || "/");
    const canonicalUrl = toAbsoluteUrl(canonicalPath);
    const pageUrl = location.search ? `${canonicalUrl}${location.search}` : canonicalUrl;

    return {
      ...merged,
      canonicalUrl,
      pageUrl
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const setMetaTag = (attribute: "name" | "property", value: string, content?: string) => {
      if (!content) {
        return;
      }

      const selector = `meta[${attribute}="${value}"]`;
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    const ensureLink = (rel: string, href: string) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }

      link.setAttribute("href", href);
    };

    const upsertJsonLd = (schema?: Record<string, unknown>) => {
      const existing = document.getElementById("seo-json-ld");

      if (!schema) {
        existing?.remove();
        return;
      }

      const script = existing ?? document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.id = "seo-json-ld";
      script.textContent = JSON.stringify(schema);

      if (!existing) {
        document.head.appendChild(script);
      }
    };

    document.title = computedMeta.title;
    setMetaTag("name", "description", computedMeta.description);
    setMetaTag("name", "keywords", computedMeta.keywords);
    setMetaTag("name", "robots", computedMeta.robots);
    setMetaTag("property", "og:title", computedMeta.title);
    setMetaTag("property", "og:description", computedMeta.description);
    setMetaTag("property", "og:image", computedMeta.ogImage);
    setMetaTag("property", "og:type", computedMeta.type);
    setMetaTag("property", "og:url", computedMeta.pageUrl);
    setMetaTag("property", "og:site_name", "KickerGPT");
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:site", computedMeta.twitterHandle);
    setMetaTag("name", "twitter:title", computedMeta.title);
    setMetaTag("name", "twitter:description", computedMeta.description);
    setMetaTag("name", "twitter:image", computedMeta.ogImage);
    ensureLink("canonical", computedMeta.canonicalUrl);
    upsertJsonLd(computedMeta.schema);
  }, [computedMeta]);

  return null;
};

export default MetaManager;
