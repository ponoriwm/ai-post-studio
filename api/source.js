function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function extractMeta(html, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1].trim());
  }
  return "";
}

function stripHtml(html) {
  return decodeHtml(html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|h1|h2|h3|li)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim());
}

function extractArticleText(html) {
  const article = html.match(/<article[\s\S]*?<\/article>/i)?.[0] || "";
  const jsonLd = Array.from(html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi))
    .map(match => {
      try {
        const parsed = JSON.parse(decodeHtml(match[1].trim()));
        const items = Array.isArray(parsed) ? parsed : [parsed];
        return items.map(item => item.articleBody || item.description || "").join("\n");
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .join("\n");
  const text = stripHtml([jsonLd, article || html].filter(Boolean).join("\n"));
  return text.slice(0, 5000);
}

function extractTitle(html) {
  return extractMeta(html, "og:title")
    || decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  try {
    const { url } = req.body || {};
    if (!url) {
      return res.status(400).json({ error: { message: "url is required" } });
    }

    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return res.status(400).json({ error: { message: "Invalid URL" } });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return res.status(400).json({ error: { message: "Only http and https URLs are supported" } });
    }

    const upstream = await fetch(parsed.toString(), {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
        "User-Agent": "Mozilla/5.0 (compatible; AI Post Studio/1.0; +https://ai-post-studio.vercel.app)",
      },
      redirect: "follow",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const html = await upstream.text();
    if (!upstream.ok || !html) {
      return res.status(502).json({ error: { message: `URL fetch failed: ${upstream.status}` } });
    }

    const title = extractTitle(html);
    const description = extractMeta(html, "og:description") || extractMeta(html, "description");
    const source = extractMeta(html, "og:site_name") || parsed.hostname.replace(/^www\./, "");
    const publishedAt = extractMeta(html, "article:published_time") || extractMeta(html, "datePublished");
    const text = extractArticleText(html);

    return res.status(200).json({
      title,
      description,
      source,
      url: upstream.url || parsed.toString(),
      publishedAt,
      text,
      contentType,
    });
  } catch (error) {
    return res.status(500).json({ error: { message: error?.message || "Source extraction failed" } });
  }
}
