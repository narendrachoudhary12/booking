// pages/host/PhotosPage.jsx
// Upload, remove and choose the main photo of the selected hotel.

import { useEffect, useRef, useState } from "react";
import popup from "../../components/common/Popup/popupService";
import {
  apiError,
  deleteHotelPhoto,
  getHotelPhotos,
  setPrimaryHotelPhoto,
  uploadHotelPhotos,
} from "../../services/hostApi";
import { assetUrl } from "../../utils/hotelImages";

// Same limits as the API
const MAX_BYTES = 4 * 1024 * 1024;
const MAX_PER_UPLOAD = 10;

// Keeps only image files of an allowed size; tells the user about the rest
export function pickValidPhotos(fileList, limit) {
  const files = Array.from(fileList || []);
  const valid = files.filter(
    (f) => f.type.startsWith("image/") && f.size <= MAX_BYTES
  );

  if (valid.length < files.length) {
    popup.warning("Some files were skipped. Photos must be JPG, PNG or WebP, up to 4 MB each.");
  }

  if (valid.length > limit) {
    popup.warning(`Only the first ${limit} photos were added.`);
  }

  return valid.slice(0, limit);
}

export default function PhotosPage({ hotel }) {
  const fileRef = useRef(null);

  const [photos, setPhotos] = useState(null); // null = loading
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPhotos(null);
    setError(null);

    getHotelPhotos(hotel.id)
      .then((list) => !cancelled && setPhotos(list))
      .catch((err) => !cancelled && setError(apiError(err)));

    return () => {
      cancelled = true;
    };
  }, [hotel.id]);

  // Every photo call answers with the new full list
  const run = async (call, successMessage) => {
    setBusy(true);

    try {
      setPhotos(await call());
      if (successMessage) popup.success(successMessage);
    } catch (err) {
      popup.error(apiError(err));
    }

    setBusy(false);
  };

  const handleFiles = (e) => {
    const files = pickValidPhotos(e.target.files, MAX_PER_UPLOAD);
    e.target.value = ""; // lets the same files be picked again
    if (files.length === 0) return;

    run(() => uploadHotelPhotos(hotel.id, files), "Photos uploaded");
  };

  const handleDelete = async (photo) => {
    if (!(await popup.confirm("Remove this photo?"))) return;
    run(() => deleteHotelPhoto(hotel.id, photo), "Photo removed");
  };

  return (
    <div className="hd-card">
      <div className="hd-card-header">
        <div className="hd-card-title">
          Photos of {hotel.name}
          {photos ? ` (${photos.length})` : ""}
        </div>
        <button
          className="hd-btn hd-btn-primary hd-btn-sm"
          disabled={busy || !photos}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? "Please wait..." : "+ Upload photos"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          hidden
          onChange={handleFiles}
        />
      </div>

      <div className="hd-card-body">
        <div style={{ fontSize: 12, color: "var(--hd-muted)", marginBottom: 16 }}>
          JPG, PNG or WebP, up to 4 MB each. The main photo is the one guests
          see first in search results.
        </div>

        {error && <div style={{ color: "var(--hd-red)" }}>{error}</div>}
        {!error && !photos && <div style={{ color: "var(--hd-muted)" }}>Loading…</div>}
        {photos?.length === 0 && (
          <div style={{ color: "var(--hd-muted)", fontSize: 14 }}>
            No photos yet. Upload a few to show your hotel to guests.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: 14,
          }}
        >
          {photos?.map((photo) => (
            <div
              key={`${photo.id}-${photo.url}`}
              style={{
                border: photo.is_primary
                  ? "2px solid var(--hd-green)"
                  : "1px solid var(--hd-border)",
                borderRadius: 8,
                overflow: "hidden",
                background: "var(--hd-bg)",
              }}
            >
              <img
                src={assetUrl(photo.url)}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
              />
              <div style={{ display: "flex", gap: 6, padding: 8, alignItems: "center", flexWrap: "wrap" }}>
                {photo.is_primary ? (
                  <span className="hd-badge hd-badge-confirmed">Main photo</span>
                ) : (
                  !photo.legacy && (
                    <button
                      className="hd-btn hd-btn-outline hd-btn-sm"
                      disabled={busy}
                      onClick={() =>
                        run(() => setPrimaryHotelPhoto(hotel.id, photo.id), "Main photo updated")
                      }
                    >
                      Set as main
                    </button>
                  )
                )}
                <button
                  className="hd-btn hd-btn-outline hd-btn-sm"
                  disabled={busy}
                  onClick={() => handleDelete(photo)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
