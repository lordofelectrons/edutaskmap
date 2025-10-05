import { extractDomain } from './linkUtils.js';

/**
 * Fetch metadata from a URL using Open Graph and other meta tags
 * @param {string} url - The URL to fetch metadata from
 * @returns {Promise<Object>} - Object containing metadata
 */
export async function fetchMetadata(url) {
  const metadata = {
    url,
    title: null,
    site_name: null,
    image_url: null,
    domain: extractDomain(url)
  };

  try {
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EduTaskMap/1.0; +https://edutaskmap.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      signal: controller.signal,
      redirect: 'follow'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    metadata.title = extractTitle(html, url);
    metadata.site_name = extractSiteName(html, metadata.domain);
    metadata.image_url = extractImageUrl(html, url);

    return metadata;
  } catch (error) {
    console.error('Error fetching metadata for URL:', url, error.message);
    
    // Fallback: try to extract basic info from URL
    metadata.title = extractTitleFromUrl(url);
    metadata.site_name = metadata.domain;
    
    return metadata;
  }
}

/**
 * Extract title from HTML content
 * @param {string} html - The HTML content
 * @param {string} url - The original URL for fallback
 * @returns {string|null} - The extracted title
 */
function extractTitle(html, url) {
  // Try Open Graph title first
  let title = extractMetaContent(html, 'og:title');
  if (title) return title;

  // Try Twitter card title
  title = extractMetaContent(html, 'twitter:title');
  if (title) return title;

  // Try HTML title tag
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }

  // Fallback to URL-based title
  return extractTitleFromUrl(url);
}

/**
 * Extract site name from HTML content
 * @param {string} html - The HTML content
 * @param {string} domain - The domain for fallback
 * @returns {string|null} - The extracted site name
 */
function extractSiteName(html, domain) {
  // Try Open Graph site name
  let siteName = extractMetaContent(html, 'og:site_name');
  if (siteName) return siteName;

  // Try application name
  siteName = extractMetaContent(html, 'application-name');
  if (siteName) return siteName;

  // Fallback to domain
  return domain;
}

/**
 * Extract image URL from HTML content
 * @param {string} html - The HTML content
 * @param {string} baseUrl - The base URL for resolving relative URLs
 * @returns {string|null} - The extracted image URL
 */
function extractImageUrl(html, baseUrl) {
  // Try Open Graph image
  let imageUrl = extractMetaContent(html, 'og:image');
  if (imageUrl) {
    return resolveUrl(imageUrl, baseUrl);
  }

  // Try Twitter card image
  imageUrl = extractMetaContent(html, 'twitter:image');
  if (imageUrl) {
    return resolveUrl(imageUrl, baseUrl);
  }

  // Try to find the first significant image in the content
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch && imgMatch[1]) {
    return resolveUrl(imgMatch[1], baseUrl);
  }

  return null;
}

/**
 * Extract content from meta tags
 * @param {string} html - The HTML content
 * @param {string} property - The meta property to look for
 * @returns {string|null} - The extracted content
 */
function extractMetaContent(html, property) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, 'i')
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Resolve relative URLs to absolute URLs
 * @param {string} url - The URL to resolve
 * @param {string} baseUrl - The base URL
 * @returns {string} - The resolved absolute URL
 */
function resolveUrl(url, baseUrl) {
  if (!url) return null;
  
  try {
    // If already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // If protocol-relative, use the base URL's protocol
    if (url.startsWith('//')) {
      const baseUrlObj = new URL(baseUrl);
      return `${baseUrlObj.protocol}${url}`;
    }

    // If relative, resolve against base URL
    return new URL(url, baseUrl).href;
  } catch (e) {
    return url; // Return original if resolution fails
  }
}

/**
 * Extract a meaningful title from URL when HTML parsing fails
 * @param {string} url - The URL to extract title from
 * @returns {string} - A title derived from the URL
 */
function extractTitleFromUrl(url) {
  try {
    const urlObj = new URL(url);
    let pathname = urlObj.pathname;
    
    // Remove trailing slashes and common extensions
    pathname = pathname.replace(/\/$/, '').replace(/\.(html|htm|php|asp|aspx)$/i, '');
    
    // Split by slashes and take the last meaningful part
    const parts = pathname.split('/').filter(part => part && part !== 'index');
    if (parts.length > 0) {
      const title = parts[parts.length - 1];
      // Convert hyphens and underscores to spaces and capitalize
      return title.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Fallback to domain name
    return urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    return 'Link';
  }
}
