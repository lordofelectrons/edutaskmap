/**
 * Detect URLs in text and extract the first valid URL
 * @param {string} text - The text to search for URLs
 * @returns {string|null} - The first valid URL found, or null if none
 */
export function detectUrl(text) {
  if (!text || typeof text !== 'string') return null;
  
  // Enhanced URL regex that matches most common URL patterns
  const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`\[\]]+)/gi;
  const matches = text.match(urlRegex);
  
  if (matches && matches.length > 0) {
    // Return the first valid URL
    try {
      new URL(matches[0]);
      return matches[0];
    } catch (e) {
      return null;
    }
  }
  
  return null;
}

/**
 * Extract domain from URL
 * @param {string} url - The URL to extract domain from
 * @returns {string|null} - The domain or null if invalid
 */
export function extractDomain(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

/**
 * Check if URL is likely to have metadata (not a file download, etc.)
 * @param {string} url - The URL to check
 * @returns {boolean} - True if URL likely has metadata
 */
export function isMetadataSupported(url) {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Skip file extensions that typically don't have metadata
    const skipExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.7z', '.tar', '.gz'];
    const pathname = urlObj.pathname.toLowerCase();
    
    for (const ext of skipExtensions) {
      if (pathname.endsWith(ext)) {
        return false;
      }
    }
    
    // Skip common non-web protocols
    const skipProtocols = ['mailto:', 'tel:', 'ftp:'];
    for (const protocol of skipProtocols) {
      if (url.toLowerCase().startsWith(protocol)) {
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
}
