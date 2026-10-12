/**
 * Google Drive URL Parser and Asset Helper
 * Handles extraction of file IDs, direct image/download URLs,
 * thumbnail previews, and view URLs.
 */

export interface GoogleDriveInfo {
  isGoogleDrive: boolean;
  fileId: string | null;
  directDownloadUrl: string | null;
  directImageUrl: string | null;
  thumbnailUrl: string | null;
  viewUrl: string | null;
  previewUrl: string | null;
}

/**
 * Extracts a Google Drive file ID from various sharing link formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/uc?export=download&id=FILE_ID
 * - https://docs.google.com/file/d/FILE_ID/...
 * - Raw file ID (25+ alphanumeric characters)
 */
export function extractGoogleDriveFileId(inputUrl: string): string | null {
  if (!inputUrl) return null;
  const url = inputUrl.trim();

  // Pattern 1: /file/d/<id>
  const fileDMatch = url.match(/(?:drive|docs)\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // Pattern 2: id=<id>
  const idParamMatch = url.match(/(?:drive|docs)\.google\.com\/(?:open|uc|file)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i);
  if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

  // Pattern 3: /document/d/<id>, /presentation/d/<id>, /spreadsheets/d/<id>
  const docMatch = url.match(/docs\.google\.com\/(?:document|presentation|spreadsheets)\/d\/([a-zA-Z0-9_-]+)/i);
  if (docMatch && docMatch[1]) return docMatch[1];

  // Pattern 4: direct ID if user pasted only the 28-33 char ID
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Returns full parsed Google Drive URLs and metadata
 */
export function parseGoogleDriveUrl(inputUrl: string): GoogleDriveInfo {
  if (!inputUrl) {
    return {
      isGoogleDrive: false,
      fileId: null,
      directDownloadUrl: null,
      directImageUrl: null,
      thumbnailUrl: null,
      viewUrl: null,
      previewUrl: null,
    };
  }

  const isGoogle = /drive\.google\.com|docs\.google\.com/i.test(inputUrl);
  const fileId = extractGoogleDriveFileId(inputUrl);

  if (!fileId) {
    return {
      isGoogleDrive: isGoogle,
      fileId: null,
      directDownloadUrl: null,
      directImageUrl: null,
      thumbnailUrl: null,
      viewUrl: null,
      previewUrl: null,
    };
  }

  return {
    isGoogleDrive: true,
    fileId,
    // Google Direct CDN for image rendering (high resolution, handles images seamlessly)
    directImageUrl: `https://lh3.googleusercontent.com/d/${fileId}`,
    // Google thumbnail endpoint (with width 1000px)
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
    // Direct binary download
    directDownloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    // Standard view URL
    viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
    // Embed iframe preview URL
    previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
  };
}

/**
 * Resolves any URL (Google Drive, Supabase, /uploads/, or external)
 * to an optimal image preview URL.
 */
export function resolveDisplayImageUrl(url: string | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  const gDrive = parseGoogleDriveUrl(trimmed);
  if (gDrive.isGoogleDrive && gDrive.fileId) {
    // Return Google direct image CDN URL
    return gDrive.directImageUrl || gDrive.thumbnailUrl || trimmed;
  }
  return trimmed;
}

/**
 * Resolves any certificate URL for the custom certificate viewer or download
 */
export function resolveCertificateUrl(url: string | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  const gDrive = parseGoogleDriveUrl(trimmed);
  if (gDrive.isGoogleDrive && gDrive.fileId) {
    return gDrive.directDownloadUrl || trimmed;
  }
  return trimmed;
}
