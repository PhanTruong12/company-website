const DEFAULT_SITE_NAME = 'TND Granite';
const DEFAULT_TITLE = 'TND Granite';
const DEFAULT_DESCRIPTION =
  'TND Granite - Chuyen cung cap da op lat cao cap cho khong gian bep, cau thang va noi that.';
const DEFAULT_IMAGE = 'https://tndgranite.com/logo.jpg';
const REQUEST_TIMEOUT_MS = 5000;

const sanitizeText = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const ensureApiBaseUrl = (rawValue = '') => {
  const trimmed = String(rawValue || '').trim();
  if (!trimmed) return '';
  const noTrailing = trimmed.replace(/\/+$/, '');
  if (noTrailing.toLowerCase().endsWith('/api')) return noTrailing;
  return `${noTrailing}/api`;
};

const normalizeUrl = (value = '') => String(value || '').trim();

const getRequestOrigin = (req) => {
  const protoHeader = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const hostHeader =
    String(req.headers['x-forwarded-host'] || '').split(',')[0].trim() ||
    String(req.headers.host || '').trim() ||
    'tndgranite.com';
  const protocol = protoHeader || 'https';
  return `${protocol}://${hostHeader}`;
};

const resolveAssetUrl = ({ imageUrl, requestOrigin, apiBaseUrl }) => {
  const raw = normalizeUrl(imageUrl);
  if (!raw) return DEFAULT_IMAGE;
  if (/^data:/i.test(raw) || /^blob:/i.test(raw)) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith('//')) return `https:${raw}`;

  const backendOrigin = apiBaseUrl ? apiBaseUrl.replace(/\/api\/?$/i, '') : '';
  if (raw.startsWith('/')) {
    if (backendOrigin) return `${backendOrigin}${raw}`;
    return `${requestOrigin}${raw}`;
  }

  const normalized = raw.replace(/^\/+/, '');
  if (backendOrigin) return `${backendOrigin}/${normalized}`;
  return `${requestOrigin}/${normalized}`;
};

const injectMetaTags = ({ html, metaTags, title }) => {
  const safeTitle = escapeHtml(title || DEFAULT_TITLE);
  let output = html;

  const removableMetaKeys = [
    'description',
    'og:site_name',
    'og:type',
    'og:title',
    'og:description',
    'og:image',
    'og:image:width',
    'og:image:height',
    'og:url',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
  ];

  for (const key of removableMetaKeys) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `<meta[^>]+(?:name|property)=["']${escapedKey}["'][^>]*>\\s*`,
      'gi'
    );
    output = output.replace(regex, '');
  }

  if (/<title>[\s\S]*?<\/title>/i.test(output)) {
    output = output.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  } else {
    output = output.replace(/<head>/i, `<head>\n    <title>${safeTitle}</title>`);
  }

  output = output.replace('</head>', `${metaTags}\n  </head>`);
  return output;
};

const fetchJson = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (_error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const buildMetaTags = ({ title, description, image, url, type = 'article' }) => {
  const tags = [
    ['description', description, 'name'],
    ['og:site_name', DEFAULT_SITE_NAME, 'property'],
    ['og:type', type, 'property'],
    ['og:title', title, 'property'],
    ['og:description', description, 'property'],
    ['og:image', image, 'property'],
    ['og:image:width', '1200', 'property'],
    ['og:image:height', '630', 'property'],
    ['og:url', url, 'property'],
    ['twitter:card', 'summary_large_image', 'name'],
    ['twitter:title', title, 'name'],
    ['twitter:description', description, 'name'],
    ['twitter:image', image, 'name'],
  ];

  return tags
    .map(([name, value, attr]) => `    <meta ${attr}="${name}" content="${escapeHtml(value)}" />`)
    .join('\n');
};

const getIndexHtml = async (origin) => {
  const indexUrl = `${origin}/index.html`;
  const response = await fetch(indexUrl, {
    headers: {
      accept: 'text/html',
      'x-social-preview': '1',
    },
  });
  if (!response.ok) {
    throw new Error(`Cannot load index template: ${response.status}`);
  }
  return response.text();
};

export default async function handler(req, res) {
  const requestOrigin = getRequestOrigin(req);
  const slug = String(req.query.slug || '').trim();

  if (!slug) {
    return res.status(400).send('Missing slug');
  }

  const apiBaseUrl = ensureApiBaseUrl(
    process.env.OG_API_BASE_URL || process.env.VITE_API_BASE_URL || process.env.VITE_API_URL
  );

  const canonicalUrl = `${requestOrigin}/blog/${encodeURIComponent(slug)}`;
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;
  let image = DEFAULT_IMAGE;

  if (apiBaseUrl) {
    const encodedSlug = encodeURIComponent(slug);
    const payload = await fetchJson(`${apiBaseUrl}/posts/${encodedSlug}?preview=1`);
    const post = payload?.data || null;

    if (post) {
      const postTitle = sanitizeText(post.title) || DEFAULT_TITLE;
      title = `${postTitle} | ${DEFAULT_SITE_NAME}`;
      description =
        sanitizeText(post.description) || sanitizeText(post.content).slice(0, 220) || DEFAULT_DESCRIPTION;
      image = resolveAssetUrl({
        imageUrl: post.coverImage,
        requestOrigin,
        apiBaseUrl,
      });
    }
  }

  const metaTags = buildMetaTags({
    title,
    description,
    image,
    url: canonicalUrl,
    type: 'article',
  });

  try {
    const indexHtml = await getIndexHtml(requestOrigin);
    const html = injectMetaTags({ html: indexHtml, metaTags, title });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);
  } catch (_error) {
    const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
${metaTags}
    <title>${escapeHtml(title)}</title>
  </head>
  <body>
    <p>${escapeHtml(description)}</p>
  </body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    return res.status(200).send(fallbackHtml);
  }
}
