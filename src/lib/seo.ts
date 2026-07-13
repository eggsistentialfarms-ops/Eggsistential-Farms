import { useEffect } from "react";

const SITE_NAME = "Eggsistential Farms";
const SITE_URL = "https://www.eggsistentialfarms.com"; // update this once your domain is connected

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Call this once near the top of each page component to set that
 * page's title, description, and social-preview tags. Google (and
 * Facebook/etc, though less reliably) will pick these up.
 *
 * Example:
 *   useSEO({
 *     title: "Fresh Eggs — Eggsistential Farms",
 *     description: "Order pasture-raised eggs for local pickup.",
 *     path: "/eggs",
 *   });
 */
export function useSEO({
  title,
  description,
  path = "",
  image = "/logo.png",
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    setMetaTag("name", "description", description);
    setLinkTag("canonical", url);

    // Open Graph (Facebook, iMessage, Slack, etc.)
    const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:image", imageUrl);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:site_name", SITE_NAME);

    // Twitter/X card
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", imageUrl);
  }, [title, description, path, image]);
}
