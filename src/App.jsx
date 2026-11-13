import { useEffect, useMemo, useRef, useState } from "react";
import PhotoCropModal from "./PhotoCropModal";

const demoPlayers = [
  {
    id: 1,
    name: "Aditya",
    age: 22,
    city: "Yogyakarta",
    location: "Sleman, Yogyakarta",
    distance: "2.5 km",
    sports: ["Badminton"],
    level: "Intermediate",
    avatar: "🏸",
    photo: "/images/aditya.jpg",
    color: "blue",
  },
  {
    id: 2,
    name: "Nadia",
    age: 21,
    city: "Yogyakarta",
    location: "Yogyakarta",
    distance: "3.2 km",
    sports: ["Running"],
    level: "Beginner",
    avatar: "🎾",
    photo: "/images/nadia.jpg",
    color: "pink",
  },
  {
    id: 3,
    name: "Pajri",
    age: 23,
    city: "Yogyakarta",
    location: "Sleman",
    distance: "4.1 km",
    sports: ["Basketball", "Futsal"],
    level: "Advanced",
    avatar: "🏀",
    photo: "/images/rizky.jpg",
    color: "purple",
  },
  {
    id: 4,
    name: "Aliando",
    age: 23,
    city: "Bekasi",
    location: "Pondok Gede",
    distance: "3 km",
    sports: ["Tennis", "Running"],
    level: "Intermediate",
    avatar: "🎾",
    photo: "/images/aliando.jpg",
    color: "orange",
  },
  {
    id: 5,
    name: "Gilang Ramadhan",
    age: 22,
    city: "Yogyakarta",
    location: "Sleman",
    distance: "4.4 km",
    sports: ["Futsal", "Basketball"],
    level: "Intermediate",
    avatar: "🏀",
    photo: "/images/gilang.jpg",
    color: "green",
  },
  {
    id: 6,
    name: "Elina Joerg",
    age: 26,
    city: "Jakarta",
    location: "Bintaro",
    distance: "9.8 km",
    sports: ["Tennis", "Swimming", "Padel"],
    level: "Beginner",
    avatar: "🎾",
    photo: "/images/elina.jpg",
    color: "pink",
  },
  {
    id: 7,
    name: "Gibran Rakabuming",
    age: 34,
    city: "Solo",
    location: "Sumber",
    distance: "9.8 km",
    sports: ["Futsal", "Football", "Badminton"],
    level: "Beginner",
    avatar: "🎾",
    photo: "/images/gibran.jpg",
    color: "blue",
  },
  {
    id: 8,
    name: "Raffi Ahmad",
    age: 34,
    city: "Jakarta",
    location: "Andara",
    distance: "14.7 km",
    sports: ["Tennis", "Football", "Badminton"],
    level: "Advanced",
    avatar: "🎾",
    photo: "/images/raffi.jpg",
    color: "blue",
  },
  {
    id: 8,
    name: "Tirta Mandira Hudhi",
    age: 43,
    city: "Yogyakarta",
    location: "Sleman",
    distance: "7 km",
    sports: ["Running", "Cycling"],
    level: "Advanced",
    avatar: "🎾",
    photo: "/images/tirta.jpg",
    color: "blue",
  },
];

const sports = [
  "Badminton",
  "Futsal",
  "Basketball",
  "Football",
  "Tennis",
  "Volleyball",
  "Running",
  "Cycling",
  "Swimming",
  "Padel",
];
const indonesiaLocations = [
  "Semua Lokasi",
  "Ambon",
  "Bandung",
  "Bekasi",
  "Bengkulu",
  "Bogor",
  "Cilegon",
  "Cimahi",
  "Cirebon",
  "Denpasar",
  "Depok",
  "Gorontalo",
  "Jambi",
  "Jakarta",
  "Solo",
  "Yogyakarta",
];
const navItems = [
  { name: "Discover", icon: "◉" },
  { name: "Player", icon: "♟" },
  { name: "Chat", icon: "☏" },
  { name: "Profile", icon: "♙" },
];

function SportMateLogo() {
  return (
    <div className="brand">
      <span className="brand-mark">ϟ</span>
      <span>
        Sport<span>Mate</span>
      </span>
    </div>
  );
}

function Avatar({ player, photo, size = "md" }) {
  return (
    <div className={`avatar avatar-${size} avatar-${player?.color || "lime"}`}>
      {photo || player?.photo ? (
        <img
          src={photo || player.photo}
          alt={`Foto ${player?.name || "profil"}`}
        />
      ) : (
        player?.avatar || "👤"
      )}
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Discover");
  const [players, setPlayers] = useState(demoPlayers);
  const [connected, setConnected] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("Yogyakarta");
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [draftMessage, setDraftMessage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(
    () => localStorage.getItem("sportmate-profile-photo") || "",
  );
  const [imageToCrop, setImageToCrop] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [searchPlayer, setSearchPlayer] = useState("");

  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [playerNotification, setPlayerNotification] = useState(false);
  const [chatNotification, setChatNotification] = useState(false);

  useEffect(() => {
    if (profilePhoto)
      localStorage.setItem("sportmate-profile-photo", profilePhoto);
    else localStorage.removeItem("sportmate-profile-photo");
  }, [profilePhoto]);

  const visiblePlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesLocation =
        selectedLocation === "Semua Lokasi" ||
        player.city?.toLowerCase() === selectedLocation.toLowerCase();

      const matchesSport =
        selectedSports.length === 0 ||
        selectedSports.some((sport) => player.sports.includes(sport));

      return matchesLocation && matchesSport;
    });
  }, [players, selectedSports, selectedLocation]);

  const currentPlayer = visiblePlayers[0];
  const activeChat = connected.find((player) => player.id === selectedChat);
  const currentMessages = selectedChat ? chatMessages[selectedChat] || [] : [];
  const filteredConnected = connected.filter((player) =>
    `${player.name} ${player.location} ${player.sports.join(" ")}`
      .toLowerCase()
      .includes(searchPlayer.toLowerCase()),
  );

  function toggleSport(sport) {
    setSelectedSports((prev) =>
      prev.includes(sport)
        ? prev.filter((item) => item !== sport)
        : [...prev, sport],
    );
  }

  const filteredLocations = indonesiaLocations.filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase()),
  );

  function changePage(page) {
    setActivePage(page);
    setNotice("");

    if (page === "Player") {
      setPlayerNotification(false);
    }

    if (page === "Chat") {
      setChatNotification(false);
    }

    if (page !== "Chat") {
      setSelectedChat(null);
      setMobileChatOpen(false);
    }
  }

  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const swipeStart = useRef(null);

  function handleSwipeStart(e) {
    swipeStart.current = {
      x: e.clientX,
      y: e.clientY,
    };

    setIsSwiping(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleSwipeMove(e) {
    if (!swipeStart.current) return;

    const deltaX = e.clientX - swipeStart.current.x;

    setSwipeOffset(deltaX);
  }

  function handleSwipeEnd() {
    if (!swipeStart.current) return;

    if (swipeOffset > 100) {
      handleConnect();
    } else if (swipeOffset < -100) {
      handleSkip();
    }

    swipeStart.current = null;
    setSwipeOffset(0);
    setIsSwiping(false);
  }

  function handleConnect() {
    if (!currentPlayer) return;

    setConnected((prev) =>
      prev.some((p) => p.id === currentPlayer.id)
        ? prev
        : [...prev, currentPlayer],
    );

    setPlayers((prev) => prev.filter((p) => p.id !== currentPlayer.id));

    setPlayerNotification(true);

    setNotice(`${currentPlayer.name} berhasil ditambahkan ke Player kamu!`);
  }

  function handleSkip() {
    if (!currentPlayer) return;
    setPlayers((prev) => prev.filter((p) => p.id !== currentPlayer.id));
    setNotice("Profil berhasil dilewati.");
  }

  function handleSendMessage(event) {
    event.preventDefault();
    const message = draftMessage.trim();
    if (!message || !selectedChat) return;
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatMessages((prev) => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage],
    }));
    setDraftMessage("");
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError("");
    if (!file.type.startsWith("image/")) {
      setPhotoError("File harus berupa gambar.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageToCrop(reader.result);
    reader.onerror = () =>
      setPhotoError("Gagal membaca foto. Silakan coba lagi.");
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  const nav = (mobile = false) => (
    <nav
      className={mobile ? "mobile-nav" : "side-nav"}
      aria-label="Navigasi utama"
    >
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => changePage(item.name)}
          className={`nav-link ${activePage === item.name ? "active" : ""}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.name}</span>
          {item.name === "Player" && playerNotification && (
            <span className="notification-dot"></span>
          )}
          {item.name === "Chat" && chatNotification && (
            <span className="notification-dot"></span>
          )}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="logo-button" onClick={() => changePage("Discover")}>
          <SportMateLogo />
        </button>
        {nav()}
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">✦</span>
            <strong>Main aman, main seru</strong>
            <p>
              Ketemu partner baru? Pilih lapangan publik dan jaga komunikasi
              tetap nyaman.
            </p>
          </div>
          <button
            className="mini-profile"
            onClick={() => changePage("Profile")}
          >
            <Avatar
              player={{ avatar: "👤", color: "lime" }}
              photo={profilePhoto}
              size="sm"
            />
            <span>
              <strong>Guest User</strong>
              <small>Yogyakarta</small>
            </span>
            <span className="more-dots">···</span>
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="mobile-header">
          <button
            className="logo-button"
            onClick={() => changePage("Discover")}
          >
            <SportMateLogo />
          </button>
          <div className="location-picker">
            <button
              className="location-pill"
              aria-expanded={locationOpen}
              onClick={() => setLocationOpen((open) => !open)}
            >
              📍 <span>{selectedLocation}</span>⌄
            </button>
            {locationOpen && (
              <div className="location-dropdown">
                <input
                  autoFocus
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Cari kota atau daerah..."
                  aria-label="Cari lokasi"
                />
                <div className="location-options">
                  {filteredLocations.map((location) => (
                    <button
                      key={location}
                      className={selectedLocation === location ? "chosen" : ""}
                      onClick={() => {
                        setSelectedLocation(location);
                        setLocationOpen(false);
                        setLocationSearch("");
                      }}
                    >
                      {location}
                      {selectedLocation === location && <span>✓</span>}
                    </button>
                  ))}
                  {filteredLocations.length === 0 && (
                    <p>Lokasi tidak ditemukan.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <main className={`main-content page-${activePage.toLowerCase()}`}>
          {activePage === "Discover" && (
            <>
              <div className="page-heading discover-heading">
                <div>
                  <p className="eyebrow">
                    Halo, Arya! Cuaca cerah, pas buat olahraga ☀️
                  </p>
                  <h1>
                    Cari partner, <span>gas main!</span>
                  </h1>
                </div>
                <div className="location-picker desktop-location-wrap">
                  <button
                    className="desktop-location"
                    aria-expanded={locationOpen}
                    onClick={() => setLocationOpen((open) => !open)}
                  >
                    📍{" "}
                    <span>
                      <small>LOKASI PENCARIAN</small>
                      <strong>{selectedLocation}</strong>
                    </span>
                    ⌄
                  </button>
                  {locationOpen && (
                    <div className="location-dropdown">
                      <input
                        autoFocus
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="Cari kota atau daerah..."
                        aria-label="Cari lokasi"
                      />
                      <div className="location-options">
                        {filteredLocations.map((location) => (
                          <button
                            key={location}
                            className={
                              selectedLocation === location ? "chosen" : ""
                            }
                            onClick={() => {
                              setSelectedLocation(location);
                              setLocationOpen(false);
                              setLocationSearch("");
                            }}
                          >
                            {location}
                            {selectedLocation === location && <span>✓</span>}
                          </button>
                        ))}
                        {filteredLocations.length === 0 && (
                          <p>Lokasi tidak ditemukan.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <section className="filter-panel">
                <div className="filter-title">
                  <h2>Mau main apa?</h2>
                  <span>pilih olahraga</span>
                  <button onClick={() => setSelectedSports([])}>↶ Reset</button>
                </div>
                <div className="sport-chips">
                  {sports.map((sport) => (
                    <button
                      key={sport}
                      className={`sport-chip ${selectedSports.includes(sport) ? "selected" : ""}`}
                      aria-pressed={selectedSports.includes(sport)}
                      onClick={() => toggleSport(sport)}
                    >
                      <span>
                        {
                          {
                            Badminton: "🏸",
                            Futsal: "⚽",
                            Basketball: "🏀",
                            Football: "⚽",
                            Tennis: "🎾",
                            Volleyball: "🏐",
                            Running: "🏃",
                            Cycling: "🚴",
                            Swimming: "🏊",
                            "Table Tennis": "🏓",
                          }[sport]
                        }
                      </span>
                      {sport}
                    </button>
                  ))}
                </div>
              </section>

              <div className="discover-layout">
                <section className="discover-stage">
                  <div className="stage-topline">
                    <strong>
                      {visiblePlayers.length}{" "}
                      <span>player cocok di sekitarmu</span>
                    </strong>
                    <span className="stage-controls">
                      Geser atau pilih <b>Connect</b>
                    </span>
                  </div>
                  {currentPlayer ? (
                    <div className="discover-card-wrap">
                      <article
                        className={`discover-card card-${currentPlayer.color}`}
                        onPointerDown={handleSwipeStart}
                        onPointerMove={handleSwipeMove}
                        onPointerUp={handleSwipeEnd}
                        onPointerCancel={handleSwipeEnd}
                        style={{
                          transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.04}deg)`,
                          transition: isSwiping
                            ? "none"
                            : "transform 0.3s ease",
                          touchAction: "pan-y",
                          cursor: isSwiping ? "grabbing" : "grab",
                        }}
                      >
                        {swipeOffset > 40 && (
                          <div className="swipe-indicator swipe-like">
                            CONNECT
                          </div>
                        )}

                        {swipeOffset < -40 && (
                          <div className="swipe-indicator swipe-nope">SKIP</div>
                        )}
                        <div className="discover-photo">
                          <div className="photo-overlay-top">
                            <span>📍 {currentPlayer.distance}</span>
                            <span className="level-pill">
                              {currentPlayer.level}
                            </span>
                          </div>
                          <img
                            className="discover-player-photo"
                            src={currentPlayer.photo}
                            alt={`Foto ${currentPlayer.name}`}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="discover-player-info">
                            <h2>
                              {currentPlayer.name},{" "}
                              <span>{currentPlayer.age}</span>
                            </h2>
                            <p>
                              📍 {currentPlayer.location} ·{" "}
                              {currentPlayer.distance} dari kamu
                            </p>
                            <div className="discover-sports">
                              {currentPlayer.sports.map((sport) => (
                                <span key={sport}>{sport}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </article>
                      <div className="discover-actions">
                        <button
                          className="skip-button"
                          onClick={handleSkip}
                          aria-label="Lewati pemain"
                        >
                          ✕
                        </button>
                        <button
                          className="connect-button"
                          onClick={handleConnect}
                        >
                          ↗ <span>Connect</span>
                        </button>
                      </div>
                      <p className="connect-hint">
                        ⚡ Connect = langsung masuk ke halaman Player kamu.
                        Nggak perlu nunggu match.
                      </p>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <span>🎉</span>
                      <h3>Semua pemain sudah kamu lihat!</h3>
                      <p>
                        Coba ubah lokasi atau pilihan olahraga untuk menemukan
                        partner baru.
                      </p>
                      <button
                        className="primary-button"
                        onClick={() => {
                          setSelectedSports([]);
                          setPlayers(
                            demoPlayers.filter(
                              (p) => !connected.some((c) => c.id === p.id),
                            ),
                          );
                        }}
                      >
                        Cari lagi
                      </button>
                    </div>
                  )}
                  {notice && (
                    <p className="notice" role="status">
                      {notice}
                    </p>
                  )}
                </section>

                <aside className="discover-aside">
                  <section className="dark-panel">
                    <div className="aside-heading">
                      <span>PLAYER KAMU</span>
                      <b>{connected.length}</b>
                      <small>partner siap diajak main</small>
                    </div>
                    <div className="connected-preview">
                      {connected.slice(0, 4).map((player) => (
                        <div className="connected-row" key={player.id}>
                          <Avatar player={player} size="sm" />
                          <span>
                            <strong>{player.name}</strong>
                            <small>{player.level}</small>
                          </span>
                          <button
                            onClick={() => {
                              setSelectedChat(player.id);
                              changePage("Chat");
                            }}
                          >
                            ☏
                          </button>
                        </div>
                      ))}
                      {connected.length === 0 && (
                        <p className="aside-empty">
                          Belum ada partner. Yuk mulai Connect!
                        </p>
                      )}
                    </div>
                    <button
                      className="dark-panel-button"
                      onClick={() => changePage("Player")}
                    >
                      Lihat semua Player →
                    </button>
                  </section>
                  <section className="how-panel">
                    <h3>Cara kerjanya</h3>
                    <div>
                      <b>1</b>
                      <span>
                        <strong>Swipe kanan</strong>
                        <small>
                          Profil langsung masuk ke halaman Player kamu.
                        </small>
                      </span>
                    </div>
                    <div>
                      <b>2</b>
                      <span>
                        <strong>Sapa lewat Chat</strong>
                        <small>
                          Atur jadwal dan lapangan bareng partner baru.
                        </small>
                      </span>
                    </div>
                    <div>
                      <b>3</b>
                      <span>
                        <strong>Gas main!</strong>
                        <small>Ketemu, olahraga, dan bangun circle baru.</small>
                      </span>
                    </div>
                  </section>
                </aside>
              </div>
            </>
          )}

          {activePage === "Player" && (
            <section className="player-page">
              <div className="player-hero">
                <div>
                  <span className="hero-kicker">
                    ✦ CONNECT TANPA NUNGGU MATCH
                  </span>
                  <h1>
                    Player kamu <b>{connected.length}</b>
                  </h1>
                  <p>
                    Semua orang yang kamu Connect di Discover ada di sini.
                    <br />
                    Sapa duluan, atur jadwal, gas main!
                  </p>
                </div>
                <input
                  value={searchPlayer}
                  onChange={(e) => setSearchPlayer(e.target.value)}
                  placeholder="⌕ Cari nama atau kota..."
                  aria-label="Cari player"
                />
              </div>
              <div className="player-filter-row">
                {["Semua", ...sports.slice(1)].map((s) => (
                  <button key={s} className={s === "Semua" ? "selected" : ""}>
                    {s}
                  </button>
                ))}
              </div>
              {filteredConnected.length ? (
                <div className="player-grid">
                  {filteredConnected.map((player) => (
                    <article className="player-card" key={player.id}>
                      <div className={`player-card-art art-${player.color}`}>
                        <img src={player.photo} alt={`Foto ${player.name}`} />
                        <small>📍 {player.distance}</small>
                      </div>
                      <div className="player-card-content">
                        <h3>
                          {player.name}, <span>{player.age}</span>
                        </h3>
                        <p className="muted">📍 {player.location}</p>
                        <small className="field-label">OLAHRAGA FAVORIT</small>
                        <div className="tag-row">
                          {player.sports.map((s) => (
                            <span key={s}>{s}</span>
                          ))}
                        </div>
                        <small className="level-label">
                          SKILL <b>{player.level}</b>
                        </small>
                        <button
                          className="chat-player-button"
                          onClick={() => {
                            setSelectedChat(player.id);
                            setMobileChatOpen(true);
                            changePage("Chat");
                          }}
                        >
                          ☏ Chat {player.name.split(" ")[0]}
                        </button>
                      </div>
                    </article>
                  ))}
                  <button
                    className="find-more-card"
                    onClick={() => changePage("Discover")}
                  >
                    <span>＋</span>
                    <strong>Cari partner lagi</strong>
                    <small>Masih ada player seru di sekitarmu.</small>
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <span>🤝</span>
                  <h3>Belum ada Player</h3>
                  <p>
                    Connect dengan seseorang di Discover untuk mulai membangun
                    circle olahraga.
                  </p>
                  <button
                    className="primary-button"
                    onClick={() => changePage("Discover")}
                  >
                    Cari partner
                  </button>
                </div>
              )}
            </section>
          )}

          {activePage === "Chat" && (
            <section
              className={`chat-page ${mobileChatOpen && activeChat ? "chat-mobile-open" : ""}`}
            >
              <div className="conversation-panel">
                <div className="chat-panel-heading">
                  <h1>Chat</h1>
                  <span>{connected.length} partner</span>
                </div>
                <input
                  className="chat-search"
                  placeholder="⌕ Cari percakapan"
                  value={searchPlayer}
                  onChange={(e) => setSearchPlayer(e.target.value)}
                />
                <p className="list-label">PERCAPAKAN</p>
                {filteredConnected.length ? (
                  filteredConnected.map((player) => {
                    const last = (chatMessages[player.id] || []).slice(-1)[0];
                    return (
                      <button
                        key={player.id}
                        className={`conversation-row ${selectedChat === player.id ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedChat(player.id);
                          setMobileChatOpen(true);
                        }}
                      >
                        <Avatar player={player} size="sm" />
                        <span>
                          <strong>{player.name}</strong>
                          <small>{last?.text || "Mulai percakapan..."}</small>
                        </span>
                        <time>{last?.time || "Baru"}</time>
                      </button>
                    );
                  })
                ) : (
                  <p className="empty-conversations">
                    Belum ada percakapan. Connect player dulu di Discover.
                  </p>
                )}
              </div>
              <div className="message-panel">
                {activeChat ? (
                  <>
                    <header className="message-header">
                      <button
                        className="mobile-back"
                        onClick={() => setMobileChatOpen(false)}
                      >
                        ←
                      </button>
                      <Avatar player={activeChat} size="sm" />
                      <span>
                        <strong>{activeChat.name}</strong>
                        <small>● Online · {activeChat.sports.join(", ")}</small>
                      </span>
                      <button
                        className="profile-chat-button"
                        onClick={() => changePage("Player")}
                      >
                        Profil
                      </button>
                    </header>
                    <div className="message-list">
                      {currentMessages.length === 0 ? (
                        <div className="chat-welcome">
                          <span>👋</span>
                          <h3>Mulai obrolan dengan {activeChat.name}</h3>
                          <p>Kenalan dulu, lalu atur jadwal olahraga bareng.</p>
                        </div>
                      ) : (
                        currentMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`message-line ${message.sender === "me" ? "mine" : ""}`}
                          >
                            <div className="message-bubble">
                              {message.text}
                              <small>{message.time}</small>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <form className="message-form" onSubmit={handleSendMessage}>
                      <input
                        value={draftMessage}
                        onChange={(e) => setDraftMessage(e.target.value)}
                        placeholder={`Tulis pesan ke ${activeChat.name}...`}
                        aria-label="Tulis pesan"
                      />
                      <button disabled={!draftMessage.trim()}>Kirim ↗</button>
                    </form>
                  </>
                ) : (
                  <div className="chat-placeholder">
                    <span>💬</span>
                    <h3>Pilih percakapan</h3>
                    <p>Pilih partner di sebelah kiri untuk mulai mengobrol.</p>
                  </div>
                )}
              </div>
              <aside className="chat-profile-panel">
                {activeChat ? (
                  <>
                    <div className={`chat-profile-art art-${activeChat.color}`}>
                      <img
                        src={activeChat.photo}
                        alt={`Foto ${activeChat.name}`}
                      />
                      <strong>
                        {activeChat.name}, {activeChat.age}
                      </strong>
                      <small>📍 {activeChat.location}</small>
                    </div>
                    <p className="field-label">OLAHRAGA</p>
                    <div className="tag-row">
                      {activeChat.sports.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                    <p className="field-label">SKILL LEVEL</p>
                    <b className="skill-badge">{activeChat.level}</b>
                    <div className="safe-note">
                      ✦ Kamu Connect dengan {activeChat.name} lewat Discover
                    </div>
                  </>
                ) : (
                  <div className="chat-placeholder small">
                    <span>🏸</span>
                    <p>Info partner akan muncul di sini.</p>
                  </div>
                )}
              </aside>
            </section>
          )}

          {activePage === "Profile" && (
            <section className="profile-page">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">
                    Atur bagaimana player lain melihat kamu
                  </p>
                  <h1>Profil & Pengaturan</h1>
                </div>
                <span className="saved-pill">☁ Tersimpan di perangkat</span>
              </div>
              <div className="profile-layout">
                <aside className="profile-summary">
                  <div className="profile-cover">
                    <span>🏸　⚽　🏓</span>
                  </div>
                  <div className="profile-summary-body">
                    <div className="profile-photo-wrap">
                      <Avatar
                        player={{ avatar: "👤", color: "lime" }}
                        photo={profilePhoto}
                        size="xl"
                      />
                      <label className="photo-edit-button">
                        📷
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </label>
                    </div>
                    <h2>Guest User</h2>
                    <p>22 tahun · Yogyakarta</p>
                    <p className="profile-bio">
                      Cari partner buat main rutin dan seru-seruan bareng!
                    </p>
                    <div className="profile-stats">
                      <span>
                        <b>{connected.length}</b>
                        <small>Player</small>
                      </span>
                      <span>
                        <b>{Object.keys(chatMessages).length}</b>
                        <small>Chat</small>
                      </span>
                      <span>
                        <b>3</b>
                        <small>Olahraga</small>
                      </span>
                    </div>
                  </div>
                </aside>
                <div className="profile-form-panel">
                  <div className="profile-tabs">
                    <button className="active">✎ Edit Profil</button>
                    <button>♧ Olahraga</button>
                    <button>♙ Privasi</button>
                    <button>♧ Notifikasi</button>
                  </div>
                  <h2>Foto profil</h2>
                  <p className="form-help">
                    Gunakan foto yang jelas agar partner mudah mengenalimu.
                  </p>
                  <div className="photo-actions">
                    <label className="secondary-button">
                      Pilih foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    {profilePhoto && (
                      <button
                        className="secondary-button danger"
                        onClick={() => setProfilePhoto("")}
                      >
                        Hapus foto
                      </button>
                    )}
                  </div>
                  {photoError && (
                    <p className="error-text" role="alert">
                      {photoError}
                    </p>
                  )}
                  <div className="form-divider" />
                  <h2>Informasi pribadi</h2>
                  <p className="form-help">
                    Informasi ini akan membantu partner mengenalmu.
                  </p>
                  <div className="form-grid">
                    <label>
                      Nama
                      <input defaultValue="Guest User" />
                    </label>
                    <label>
                      Usia
                      <input defaultValue="22" type="number" />
                    </label>
                    <label className="full-field">
                      Lokasi
                      <select defaultValue="Yogyakarta">
                        <option>Yogyakarta</option>
                        <option>Sleman</option>
                        <option>Bantul</option>
                        <option>Depok</option>
                        <option>Jakarta Selatan</option>
                      </select>
                    </label>
                    <label className="full-field">
                      Bio singkat
                      <textarea
                        defaultValue="Cari partner buat main rutin dan seru-seruan bareng!"
                        maxLength={150}
                      />
                    </label>
                  </div>
                  <div className="form-footer">
                    <button
                      className="primary-button"
                      onClick={() =>
                        setNotice(
                          "Tampilan profil berhasil diperbarui di prototype.",
                        )
                      }
                    >
                      ✓ Simpan perubahan
                    </button>
                  </div>
                  {notice && <p className="notice">{notice}</p>}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {nav(true)}
      {imageToCrop && (
        <PhotoCropModal
          image={imageToCrop}
          onCancel={() => setImageToCrop(null)}
          onSave={(croppedImage) => {
            setProfilePhoto(croppedImage);
            setImageToCrop(null);
            setPhotoError("");
          }}
        />
      )}
    </div>
  );
}

export default App;
