import { ASSET_BASE } from "../config/api";

// Turns a stored image value into a URL the browser can load.
// Uploaded photos are saved as full URLs; older records hold a path that is
// relative to ASSET_BASE.
export const assetUrl = (path) =>
  /^https?:\/\//i.test(path) ? path : ASSET_BASE + path;

// Every picture of a hotel as full URLs, main photo first.
// hotel.images rows come in two shapes:
//   { image_url: "https://.../a.jpg", is_primary: 1 }            (uploaded)
//   { image_url: '["hotelimages/a.jpg","hotelimages/b.jpg"]' }   (older import)
// hotel.image (the cover) is used when there are no rows.
export function hotelImageUrls(hotel) {
  const rows = [...(hotel?.images || [])].sort(
    (a, b) => Number(b.is_primary || 0) - Number(a.is_primary || 0)
  );

  const paths = rows.flatMap((row) => {
    if (!row?.image_url) return [];

    try {
      const parsed = JSON.parse(row.image_url);
      return Array.isArray(parsed) ? parsed : [row.image_url];
    } catch {
      return [row.image_url]; // a plain URL / path, not JSON
    }
  });

  if (paths.length === 0 && hotel?.image) paths.push(hotel.image);

  return paths.filter(Boolean).map(assetUrl);
}
