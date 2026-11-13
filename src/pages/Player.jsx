
function Player({
  connected,
  filteredConnected,
  searchPlayer,
  setSearchPlayer,
  sports,
  onOpenChat,
  changePage,
}) {
  return (
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
          <button
            key={s}
            className={s === "Semua" ? "selected" : ""}
          >
            {s}
          </button>
        ))}
      </div>

      {filteredConnected.length ? (
        <div className="player-grid">
          {filteredConnected.map((player) => (
            <article className="player-card" key={player.id}>
              <div className={`player-card-art art-${player.color}`}>
                <img
                  src={player.photo}
                  alt={`Foto ${player.name}`}
                />
                <small>📍 {player.distance}</small>
              </div>

              <div className="player-card-content">
                <h3>
                  {player.name}, <span>{player.age}</span>
                </h3>

                <p className="muted">
                  📍 {player.location}
                </p>

                <small className="field-label">
                  OLAHRAGA FAVORIT
                </small>

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
                  onClick={() => onOpenChat(player.id)}
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
            Connect dengan seseorang di Discover untuk mulai
            membangun circle olahraga.
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
  );
}

export default Player;
