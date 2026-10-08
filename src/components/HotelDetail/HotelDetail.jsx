import { API_BASE, ASSET_BASE } from "../../config/api";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./HotelDetail.css";


const BASE_URL = ASSET_BASE;

const TEXT_COLOR = "#D4AF37";
const BTN_COLOR = "#1a7a4a";

// hotel.amenities aata hai comma-separated string ki tarah, e.g.
// "Lunch, Dinner, Reservations, Wheelchair, Bar"
// Isko clean array me convert karta hai: ["Lunch","Dinner",...]
function getAmenityList(hotel) {
  if (!hotel?.amenities) return [];
  if (Array.isArray(hotel.amenities)) {
    // backward-compat, agar kabhi purana array-of-objects shape aaye
    return hotel.amenities
      .map((a) => (typeof a === "string" ? a : a?.name || a?.amenity_id))
      .filter(Boolean);
  }
  return String(hotel.amenities)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Amenity ke naam ko relevant icon/emoji se map karta hai (keyword match,
// case-insensitive), taaki "Wheelchair Access", "wheelchair" waghera sab
// sahi resolve ho jayein. Kuch match na mile toh generic hotel icon.
const AMENITY_ICON_MAP = [
  { keywords: ["wifi", "internet"], icon: "📶" },
  { keywords: ["parking"], icon: "🅿️" },
  { keywords: ["pool", "swimming"], icon: "🏊" },
  { keywords: ["gym", "fitness"], icon: "🏋️" },
  { keywords: ["spa"], icon: "💆" },
  { keywords: ["bar"], icon: "🍸" },
  { keywords: ["restaurant"], icon: "🍽️" },
  { keywords: ["breakfast"], icon: "🥐" },
  { keywords: ["lunch"], icon: "🍲" },
  { keywords: ["dinner"], icon: "🍛" },
  { keywords: ["wheelchair", "accessib", "disab"], icon: "♿" },
  { keywords: ["reservation", "booking"], icon: "📅" },
  { keywords: ["air condition", "ac ", "cooling"], icon: "❄️" },
  { keywords: ["laundry"], icon: "🧺" },
  { keywords: ["tv", "television"], icon: "📺" },
  { keywords: ["room service"], icon: "🛎️" },
  { keywords: ["pet"], icon: "🐾" },
  { keywords: ["smoking"], icon: "🚬" },
  { keywords: ["elevator", "lift"], icon: "🛗" },
  { keywords: ["security", "cctv"], icon: "🛡️" },
  { keywords: ["shuttle", "transport", "transfer"], icon: "🚐" },
  { keywords: ["kitchen", "kitchenette"], icon: "🍳" },
  { keywords: ["conference", "meeting", "business"], icon: "💼" },
  { keywords: ["garden"], icon: "🌳" },
  { keywords: ["beach"], icon: "🏖️" },
  { keywords: ["playground", "kids"], icon: "🧒" },
  { keywords: ["electricity", "generator", "power"], icon: "💡" },
  { keywords: ["key card"], icon: "🔑" },
  { keywords: ["king size", "bed"], icon: "🛏️" },
];

function getAmenityIcon(name) {
  if (!name) return "🏨";
  const lower = name.toLowerCase();
  const match = AMENITY_ICON_MAP.find((entry) =>
    entry.keywords.some((kw) => lower.includes(kw))
  );
  return match ? match.icon : "🏨";
}


const REVIEWS = [
  {
    title: "Nice stay",
    author: "Ade",
    date: "August 21, 2023",
    score: 8.4,
    badge: "excellent",
    text: "Best service and nice experience but the WiFi was not working everywhere.",
  },
  {
    title: "Not Pleased",
    author: "Guest",
    date: "June 10, 2023",
    score: 5.6,
    badge: "good",
    text: "The room was okay but the service could be improved. Some amenities were not functioning properly.",
  },
];

const ROOM_FALLBACK_IMGS = [
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&q=80",
  "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=300&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&q=80",
];

function getDefaultToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function getDefaultCheckout() {
  const d = getDefaultToday();
  d.setDate(d.getDate() + 2);
  return d;
}

function formatDate(d) {
  if (!d) return "";

  const M = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${M[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function formatForAPI(d) {
  if (!d) return "";

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function getNights(ci, co) {
  if (!ci || !co) return 1;

  return Math.max(
    1,
    Math.round((co - ci) / (1000 * 60 * 60 * 24))
  );
}

// Global image helper
function getImgSrc(path) {
  if (!path) {
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return BASE_URL + path;
}

function CalendarMonth({
  year,
  month,
  checkIn,
  checkOut,
  hovered,
  onDayClick,
  onDayHover,
}) {
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }

  return (
    <div style={{ minWidth: 220 }}>
      <div
        style={{
          textAlign: "center",
          fontWeight: 600,
          marginBottom: 8,
          color: "#1a1a2e",
        }}
      >
        {MONTHS[month]} {year}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "#888",
              padding: "2px 0",
            }}
          >
            {d}
          </div>
        ))}

        {cells.map((date, i) => {
          if (!date) {
            return <div key={`e${i}`} />;
          }

          const isPast = date < today;

          const isStart =
            checkIn &&
            date.toDateString() === checkIn.toDateString();

          const isEnd =
            checkOut &&
            date.toDateString() === checkOut.toDateString();

          const rangeEnd = checkOut || hovered;

          const inRange =
            checkIn &&
            rangeEnd &&
            date > checkIn &&
            date < rangeEnd;

          return (
            <div
              key={i}
              onClick={() => !isPast && onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              style={{
                textAlign: "center",
                padding: "5px 0",
                borderRadius: 6,
                cursor: isPast ? "not-allowed" : "pointer",
                fontSize: 13,
                background:
                  isStart || isEnd
                    ? BTN_COLOR
                    : inRange
                    ? "#e8f0fe"
                    : "transparent",
                color:
                  isStart || isEnd
                    ? "#fff"
                    : isPast
                    ? "#ccc"
                    : "#222",
                fontWeight:
                  isStart || isEnd ? 700 : 400,
              }}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HotelDetail({ slug }) {
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // MULTIPLE ROOM SELECTION
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [showCal, setShowCal] = useState(false);

  const [checkIn, setCheckIn] = useState(getDefaultToday);
  const [checkOut, setCheckOut] = useState(getDefaultCheckout);

  const [hovered, setHovered] = useState(null);

  const [leftYear, setLeftYear] = useState(
    new Date().getFullYear()
  );

  const [leftMonth, setLeftMonth] = useState(
    new Date().getMonth()
  );

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const [phone, setPhone] = useState("+234");

  // 🆕 Driving Directions form state
  const [directionsEmail, setDirectionsEmail] = useState("");
  const [directionsPhone, setDirectionsPhone] = useState("");
  const [sendingDirections, setSendingDirections] = useState(false);
  const [directionsStatus, setDirectionsStatus] = useState(null); // { type: "success" | "error", message: string }

  const wrapRef = useRef(null);

  const rightMonth =
    leftMonth === 11 ? 0 : leftMonth + 1;

  const rightYear =
    leftMonth === 11
      ? leftYear + 1
      : leftYear;

  useEffect(() => {
    const handler = (e) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target)
      ) {
        setShowCal(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${API_BASE}/hotels/${slug}`
        );

        const data =
          res.data?.data || res.data;

        setHotel(data);
      } catch (err) {
        try {
          const res = await axios.get(
            `${API_BASE}/hotels/search?name=${slug}`
          );

          const list =
            res.data?.data || [];

          const found =
            list.find(
              (h) => h.slug === slug
            ) || list[0];

          setHotel(found || null);
        } catch (e) {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchHotel();
    }
  }, [slug]);

  function handleDayClick(date) {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date);
      setCheckOut(null);
      setHovered(null);
    } else {
      if (date <= checkIn) {
        setCheckIn(date);
        setCheckOut(null);
      } else {
        setCheckOut(date);
        setShowCal(false);
      }
    }
  }

  // =========================================================
  // ADD ROOM
  // =========================================================
  function addRoom(room) {
    const availableRooms = Number(
      room.available_rooms || 0
    );

    if (availableRooms <= 0) {
      return;
    }

    setSelectedRooms((prev) => {
      const existing = prev.find(
        (item) => item.room.id === room.id
      );

      // Room already selected
      if (existing) {
        // Do not exceed available rooms
        if (
          existing.quantity >=
          availableRooms
        ) {
          return prev;
        }

        return prev.map((item) =>
          item.room.id === room.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      // First time selecting this room
      return [
        ...prev,
        {
          room: room,
          quantity: 1,
        },
      ];
    });
  }

  // =========================================================
  // REMOVE ROOM
  // =========================================================
  function removeRoom(room) {
    setSelectedRooms((prev) => {
      const existing = prev.find(
        (item) => item.room.id === room.id
      );

      if (!existing) {
        return prev;
      }

      // Remove complete room when quantity = 1
      if (existing.quantity <= 1) {
        return prev.filter(
          (item) =>
            item.room.id !== room.id
        );
      }

      // Otherwise decrease quantity
      return prev.map((item) =>
        item.room.id === room.id
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      );
    });
  }

  // =========================================================
  // RESERVE
  // =========================================================
  function handleReserve() {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room.");
      return;
    }

    if (!checkIn || !checkOut) {
      alert(
        "Please select check-in and check-out dates."
      );
      return;
    }

    const nights = getNights(
      checkIn,
      checkOut
    );

    const totalPrice =
      selectedRooms.reduce(
        (total, item) => {
          const price =
            parseFloat(
              item.room.discount_price ||
                item.room.price_per_night ||
                0
            );

          return (
            total +
            price *
              item.quantity *
              nights
          );
        },
        0
      );

    navigate("/hotel-booking", {
      state: {
        hotel,

        // MULTIPLE ROOMS
        rooms: selectedRooms,

        // Also keep first room for compatibility
        room:
          selectedRooms.length > 0
            ? selectedRooms[0].room
            : null,

        checkIn:
          formatForAPI(checkIn),

        checkOut:
          formatForAPI(checkOut),

        adults,
        children,
        nights,

        totalPrice:
          totalPrice.toFixed(2),

        phone,
      },
    });
  }

  // =========================================================
  // SEND DRIVING DIRECTIONS
  // =========================================================
  async function handleSendDirections() {
    const contact =
      directionsEmail.trim() || directionsPhone.trim();

    if (!contact) {
      setDirectionsStatus({
        type: "error",
        message: "Please enter your email or phone number.",
      });
      return;
    }

    setSendingDirections(true);
    setDirectionsStatus(null);

    try {
      await axios.post(
        `${API_BASE}/hotel/driving-directions`,
        {
          contact,
          hotelName: hotel?.name || "",
          hotelAddress: hotel?.address || "",
        }
      );

      setDirectionsStatus({
        type: "success",
        message: "Directions sent! Please check your email or phone.",
      });
      setDirectionsEmail("");
      setDirectionsPhone("");
    } catch (err) {
      console.error(err);
      setDirectionsStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setSendingDirections(false);
    }
  }

  // Address format se city nikaalne ke liye helper.
  // Pattern: "...Street, Area, Lagos 101241, Lagos, Nigeria"
  // Last part hamesha "Nigeria" (country) hota hai, aur usse pehle wala
  // part hamesha city ka naam hota hai — ye pattern data me consistent hai.
  function extractCityFromAddress(address) {
    if (!address) return "";
    const parts = address
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (parts.length < 2) return "";

    // second-to-last part = city (last part = country "Nigeria")
    return parts[parts.length - 2] || "";
  }

  // =========================================================
  // VIEW SIMILAR PROPERTIES (same city)
  // =========================================================
  function handleViewSimilar() {
    // 1. Pehle try karo dedicated city field se (agar kabhi API me aaye)
    let cityName = "";
    if (hotel?.city) {
      cityName =
        typeof hotel.city === "string"
          ? hotel.city
          : hotel.city.name || "";
    }

    // 2. City field na mile toh address string se nikaalo
    if (!cityName) {
      cityName = extractCityFromAddress(hotel?.address);
    }

    if (!cityName) {
      console.warn(
        "[View Similar] Address se bhi city nahi nikal payi. Poora hotel object:",
        hotel
      );
      navigate("/");
      return;
    }

    const citySlug = cityName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    navigate(`/hotels/hotels-in-${citySlug}`);
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <div
          style={{
            fontSize: "1rem",
            color: TEXT_COLOR,
          }}
        >
          Loading hotel details...
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 60,
        }}
      >
        <p
          style={{
            color: "#ef4444",
            fontWeight: 600,
          }}
        >
          Hotel not found.
        </p>

        <Link
          to="/"
          style={{ color: TEXT_COLOR }}
        >
          ← Go back
        </Link>
      </div>
    );
  }

  // =========================================================
  // GALLERY IMAGES
  // =========================================================
  const GALLERY_IMGS = (() => {
    if (
      hotel?.images?.length > 0
    ) {
      const allPaths =
        hotel.images
          .flatMap((img) => {
            if (!img?.image_url) {
              return [];
            }

            try {
              const parsed =
                JSON.parse(
                  img.image_url
                );

              return Array.isArray(parsed)
                ? parsed
                : [img.image_url];
            } catch {
              return [img.image_url];
            }
          })
          .filter(Boolean);

      if (allPaths.length > 0) {
        return allPaths.map(
          (path) => ({
            src: getImgSrc(path),
            alt: hotel.name,
          })
        );
      }
    }

    return [
      {
        src: getImgSrc(
          hotel.image
        ),
        alt: hotel.name,
      },
    ];
  })();

  const perSlide =
    typeof window !== "undefined"
      ? window.innerWidth < 700
        ? 1
        : window.innerWidth < 900
        ? 2
        : 4
      : 4;

  const maxIndex = Math.max(
    0,
    GALLERY_IMGS.length - perSlide
  );

  // =========================================================
  // SCORE BARS
  // =========================================================
  const SCORE_BARS = [
    {
      label: "Location",
      val: Number(
        hotel.rating || 0
      ),
    },
    {
      label: "Security",
      val: Number(
        hotel.rating || 0
      ),
    },
    {
      label: "Cleanliness",
      val: 8,
    },
    {
      label: "Service Quality",
      val: 8,
    },
    {
      label: "Comfort",
      val: 8,
    },
  ];

  // =========================================================
  // FAQS
  // =========================================================
  const FAQS = [
    {
      q: `Does ${hotel.name} offer free Wi-Fi?`,
      a: "Yes, it offers free Wi-Fi.",
    },
    {
      q: `Does ${hotel.name} have a swimming pool?`,
      a: "Yes, it has a swimming pool.",
    },
    {
      q: `Does ${hotel.name} offer complimentary breakfast?`,
      a: "Yes, it offers complimentary breakfast.",
    },
    {
      q: `Is there a gym at ${hotel.name}?`,
      a: "Yes, there is a gym.",
    },
    {
      q: `Does ${hotel.name} have a restaurant?`,
      a: "Yes, it has a restaurant.",
    },
  ];

  // =========================================================
  // BOOKING TOTALS
  // =========================================================
  const nights = getNights(
    checkIn,
    checkOut
  );

  const totalRooms =
    selectedRooms.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  const totalPrice =
    selectedRooms.reduce(
      (total, item) => {
        const price =
          parseFloat(
            item.room.discount_price ||
              item.room.price_per_night ||
              0
          );

        return (
          total +
          price *
            item.quantity *
            nights
        );
      },
      0
    );

  return (
    <>

      <div className="hotel-page">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="hotel-header">

          <div className="hotel-header-inner">

            <div>
              <h1
                className="hotel-name"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                {hotel.name}
              </h1>

              <p
                className="hotel-address"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                <span>📍</span>
                {hotel.address}
              </p>
            </div>

            <div className="rating-badge">

              <div
                className="rating-score"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                {hotel.rating}
              </div>

              <div
                className="rating-label"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                Excellent
              </div>

              <div
                className="rating-count"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                Based on{" "}
                {hotel.total_reviews}{" "}
                Guest Reviews
              </div>

            </div>

          </div>

          {/* ===================================================
              GALLERY
          ==================================================== */}
          <div className="gallery-wrap">

            <div
              className="gallery-track"
              style={{
                transform: `translateX(-${
                  galleryIndex *
                  (100 / perSlide)
                }%)`,
              }}
            >
              {GALLERY_IMGS.map(
                (img, i) => (
                  <img
                    key={i}
                    className="gallery-img"
                    src={img.src}
                    alt={img.alt}
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
                    }}
                  />
                )
              )}
            </div>

            <button
              className="gallery-btn prev"
              onClick={() =>
                setGalleryIndex(
                  (i) =>
                    Math.max(
                      0,
                      i - 1
                    )
                )
              }
              style={{
                background: BTN_COLOR,
                color: "#fff",
              }}
            >
              &#8249;
            </button>

            <button
              className="gallery-btn next"
              onClick={() =>
                setGalleryIndex(
                  (i) =>
                    Math.min(
                      maxIndex,
                      i + 1
                    )
                )
              }
              style={{
                background: BTN_COLOR,
                color: "#fff",
              }}
            >
              &#8250;
            </button>

          </div>
        </div>

        {/* =====================================================
            MAIN LAYOUT
        ====================================================== */}
        <div className="main-layout">

          {/* ===================================================
              LEFT SIDE
          ==================================================== */}
          <div>

            {/* INFORMATION */}
            <div className="section-card">

              <h2
                className="section-title"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                Information about{" "}
                {hotel.name}
              </h2>

              <div className="amenities-grid">

                {getAmenityList(hotel).length > 0 ? (
                  getAmenityList(hotel).map(
                    (name, i) => (
                      <div
                        className="amenity-item"
                        key={i}
                      >
                        <div className="amenity-icon">
                          {getAmenityIcon(name)}
                        </div>

                        <span
                          style={{
                            color: TEXT_COLOR,
                          }}
                        >
                          {name}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <div
                    style={{
                      color: TEXT_COLOR,
                      fontSize: "0.88rem",
                      opacity: 0.7,
                    }}
                  >
                    No amenities listed for this hotel.
                  </div>
                )}

              </div>

              <hr
                style={{
                  borderTop:
                    "1px solid var(--border)",
                  margin:
                    "16px 0",
                }}
              />

              <div className="meta-table">

                <div className="meta-cell">
                  <div
                    className="meta-label"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Hotel Type
                  </div>

                  <div
                    className="meta-value"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Hotel
                  </div>
                </div>

                <div className="meta-cell">
                  <div
                    className="meta-label"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Rooms
                  </div>

                  <div
                    className="meta-value"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    {hotel.rooms?.length ||
                      0}
                  </div>
                </div>

                <div className="meta-cell">
                  <div
                    className="meta-label"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Price From
                  </div>

                  <div
                    className="meta-value"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    ₦
                    {parseFloat(
                      hotel.price_start_from ||
                        0
                    ).toLocaleString()}
                  </div>
                </div>

              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="section-card">
              <p
                className="desc-text"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                {hotel.description}
              </p>
            </div>

            {/* POLICY */}
            <div className="section-card">

              <h2
                className="section-title"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                {hotel.name} Policy
              </h2>

              <ul className="policy-list">

                {[
                  [
                    "Check In",
                    "From 2:00 pm (ID Required)",
                  ],
                  [
                    "Check Out",
                    "By 12:00 pm",
                  ],
                  [
                    "Pets",
                    "Not allowed",
                  ],
                  [
                    "Payment",
                    "Cash or Card (Visa / MasterCard)",
                  ],
                  [
                    "Children",
                    "Babies and Kids Stay Free",
                  ],
                  [
                    "No Show",
                    "100% Charge for a NO SHOW",
                  ],
                ].map(
                  ([k, v]) => (
                    <li
                      key={k}
                      style={{
                        color: TEXT_COLOR,
                      }}
                    >
                      <span
                        className="policy-key"
                        style={{
                          color: TEXT_COLOR,
                        }}
                      >
                        {k}:
                      </span>{" "}
                      {v}
                    </li>
                  )
                )}

              </ul>
            </div>

            {/* SIMILAR */}
            <div className="similar-box">

              <p
                style={{
                  color: TEXT_COLOR,
                }}
              >
                Like this one but not
                totally sure yet?
              </p>

              <button
                type="button"
                className="similar-btn"
                onClick={handleViewSimilar}
                style={{
                  background: BTN_COLOR,
                  color: "#D4AF37",
                  cursor: "pointer",
                }}
              >
                View properties based on rating
              </button>

            </div>

            {/* FAQ */}
            <div
              className="section-card"
              style={{
                marginTop: 22,
              }}
            >

              <h2
                className="section-title"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                Frequently asked
                questions about{" "}
                {hotel.name}
              </h2>

              <div className="faq-layout">

                <div className="faq-contact-box">

                  <div
                    className="faq-contact-title"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Ask a question about{" "}
                    {hotel.name}
                  </div>

                  <div
                    className="faq-contact-sub"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Typically responds
                    within 24 hours
                  </div>

                  {[
                    "👤 Name",
                    "✉️ Email Address",
                    "📞 Phone number (optional)",
                  ].map(
                    (p, i) => (
                      <div
                        key={i}
                        className="faq-input"
                        style={{
                          color: TEXT_COLOR,
                        }}
                      >
                        {p}
                      </div>
                    )
                  )}

                  <textarea
                    className="faq-textarea"
                    placeholder="Message"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  />

                </div>

                <div className="faq-items">

                  {FAQS.map(
                    (f, i) => (
                      <div
                        className="faq-item"
                        key={i}
                      >
                        <div
                          className="faq-q"
                          style={{
                            color: TEXT_COLOR,
                          }}
                        >
                          {f.q}
                        </div>

                        <div
                          className="faq-a"
                          style={{
                            color: TEXT_COLOR,
                          }}
                        >
                          {f.a}
                        </div>
                      </div>
                    )
                  )}

                </div>

              </div>
            </div>

            {/* REVIEWS */}
            <div
              className="section-card"
              style={{
                marginTop: 22,
              }}
            >

              <div className="reviews-header">

                <h2
                  className="section-title"
                  style={{
                    margin: 0,
                    color: TEXT_COLOR,
                  }}
                >
                  Reviews of{" "}
                  {hotel.name}
                </h2>

                <a
                  className="write-review"
                  href="#"
                  style={{
                    color: TEXT_COLOR,
                  }}
                >
                  Write a guest review
                </a>

              </div>

              <div className="reviews-overview">

                <div>
                  <div
                    className="big-score"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    {hotel.rating}
                    <small>/10</small>
                  </div>
                </div>

                <div>

                  <div
                    className="score-label"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Excellent/10
                  </div>

                  <div
                    className="score-sub"
                    style={{
                      color: TEXT_COLOR,
                    }}
                  >
                    Based on{" "}
                    {hotel.total_reviews}{" "}
                    Guest Reviews
                  </div>

                  <div
                    style={{
                      marginTop: 12,
                    }}
                  >
                    <div className="score-bars">

                      {SCORE_BARS.map(
                        (b) => (
                          <div
                            className="score-bar-row"
                            key={b.label}
                          >
                            <span
                              className="score-bar-label"
                              style={{
                                color:
                                  TEXT_COLOR,
                              }}
                            >
                              {b.label}
                            </span>

                            <div className="score-bar-track">

                              <div
                                className="score-bar-fill"
                                style={{
                                  width: `${
                                    b.val *
                                    10
                                  }%`,
                                  background:
                                    BTN_COLOR,
                                }}
                              />

                            </div>

                            <span
                              className="score-bar-val"
                              style={{
                                color:
                                  TEXT_COLOR,
                              }}
                            >
                              {b.val}
                            </span>
                          </div>
                        )
                      )}

                    </div>
                  </div>

                </div>
              </div>

              {REVIEWS.map(
                (r, i) => (
                  <div
                    className="review-card"
                    key={i}
                  >

                    <div>

                      <div
                        className="review-title"
                        style={{
                          color:
                            TEXT_COLOR,
                        }}
                      >
                        {r.title}
                      </div>

                      <div
                        className="review-meta"
                        style={{
                          color:
                            TEXT_COLOR,
                        }}
                      >
                        by {r.author} on{" "}
                        {r.date}
                      </div>

                      <div
                        className="review-body"
                        style={{
                          color:
                            TEXT_COLOR,
                        }}
                      >
                        {r.text}
                      </div>

                    </div>

                    <div
                      className={`review-badge ${
                        r.badge ===
                        "excellent"
                          ? "badge-excellent"
                          : "badge-good"
                      }`}
                    >
                      {r.badge ===
                      "excellent"
                        ? "Excellent"
                        : "Good"}{" "}
                      {r.score}
                    </div>

                  </div>
                )
              )}

            </div>

            {/* CONTACT */}
            <div
              className="section-card"
              style={{
                textAlign: "center",
                marginTop: 22,
              }}
            >

              <h2
                className="section-title"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                Contact{" "}
                {hotel.name}
              </h2>

              <hr className="section-divider" />

              <div className="contact-row">

                <div
                  className="contact-item"
                  style={{
                    color: TEXT_COLOR,
                  }}
                >
                  ✉️ info@stay9jahotels.com
                </div>

                <div
                  className="contact-item"
                  style={{
                    color: TEXT_COLOR,
                  }}
                >
                  📱 +44 7956531295
                </div>

              </div>
            </div>

          </div>

          {/* ===================================================
              RIGHT SIDE — BOOKING CARD
          ==================================================== */}
          <div>

            <div className="booking-card">

              <div
                className="booking-title"
                style={{
                  color: TEXT_COLOR,
                }}
              >
                Book {hotel.name}
              </div>

              {/* =================================================
                  CALENDAR
              ================================================== */}
              <div
                className="booking-field"
                ref={wrapRef}
                style={{
                  position: "relative",
                }}
              >

                <label
                  style={{
                    color: TEXT_COLOR,
                  }}
                >
                  Check In – Check Out
                </label>

                <input
                  type="text"
                  readOnly
                  placeholder="Check In - Check Out"
                  value={
                    checkIn
                      ? checkOut
                        ? `${formatDate(
                            checkIn
                          )} → ${formatDate(
                            checkOut
                          )}`
                        : `${formatDate(
                            checkIn
                          )} → Select checkout`
                      : ""
                  }
                  onClick={() =>
                    setShowCal(
                      (v) => !v
                    )
                  }
                  style={{
                    cursor:
                      "pointer",
                    width: "100%",
                    color:
                      TEXT_COLOR,
                  }}
                />

                {showCal && (
                  <div
                    style={{
                      position:
                        "absolute",
                      top: "110%",
                      left: 0,
                      background:
                        "#fff",
                      padding: 20,
                      borderRadius:
                        14,
                      boxShadow:
                        "0 8px 40px rgba(0,0,0,0.15)",
                      zIndex: 9999,
                      display:
                        "flex",
                      gap: 20,
                      flexWrap:
                        "wrap",
                    }}
                  >

                    <CalendarMonth
                      year={leftYear}
                      month={leftMonth}
                      checkIn={
                        checkIn
                      }
                      checkOut={
                        checkOut
                      }
                      hovered={
                        hovered
                      }
                      onDayClick={
                        handleDayClick
                      }
                      onDayHover={
                        setHovered
                      }
                    />

                    <CalendarMonth
                      year={rightYear}
                      month={
                        rightMonth
                      }
                      checkIn={
                        checkIn
                      }
                      checkOut={
                        checkOut
                      }
                      hovered={
                        hovered
                      }
                      onDayClick={
                        handleDayClick
                      }
                      onDayHover={
                        setHovered
                      }
                    />

                    <div
                      style={{
                        width:
                          "100%",
                        display:
                          "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                    >

                      <button
                        type="button"
                        onClick={() => {
                          setLeftMonth(
                            (m) =>
                              m === 0
                                ? 11
                                : m - 1
                          );

                          if (
                            leftMonth ===
                            0
                          ) {
                            setLeftYear(
                              (y) =>
                                y - 1
                            );
                          }
                        }}
                        style={{
                          background:
                            BTN_COLOR,
                          color:
                            "#fff",
                          border:
                            "none",
                          borderRadius:
                            7,
                          padding:
                            "6px 14px",
                          cursor:
                            "pointer",
                          fontWeight:
                            700,
                        }}
                      >
                        ‹ Prev
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLeftMonth(
                            (m) =>
                              m === 11
                                ? 0
                                : m + 1
                          );

                          if (
                            leftMonth ===
                            11
                          ) {
                            setLeftYear(
                              (y) =>
                                y + 1
                            );
                          }
                        }}
                        style={{
                          background:
                            BTN_COLOR,
                          color:
                            "#fff",
                          border:
                            "none",
                          borderRadius:
                            7,
                          padding:
                            "6px 14px",
                          cursor:
                            "pointer",
                          fontWeight:
                            700,
                        }}
                      >
                        Next ›
                      </button>

                    </div>
                  </div>
                )}

              </div>

              {/* =================================================
                  ADULTS / CHILDREN
              ================================================== */}
              <div className="adults-children">

                <div className="booking-field">

                  <label
                    style={{
                      color:
                        TEXT_COLOR,
                    }}
                  >
                    Adults
                  </label>

                  <select
                    value={
                      adults
                    }
                    onChange={(e) =>
                      setAdults(
                        Number(
                          e.target
                            .value
                        )
                      )
                    }
                    style={{
                      color:
                        TEXT_COLOR,
                    }}
                  >
                    {[1, 2, 3, 4].map(
                      (n) => (
                        <option
                          key={n}
                          value={n}
                        >
                          {n}
                        </option>
                      )
                    )}
                  </select>

                </div>

                <div className="booking-field">

                  <label
                    style={{
                      color:
                        TEXT_COLOR,
                    }}
                  >
                    Children
                  </label>

                  <select
                    value={
                      children
                    }
                    onChange={(e) =>
                      setChildren(
                        Number(
                          e.target
                            .value
                        )
                      )
                    }
                    style={{
                      color:
                        TEXT_COLOR,
                    }}
                  >
                    {[0, 1, 2, 3].map(
                      (n) => (
                        <option
                          key={n}
                          value={n}
                        >
                          {n}
                        </option>
                      )
                    )}
                  </select>

                </div>

              </div>

              {/* =================================================
                  PHONE
              ================================================== */}
              <div className="booking-field">

                <label
                  style={{
                    color:
                      TEXT_COLOR,
                  }}
                >
                  Phone number
                </label>

                <div className="phone-row">

                  <div
                    className="phone-flag"
                    style={{
                      color:
                        TEXT_COLOR,
                    }}
                  >
                    🇳🇬 ▾
                  </div>

                  <input
                    type="tel"
                    value={
                      phone
                    }
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    style={{
                      color:
                        TEXT_COLOR,
                    }}
                  />

                </div>
              </div>

              {/* =================================================
                  ROOMS FROM API
              ================================================== */}
              {hotel.rooms &&
              hotel.rooms.length >
                0 ? (
                hotel.rooms.map(
                  (room, idx) => {
                    const pricePerNight =
                      parseFloat(
                        room.discount_price ||
                          room.price_per_night ||
                          0
                      );

                    const originalPrice =
                      room.discount_price
                        ? parseFloat(
                            room.price_per_night ||
                              0
                          )
                        : null;

                    const selectedItem =
                      selectedRooms.find(
                        (item) =>
                          item.room.id ===
                          room.id
                      );

                    const quantity =
                      selectedItem
                        ? selectedItem.quantity
                        : 0;

                    const isSelected =
                      quantity > 0;

                    const availableRooms =
                      Number(
                        room.available_rooms ||
                          0
                      );

                    const roomImg =
                      room.image_url
                        ? getImgSrc(
                            room.image_url
                          )
                        : room.image
                        ? getImgSrc(
                            room.image
                          )
                        : ROOM_FALLBACK_IMGS[
                            idx %
                              ROOM_FALLBACK_IMGS.length
                          ];

                    return (
                      <div
                        className="room-card"
                        key={room.id}
                        style={{
                          border:
                            isSelected
                              ? `2px solid ${BTN_COLOR}`
                              : "1px solid #e5e9ef",
                          borderRadius:
                            10,
                          overflow:
                            "hidden",
                          marginBottom:
                            12,
                          transition:
                            "border 0.2s",
                        }}
                      >

                        {/* ROOM IMAGE */}
                        <img
                          className="room-img"
                          src={roomImg}
                          alt={
                            room.room_type
                          }
                          onError={(
                            e
                          ) => {
                            e.target.src =
                              ROOM_FALLBACK_IMGS[
                                idx %
                                  ROOM_FALLBACK_IMGS.length
                              ];
                          }}
                        />

                        <div className="room-info">

                          {/* ROOM NAME */}
                          <div
                            className="room-name"
                            style={{
                              color:
                                TEXT_COLOR,
                            }}
                          >
                            {
                              room.room_type
                            }
                          </div>

                          {/* ROOM PRICE */}
                          <div
                            className="room-price"
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: 6,
                              color:
                                TEXT_COLOR,
                            }}
                          >

                            {originalPrice && (
                              <span
                                style={{
                                  textDecoration:
                                    "line-through",
                                  color:
                                    "#9ca3af",
                                  fontSize:
                                    "0.82rem",
                                  fontWeight:
                                    400,
                                }}
                              >
                                ₦
                                {originalPrice.toLocaleString()}
                              </span>
                            )}

                            ₦
                            {pricePerNight.toLocaleString()}

                            <small
                              style={{
                                fontWeight:
                                  400,
                                fontSize:
                                  "0.78rem",
                                color:
                                  TEXT_COLOR,
                              }}
                            >
                              /night
                            </small>

                          </div>

                          {/* ROOM DETAILS */}
                          <div
                            style={{
                              fontSize:
                                "0.78rem",
                              color:
                                TEXT_COLOR,
                              marginBottom:
                                6,
                              display:
                                "flex",
                              gap: 10,
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <span>
                              👥 Max{" "}
                              {
                                room.max_guests
                              }{" "}
                              guests
                            </span>

                            <span>
                              🛏️{" "}
                              {
                                room.total_rooms
                              }{" "}
                              rooms
                            </span>

                            <span
                              style={{
                                color:
                                  availableRooms >
                                  0
                                    ? "#059669"
                                    : "#dc2626",
                                fontWeight:
                                  600,
                              }}
                            >
                              {availableRooms >
                              0
                                ? `✓ ${availableRooms} available`
                                : "✗ Sold out"}
                            </span>

                          </div>

                          <div
                            className="room-free"
                            style={{
                              color:
                                TEXT_COLOR,
                            }}
                          >
                            ✓ Free cancellation
                          </div>

                          {/* =================================================
                              ROOM SELECT / QUANTITY
                          ================================================== */}
                          {availableRooms >
                          0 ? (
                            <div
                              style={{
                                marginTop:
                                  10,
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                justifyContent:
                                  "space-between",
                                gap: 10,
                                flexWrap:
                                  "wrap",
                              }}
                            >

                              {!isSelected ? (
                                <button
                                  type="button"
                                  className="room-select-btn"
                                  onClick={() =>
                                    addRoom(
                                      room
                                    )
                                  }
                                  style={{
                                    background:
                                      BTN_COLOR,
                                    color:
                                      "#fff",
                                    border:
                                      "none",
                                    cursor:
                                      "pointer",
                                    padding:
                                      "9px 16px",
                                    borderRadius:
                                      6,
                                    fontWeight:
                                      600,
                                  }}
                                >
                                  Select Room
                                </button>
                              ) : (
                                <div
                                  style={{
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    gap: 12,
                                  }}
                                >

                                  {/* MINUS */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeRoom(
                                        room
                                      )
                                    }
                                    style={{
                                      width: 34,
                                      height: 34,
                                      border: `1px solid ${BTN_COLOR}`,
                                      background:
                                        "#fff",
                                      color:
                                        BTN_COLOR,
                                      borderRadius:
                                        6,
                                      fontSize:
                                        20,
                                      fontWeight:
                                        700,
                                      cursor:
                                        "pointer",
                                      lineHeight:
                                        1,
                                    }}
                                  >
                                    −
                                  </button>

                                  {/* QUANTITY */}
                                  <span
                                    style={{
                                      minWidth:
                                        25,
                                      textAlign:
                                        "center",
                                      fontWeight:
                                        700,
                                      color:
                                        TEXT_COLOR,
                                    }}
                                  >
                                    {
                                      quantity
                                    }
                                  </span>

                                  {/* PLUS */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      addRoom(
                                        room
                                      )
                                    }
                                    disabled={
                                      quantity >=
                                      availableRooms
                                    }
                                    style={{
                                      width: 34,
                                      height: 34,
                                      border:
                                        "none",
                                      background:
                                        BTN_COLOR,
                                      color:
                                        "#fff",
                                      borderRadius:
                                        6,
                                      fontSize:
                                        20,
                                      fontWeight:
                                        700,
                                      cursor:
                                        quantity >=
                                        availableRooms
                                          ? "not-allowed"
                                          : "pointer",
                                      opacity:
                                        quantity >=
                                        availableRooms
                                          ? 0.5
                                          : 1,
                                      lineHeight:
                                        1,
                                    }}
                                  >
                                    +
                                  </button>

                                </div>
                              )}

                              {/* SELECTED TEXT */}
                              {isSelected && (
                                <span
                                  style={{
                                    color:
                                      "#059669",
                                    fontSize:
                                      "0.82rem",
                                    fontWeight:
                                      600,
                                  }}
                                >
                                  ✓{" "}
                                  {
                                    quantity
                                  }{" "}
                                  room
                                  {quantity >
                                  1
                                    ? "s"
                                    : ""}{" "}
                                  selected
                                </span>
                              )}

                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="room-select-btn"
                              style={{
                                background:
                                  BTN_COLOR,
                                color:
                                  "#fff",
                                opacity:
                                  0.5,
                                cursor:
                                  "not-allowed",
                                marginTop:
                                  10,
                              }}
                            >
                              Sold Out
                            </button>
                          )}

                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div
                  style={{
                    padding:
                      "16px 0",
                    color:
                      TEXT_COLOR,
                    fontSize:
                      "0.88rem",
                    textAlign:
                      "center",
                  }}
                >
                  No rooms available
                  at this time.
                </div>
              )}

              {/* =================================================
                  TOTALS
              ================================================== */}
              <div
                className="booking-totals"
                style={{
                  color:
                    TEXT_COLOR,
                }}
              >

                <span
                  style={{
                    color:
                      TEXT_COLOR,
                  }}
                >
                  {totalRooms > 0
                    ? `${totalRooms} Room${
                        totalRooms >
                        1
                          ? "s"
                          : ""
                      }, ${nights} Night${
                        nights >
                        1
                          ? "s"
                          : ""
                      }`
                    : "0 Rooms"}
                </span>

                <span
                  className="total-price"
                  style={{
                    color:
                      TEXT_COLOR,
                  }}
                >
                  Total: ₦
                  {totalPrice.toLocaleString()}
                </span>

              </div>

              {/* =================================================
                  RESERVE BUTTON
              ================================================== */}
              <button
                onClick={
                  handleReserve
                }
                className="reserve-btn"
                disabled={
                  selectedRooms.length ===
                  0
                }
                style={{
                  width:
                    "100%",
                  cursor:
                    selectedRooms.length >
                    0
                      ? "pointer"
                      : "not-allowed",
                  display:
                    "block",
                  textAlign:
                    "center",
                  border:
                    "none",
                  background:
                    BTN_COLOR,
                  color:
                    "#fff",
                  opacity:
                    selectedRooms.length >
                    0
                      ? 1
                      : 0.6,
                }}
              >
                Reserve Now
              </button>

              {/* =================================================
                  SHARE
              ================================================== */}
              <div className="share-row">

                <span
                  style={{
                    color:
                      TEXT_COLOR,
                  }}
                >
                  Share
                </span>

                <a
                  className="share-icon share-fb"
                  href="#"
                  style={{
                    background:
                      BTN_COLOR,
                    color:
                      "#fff",
                  }}
                >
                  f
                </a>

                <a
                  className="share-icon share-tw"
                  href="#"
                  style={{
                    background:
                      BTN_COLOR,
                    color:
                      "#fff",
                  }}
                >
                  𝕏
                </a>

                <a
                  className="share-icon share-wa"
                  href="#"
                  style={{
                    background:
                      BTN_COLOR,
                    color:
                      "#fff",
                  }}
                >
                  ✓
                </a>

              </div>

              {/* =================================================
                  DIRECTIONS
              ================================================== */}
              <div className="directions-box">

                <div
                  className="directions-title"
                  style={{
                    color:
                      TEXT_COLOR,
                  }}
                >
                  Driving Instructions
                  to {hotel.name}
                </div>

                <div
                  className="directions-desc"
                  style={{
                    color:
                      TEXT_COLOR,
                  }}
                >
                  Find the quickest route
                  to this hotel. We'll send
                  you directions — just enter
                  your email or phone number:
                </div>

                <div className="directions-inputs">

                  <input
                    type="email"
                    placeholder="✉️  Email Address"
                    value={directionsEmail}
                    onChange={(e) =>
                      setDirectionsEmail(e.target.value)
                    }
                    style={{
                      color:
                        TEXT_COLOR,
                    }}
                  />

                  <div className="send-row">

                    <input
                      type="tel"
                      placeholder="📞  Phone Number"
                      value={directionsPhone}
                      onChange={(e) =>
                        setDirectionsPhone(e.target.value)
                      }
                      style={{
                        color:
                          TEXT_COLOR,
                      }}
                    />

                    <button
                      type="button"
                      className="send-btn"
                      onClick={handleSendDirections}
                      disabled={sendingDirections}
                      style={{
                        background:
                          BTN_COLOR,
                        color:
                          "#fff",
                        cursor: sendingDirections
                          ? "not-allowed"
                          : "pointer",
                        opacity: sendingDirections ? 0.7 : 1,
                      }}
                    >
                      {sendingDirections ? "SENDING..." : "SEND"}
                    </button>

                  </div>

                  {directionsStatus && (
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color:
                          directionsStatus.type === "success"
                            ? "#059669"
                            : "#ef4444",
                      }}
                    >
                      {directionsStatus.type === "success" ? "✓ " : "✕ "}
                      {directionsStatus.message}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}