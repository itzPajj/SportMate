
import Avatar from "../components/Avatar";

function Discover({
  currentPlayer,
  visiblePlayers,
  connected,
  selectedLocation,
  setSelectedLocation,
  locationOpen,
  setLocationOpen,
  locationSearch,
  setLocationSearch,
  filteredLocations,
  selectedSports,
  setSelectedSports,
  sports,
  toggleSport,
  handleSwipeStart,
  handleSwipeMove,
  handleSwipeEnd,
  swipeOffset,
  isSwiping,
  handleSkip,
  handleConnect,
  notice,
  setPlayers,
  demoPlayers,
  setSelectedChat,
  changePage,
}) {
  return (
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

          <button onClick={() => setSelectedSports([])}>
            ↶ Reset
          </button>
        </div>

        <div className="sport-chips">
          {sports.map((sport) => (
            <button
              key={sport}
              className={`sport-chip ${
                selectedSports.includes(sport) ? "selected" : ""
              }`}
              aria-pressed={selectedSports.includes(sport)}
              onClick={() => toggleSport(sport)}
            >
              <span>
                {{
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
                }[sport]}
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
                  <div className="swipe-indicator swipe-nope">
                    SKIP
                  </div>
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
                Coba ubah lokasi atau pilihan olahraga untuk
                menemukan partner baru.
              </p>

              <button
                className="primary-button"
                onClick={() => {
                  setSelectedSports([]);

                  setPlayers(
                    demoPlayers.filter(
                      (p) => !connected.some((c) => c.id === p.id)
                    )
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
                <small>
                  Ketemu, olahraga, dan bangun circle baru.
                </small>
              </span>
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

export default Discover;
