const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5001';

/**
 * Generates a full image URL from a partial path or object.
 * Handles both Temple (imagePath) and Bhaktnivas (imageUrl/ImageUrl) naming.
 * 
 * @param {string|object} imageSource - The image path or the data object containing it
 * @param {string} type - 'temple' or 'bhaktnivas' (used for default fallback)
 * @returns {string} The full URL to the image
 */
export const getImageUrl = (imageSource, type = 'temple') => {
    // 1. Extract path from object if necessary
    let path = typeof imageSource === 'string' ? imageSource : null;

    if (imageSource && typeof imageSource === 'object') {
        // Try all known backend naming conventions
        path = imageSource.imagePath || imageSource.imageUrl || imageSource.ImageUrl;
    }

    // 2. Return default if no path
    if (!path) {
        return type === 'temple'
            ? '/assets/images/temples/default-temple.jpg'
            : '/assets/images/bhaktnivas/default-bhaktnivas.jpg';
    }

    // 3. Keep absolute URLs as is
    if (path.startsWith('http')) {
        return path;
    }

    // 4. Handle relative paths from public folder
    if (path.startsWith('/assets')) {
        return path;
    }

    // 5. Prepend backend BASE_URL for all other relative paths (typically from /uploads)
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Ensure we don't double prepend if the path already starts with the base URL origin (edge case)
    try {
        const url = new URL(normalizedPath, BASE_URL);
        return url.toString();
    } catch (e) {
        return `${BASE_URL}${normalizedPath}`;
    }
};
