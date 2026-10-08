import { API_BASE, ASSET_BASE } from "../../config/api";
import React, { useEffect, useState, useMemo } from "react";
import { Link } from 'react-router-dom';
import './HotelListing.css';
import axios from "axios";

const base_url = ASSET_BASE;
const FALLBACK_IMG = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";

/* ───────── IMAGE HELPER ───────── */
// hotel.images is an array like:
// [{ image_url: '["hotelimages/a.jpg","hotelimages/b.jpg"]' }]
// image_url is a JSON-stringified array, so we parse it and grab the first path.
// Falls back to FALLBACK_IMG if anything is missing / malformed.
function getHotelImage(hotel) {
  try {
    const imgObj = hotel.images?.[0];
    if (!imgObj?.image_url) return FALLBACK_IMG;

    const parsed = JSON.parse(imgObj.image_url);
    const firstPath = Array.isArray(parsed) ? parsed[0] : null;

    return firstPath ? base_url + firstPath : FALLBACK_IMG;
  } catch (e) {
    return FALLBACK_IMG;
  }
}

// Returns the FULL list of image URLs for a hotel (for the left/right arrows).
// Falls back to a single-item array with FALLBACK_IMG if nothing usable is found.
function getHotelImages(hotel) {
  try {
    const imgObj = hotel.images?.[0];
    if (!imgObj?.image_url) return [FALLBACK_IMG];

    const parsed = JSON.parse(imgObj.image_url);
    if (!Array.isArray(parsed) || parsed.length === 0) return [FALLBACK_IMG];

    return parsed.map(p => base_url + p);
  } catch (e) {
    return [FALLBACK_IMG];
  }
}

// hotel.amenities now comes as a comma-separated string, e.g.
// "Lunch, Dinner, Reservations, Wheelchair, Bar"
// This turns it into a clean array of trimmed names: ["Lunch","Dinner",...]
function getAmenityList(hotel) {
  if (!hotel?.amenities) return [];
  if (Array.isArray(hotel.amenities)) {
    // backward-compat, in case some hotels still send the old array-of-objects shape
    return hotel.amenities
      .map(a => (typeof a === "string" ? a : a?.name || a?.amenity_id))
      .filter(Boolean);
  }
  return String(hotel.amenities)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

// Maps an amenity name to a relevant icon/emoji. Matches by keyword (case-insensitive),
// so "Wheelchair Access", "wheelchair", etc. all resolve correctly.
// Falls back to a generic hotel icon if nothing matches.
const AMENITY_ICON_MAP = [
  { keywords: ["wifi", "internet"],                    icon: "📶" },
  { keywords: ["parking"],                              icon: "🅿️" },
  { keywords: ["pool", "swimming"],                      icon: "🏊" },
  { keywords: ["gym", "fitness"],                        icon: "🏋️" },
  { keywords: ["spa"],                                   icon: "💆" },
  { keywords: ["bar"],                                   icon: "🍸" },
  { keywords: ["restaurant"],                            icon: "🍽️" },
  { keywords: ["breakfast"],                              icon: "🥐" },
  { keywords: ["lunch"],                                  icon: "🍲" },
  { keywords: ["dinner"],                                 icon: "🍛" },
  { keywords: ["wheelchair", "accessib", "disab"],        icon: "♿" },
  { keywords: ["reservation", "booking"],                 icon: "📅" },
  { keywords: ["air condition", "ac ", "cooling"],         icon: "❄️" },
  { keywords: ["laundry"],                                icon: "🧺" },
  { keywords: ["tv", "television"],                       icon: "📺" },
  { keywords: ["room service"],                            icon: "🛎️" },
  { keywords: ["pet"],                                    icon: "🐾" },
  { keywords: ["smoking"],                                icon: "🚬" },
  { keywords: ["elevator", "lift"],                       icon: "🛗" },
  { keywords: ["security", "cctv"],                       icon: "🛡️" },
  { keywords: ["shuttle", "transport", "transfer"],        icon: "🚐" },
  { keywords: ["kitchen", "kitchenette"],                 icon: "🍳" },
  { keywords: ["conference", "meeting", "business"],       icon: "💼" },
  { keywords: ["garden"],                                 icon: "🌳" },
  { keywords: ["beach"],                                  icon: "🏖️" },
  { keywords: ["playground", "kids"],                     icon: "🧒" },
];

function getAmenityIcon(name) {
  if (!name) return "🏨";
  const lower = name.toLowerCase();
  const match = AMENITY_ICON_MAP.find(entry =>
    entry.keywords.some(kw => lower.includes(kw))
  );
  return match ? match.icon : "🏨";
}

/* ───────── CARD COMPONENT ───────── */
function HotelCard({ hotel }) {
  const badgeClass =
    hotel.type === "Luxury hotel"
      ? "luxury"
      : hotel.type === "Apartment"
      ? "apartment"
      : "";

  // All available images for this hotel + which one is currently shown
  const images = useMemo(() => getHotelImages(hotel), [hotel]);
  const [imgIndex, setImgIndex] = useState(0);

  const goPrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="hotel-card">
      <div className="hc-img-wrap">
        <Link to={`/hotel-details/${hotel.slug}`}>
          <img
            className="hc-img"
            src={images[imgIndex]}
            alt={hotel.name}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              display: "block",
              cursor: "pointer"
            }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
        </Link>
        <div className={`hc-badge ${badgeClass}`}>
          {hotel.type || "Hotel"}
        </div>
        {hotel.price_start_from && (
          <div className="hc-save">
            From ₦{hotel.price_start_from}
          </div>
        )}
        <div className="hc-likes">
          👍 {hotel.total_reviews || 0} reviews
        </div>

        {images.length > 1 && (
          <>
            <button className="hc-arrow left" onClick={goPrev}>‹</button>
            <button className="hc-arrow right" onClick={goNext}>›</button>
          </>
        )}
      </div>

      <div className="hc-body">
        <div className="hc-top">
          <div>
            <Link className="hc-name" to={`/hotel-details/${hotel.slug}`}>
              {hotel.name}
            </Link>
            <div className="hc-addr">{hotel.address}</div>
          </div>
        </div>

        <div className="hc-mid">
          <div style={{ flex: 1 }}>
            <div className="hc-review-text">{hotel.description}</div>
          </div>
          {hotel.rating && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <div className="hc-rating-badge">{hotel.rating}</div>
              <div className="hc-rating-sub">{hotel.total_reviews} reviews</div>
            </div>
          )}
        </div>

        <div className="hc-bottom">
          <div className="hc-amenities">
            {getAmenityList(hotel).map((name, i) => (
              <div className="hc-amenity" key={i}>
                <span>{getAmenityIcon(name)}</span>
                {name}
              </div>
            ))}
          </div>
          <Link to={`/hotel-details/${hotel.slug}`} className="book-now-btn">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ───────── PRICE RANGE HELPER ───────── */
// Converts "39,000" or 39000 → number
function parsePrice(val) {
  if (!val) return 0;
  return Number(String(val).replace(/,/g, ""));
}

/* ───────── AREA/CITY JUNK FILTER HELPER ───────── */
// Filters out phone numbers, country name, and other non-area junk
// that used to leak into the "Area / Location" filter list.
function isJunkAreaToken(str) {
  if (!str) return true;
  const trimmed = str.trim();

  // Pure numbers, phone numbers (with or without +, spaces, dashes)
  if (/^\+?\d[\d\s\-]{4,}$/.test(trimmed)) return true;

  // Country name (case-insensitive) — not useful as an "area" filter
  if (/^nigeria$/i.test(trimmed)) return true;

  // Too short to be a meaningful area name
  if (trimmed.length <= 2) return true;

  // Anything that's mostly digits (postal codes, etc.)
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount / trimmed.length > 0.4) return true;

  return false;
}

/* ───────── DERIVE CITY DISPLAY NAME FROM SLUG ───────── */
// "hotels-in-kano" -> "Kano" ; "hotels-in-port-harcourt" -> "Port Harcourt"
function cityNameFromSlug(slug) {
  if (!slug) return "";
  const cleaned = slug.replace(/^hotels-in-/, "").replace(/-/g, " ");
  return cleaned
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ───────── MAIN COMPONENT ───────── */
export default function HotelListingPage({ slug }) {

  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  // Prefer city name coming back from the API (first hotel's city field);
  // fall back to deriving it from the slug so the heading is never empty
  // while the API call is still loading.
  const cityName = useMemo(() => {
    const apiCity = data[0]?.city;
    return apiCity || cityNameFromSlug(slug);
  }, [data, slug]);

  const [activeSort, setActiveSort] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  /* ── DYNAMIC FILTER STATES ── */
  const [selectedTypes,     setSelectedTypes]     = useState([]);   // property types
  const [selectedAmenities, setSelectedAmenities] = useState([]);   // amenity ids
  const [selectedAreas,     setSelectedAreas]     = useState([]);   // city/area keywords
  const [minPrice,          setMinPrice]          = useState(0);
  const [maxPrice,          setMaxPrice]          = useState(0);
  const [priceRange,        setPriceRange]        = useState([0, 0]);// [min, max] slider values
  const [minRating,         setMinRating]         = useState(0);

  /* ───────── API CALL ───────── */
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/cityHotels/${slug}`)
      .then((res) => {
        const hotels = res.data.data || [];
        setData(hotels);

        // TEMP DEBUG: check what address/city fields actually look like
        console.log("Sample addresses:", hotels.slice(0, 10).map(h => ({ address: h.address, city: h.city, area: h.area, locality: h.locality })));

        // Derive price bounds from actual data
        const prices = hotels.map(h => parsePrice(h.price_start_from)).filter(Boolean);
        const lo = prices.length ? Math.min(...prices) : 0;
        const hi = prices.length ? Math.max(...prices) : 0;
        setMinPrice(lo);
        setMaxPrice(hi);
        setPriceRange([lo, hi]);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [slug]);

  /* ───────── DERIVED FILTER OPTIONS FROM DATA ───────── */

  // Unique property types
  const allTypes = useMemo(() => {
    const set = new Set(data.map(h => h.type).filter(Boolean));
    return Array.from(set);
  }, [data]);

  // Unique amenities, now derived from the comma-separated amenities string
  // e.g. "Lunch, Dinner, Reservations, Wheelchair, Bar" on each hotel.
  const allAmenities = useMemo(() => {
    const set = new Set();
    data.forEach(h => getAmenityList(h).forEach(name => set.add(name)));
    return Array.from(set).map(name => ({ id: name, label: name }));
  }, [data]);

  // Unique areas extracted from addresses.
  // Priority: dedicated area/locality/neighborhood field (if API provides one)
  // Fallback: parse the address string, but check EVERY comma-part (not just
  // the last 2), skip the city name itself, and skip junk tokens.
  const allAreas = useMemo(() => {
    const set = new Set();
    data.forEach(h => {
      // 1. Prefer explicit fields if the API returns them
      const explicit = h.area || h.locality || h.neighborhood || h.district;
      if (explicit && !isJunkAreaToken(explicit)) {
        set.add(explicit.trim());
        return; // good data found, no need to guess from address
      }

      // 2. Fallback: parse from full address string
      if (h.address) {
        const parts = h.address.split(",").map(s => s.trim()).filter(Boolean);
        parts.forEach(p => {
          // skip if it's junk, or if it's literally the same as the city (e.g. "Lagos")
          if (isJunkAreaToken(p)) return;
          if (h.city && p.toLowerCase() === h.city.trim().toLowerCase()) return;
          set.add(p);
        });
      }
    });
    return Array.from(set);
  }, [data]);

  // Unique ratings available (rounded to .5)
  const allRatings = useMemo(() => {
    const set = new Set(
      data
        .map(h => Math.floor(Number(h.rating || 0) * 2) / 2)
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => b - a);
  }, [data]);

  /* ───────── TOGGLE HELPERS ───────── */
  function toggle(arr, setArr, val) {
    setArr(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
    setActivePage(1);
  }

  /* ───────── FILTERED + SORTED DATA ───────── */
  const filteredData = useMemo(() => {
    let result = [...data];

    // 1. Property type filter
    if (selectedTypes.length > 0) {
      result = result.filter(h => selectedTypes.includes(h.type));
    }

    // 2. Amenity filter
    if (selectedAmenities.length > 0) {
      result = result.filter(h => {
        const hotelAmenities = getAmenityList(h);
        return selectedAmenities.every(name => hotelAmenities.includes(name));
      });
    }

    // 3. Area filter
    if (selectedAreas.length > 0) {
      result = result.filter(h =>
        selectedAreas.some(area =>
          h.address?.includes(area) || h.city?.includes(area)
        )
      );
    }

    // 4. Price range filter
    result = result.filter(h => {
      const p = parsePrice(h.price_start_from);
      return p >= priceRange[0] && p <= priceRange[1];
    });

    // 5. Minimum rating filter
    if (minRating > 0) {
      result = result.filter(h => Number(h.rating || 0) >= minRating);
    }

    // 6. Sort
    if (activeSort === 1) {
      // Luxury — highest price first
      result.sort((a, b) => parsePrice(b.price_start_from) - parsePrice(a.price_start_from));
    } else if (activeSort === 2) {
      // Cheap — lowest price first
      result.sort((a, b) => parsePrice(a.price_start_from) - parsePrice(b.price_start_from));
    } else if (activeSort === 3) {
      // Best — highest rating first
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (activeSort === 4) {
      // Most Popular — most reviews first
      result.sort((a, b) => Number(b.total_reviews || 0) - Number(a.total_reviews || 0));
    }

    return result;
  }, [data, selectedTypes, selectedAmenities, selectedAreas, priceRange, minRating, activeSort]);

  /* ───────── PAGINATION ───────── */
  const totalPages  = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
  const pagedData   = filteredData.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  /* ───────── RESET ALL FILTERS ───────── */
  function resetFilters() {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedAreas([]);
    setPriceRange([minPrice, maxPrice]);
    setMinRating(0);
    setActivePage(1);
  }

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedAmenities.length > 0 ||
    selectedAreas.length > 0 ||
    priceRange[0] !== minPrice ||
    priceRange[1] !== maxPrice ||
    minRating > 0;

  /* ───────── RENDER ───────── */
  return (
    <>

      <div className="lp">
        <div className="lp-wrap">

          {/* ───────── SIDEBAR (DYNAMIC) ───────── */}
          <aside className="lp-sidebar">

            <div className="sb-subscribe">
              <p>Stay updated with our latest rates</p>
              <div className="sb-sub-row">
                <input type="email" placeholder="Enter email address" />
                <button className="sb-sub-btn">Subscribe</button>
              </div>
            </div>

            {/* <button className="sb-shortlet-btn">
              Shortlet Apartment in {cityName}
            </button> */}

            {/* ── FILTER HEADER with Reset ── */}
            <div className="sb-card">
              <div className="sb-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>☰ Search Filters</span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    style={{
                      fontSize: 11,
                      background: "none",
                      border: "1px solid #e74c3c",
                      color: "#e74c3c",
                      borderRadius: 4,
                      padding: "2px 8px",
                      cursor: "pointer"
                    }}
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* ── DYNAMIC PRICE RANGE ── */}
              <div className="sb-section-label">
                What is your budget per night?
              </div>

              {maxPrice > 0 && (
                <>
                  <div className="budget-row">
                    <span>From ₦{priceRange[0].toLocaleString()}</span>
                    <span>To ₦{priceRange[1].toLocaleString()}</span>
                  </div>

                  <div style={{ padding: "8px 0 12px" }}>
                    {/* Min price slider */}
                    <div style={{ marginBottom: 6 }}>
                      <label style={{ fontSize: 11, color: "#888" }}>Min Price</label>
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={500}
                        value={priceRange[0]}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (val <= priceRange[1]) {
                            setPriceRange([val, priceRange[1]]);
                            setActivePage(1);
                          }
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>
                    {/* Max price slider */}
                    <div>
                      <label style={{ fontSize: 11, color: "#888" }}>Max Price</label>
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={500}
                        value={priceRange[1]}
                        onChange={e => {
                          const val = Number(e.target.value);
                          if (val >= priceRange[0]) {
                            setPriceRange([priceRange[0], val]);
                            setActivePage(1);
                          }
                        }}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── DYNAMIC PROPERTY TYPE ── */}
            {allTypes.length > 0 && (
              <div className="sb-card">
                <div className="sb-section-label">Property type</div>
                <div className="cb-list">
                  {allTypes.map(type => (
                    <label className="cb-item" key={type}>
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggle(selectedTypes, setSelectedTypes, type)}
                      />
                      {type}
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "#999" }}>
                        ({data.filter(h => h.type === type).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ── DYNAMIC AMENITIES ── */}
            {allAmenities.length > 0 && (
              <div className="sb-card">
                <div className="sb-section-label">
                  Only show hotels with amenities
                </div>
                <div className="amenity-list">
                  {allAmenities.map(a => (
                    <div className="amenity-item-sb" key={a.id}>
                      <div className="amenity-icon-sb">{getAmenityIcon(a.label)}</div>
                      <span className="amenity-name-sb">{a.label}</span>
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(a.id)}
                        onChange={() => toggle(selectedAmenities, setSelectedAmenities, a.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DYNAMIC AREAS ── */}
            {allAreas.length > 0 && (
              <div className="sb-card">
                <div className="sb-section-label">Area / Location</div>
                <div className="cb-list" style={{ maxHeight: 200, overflowY: "auto" }}>
                  {allAreas.map(area => (
                    <label className="cb-item" key={area}>
                      <input
                        type="checkbox"
                        checked={selectedAreas.includes(area)}
                        onChange={() => toggle(selectedAreas, setSelectedAreas, area)}
                      />
                      {area}
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "#999" }}>
                        ({data.filter(h =>
                          h.address?.includes(area) || h.city?.includes(area)
                        ).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ── DYNAMIC RATING FILTER ── */}
            {allRatings.length > 0 && (
              <div className="sb-card">
                <div className="sb-section-label">Minimum Rating</div>
                <div className="cb-list">
                  {[0, ...allRatings].map(r => (
                    <label className="cb-item" key={r}>
                      <input
                        type="radio"
                        name="minRating"
                        checked={minRating === r}
                        onChange={() => { setMinRating(r); setActivePage(1); }}
                      />
                      {r === 0 ? "All ratings" : `${r}+ ⭐`}
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "#999" }}>
                        ({r === 0
                          ? data.length
                          : data.filter(h => Number(h.rating || 0) >= r).length
                        })
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

          </aside>

          {/* ───────── MAIN ───────── */}
          <main className="lp-main">

            <Link
                  to={`/hotels/${slug}`}
                  className="main-heading"
                  style={{
                    textDecoration: "none",
                    color: "#D4AF37",
                    display: "block",
                    cursor: "pointer",
                  }}
                >
                  {filteredData.length} Hotels in {cityName}

                  {hasActiveFilters && (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: "#D4AF37",
                        marginLeft: 8,
                      }}
                    >
                      (filtered from {data.length})
                    </span>
                  )}
              </Link>
            <p className="main-subheading">
              Select &amp; book from {filteredData.length} Hotels near {cityName}
            </p>
            {/* <p className="main-desc">
              Book a great hotel in {cityName}. stay9jahotels has luxury Hotels, Best Hotels, Most Popular Hotels, lodges, airbnbs, short-let apartments and more. All at the best rates that are only available online!
            </p> */}

            {/* ACTIVE FILTER CHIPS */}
            {hasActiveFilters && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {selectedTypes.map(t => (
                  <span key={t} className="chip" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {t}
                    <button
                      onClick={() => toggle(selectedTypes, setSelectedTypes, t)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}
                    >✕</button>
                  </span>
                ))}
                {selectedAmenities.map(id => {
                  const a = allAmenities.find(x => x.id === id);
                  return (
                    <span key={id} className="chip" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {a?.label}
                      <button
                        onClick={() => toggle(selectedAmenities, setSelectedAmenities, id)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}
                      >✕</button>
                    </span>
                  );
                })}
                {selectedAreas.map(area => (
                  <span key={area} className="chip" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {area}
                    <button
                      onClick={() => toggle(selectedAreas, setSelectedAreas, area)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}
                    >✕</button>
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="chip" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {minRating}+ ⭐
                    <button
                      onClick={() => setMinRating(0)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}
                    >✕</button>
                  </span>
                )}
                {(priceRange[0] !== minPrice || priceRange[1] !== maxPrice) && (
                  <span className="chip" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    ₦{priceRange[0].toLocaleString()} – ₦{priceRange[1].toLocaleString()}
                    <button
                      onClick={() => setPriceRange([minPrice, maxPrice])}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}
                    >✕</button>
                  </span>
                )}
              </div>
            )}

            {/* SORT TABS */}
            <div className="sort-tabs">
              {["Our Top Picks", "Luxury Hotels", "Premium Hotels", "Best Hotels", "Most Popular Hotels"].map((t, i) => (
                <button
                  key={t}
                  className={`sort-tab${activeSort === i ? " active" : ""}`}
                  onClick={() => { setActiveSort(i); setActivePage(1); }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* AREA CHIPS (dynamic) */}
            <div className="only-show-row">
              <span>Only show</span>
              {allAreas.slice(0, 6).map(area => (
                <button
                  className={`chip${selectedAreas.includes(area) ? " active" : ""}`}
                  key={area}
                  onClick={() => toggle(selectedAreas, setSelectedAreas, area)}
                >
                  {area}
                </button>
              ))}
            </div>

            {/* HOTEL LIST */}
            {loading ? (
              <p>Loading hotels...</p>
            ) : pagedData.length > 0 ? (
              pagedData.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))
            ) : (
              <div style={{ padding: "40px 0", textAlign: "center", color: "#888" }}>
                <p style={{ fontSize: 18 }}>No hotels match your filters.</p>
                <button
                  onClick={resetFilters}
                  style={{
                    marginTop: 12,
                    padding: "8px 20px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    background: "none"
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}

            <div className="deals-banner">
              <div className="deals-left">
                <div className="deals-lock">🔒</div>
                <div className="deals-text">
                  <strong>SPECIAL HOTEL DEALS AND OFFERS</strong>
                  <span>Receive email when prices drop in nearby location</span>
                </div>
              </div>
              <div className="deals-right">
                <input type="email" placeholder="Enter your email address" />
                <button className="deals-unlock-btn">Unlock</button>
              </div>
            </div>

            {/* PAGINATION */}
            <div className="pagination-wrap">
              <div className="pagination-info">
                Showing Results {Math.min((activePage - 1) * ITEMS_PER_PAGE + 1, filteredData.length)} –{" "}
                {Math.min(activePage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length}
              </div>

              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={activePage === 1}
                  onClick={() => setActivePage(p => p - 1)}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n =>
                    n === 1 ||
                    n === totalPages ||
                    Math.abs(n - activePage) <= 2
                  )
                  .reduce((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push("...");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === "..." ? (
                      <span key={`dots-${i}`} style={{ padding: "0 4px", color: "#888" }}>…</span>
                    ) : (
                      <button
                        key={n}
                        className={`page-btn${activePage === n ? " active" : ""}`}
                        onClick={() => setActivePage(n)}
                      >
                        {n}
                      </button>
                    )
                  )
                }

                <button
                  className="page-btn"
                  disabled={activePage === totalPages}
                  onClick={() => setActivePage(p => p + 1)}
                >
                  ›
                </button>
              </div>
            </div>

          </main>

        </div>
      </div>
    </>
  );
}
