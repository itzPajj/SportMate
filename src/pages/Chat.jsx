
function Chat({
  connected,
  selectedChat,
  setSelectedChat,
  activeChat,
  currentMessages,
  draftMessage,
  setDraftMessage,
  handleSendMessage,
  mobileChatOpen,
  setMobileChatOpen,
}) {
  return (
    <section
      className={`chat-page ${mobileChatOpen ? "chat-mobile-open" : ""}`}
    >
      {/* Conversation List */}
      <aside className="conversation-panel">
        <div className="chat-panel-heading">
          <h1>Messages</h1>
          <span>{connected.length} Player</span>
        </div>

        <input
          className="chat-search"
          placeholder="⌕ Cari percakapan..."
          aria-label="Cari percakapan"
        />

        <small className="list-label">SEMUA PERCAKAPAN</small>

        <div className="conversation-list">
          {connected.map((player) => (
            <button
              key={player.id}
              className={`conversation-row ${
                selectedChat === player.id ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedChat(player.id);
                setMobileChatOpen(true);
              }}
            >
              <div className={`avatar avatar-sm avatar-${player.color}`}>
                {player.photo ? (
                  <img src={player.photo} alt={player.name} />
                ) : (
                  player.avatar || "👤"
                )}
              </div>

              <span>
                <strong>{player.name}</strong>
                <small>{player.location}</small>
              </span>
            </button>
          ))}

          {connected.length === 0 && (
            <p className="empty-conversations">
              Belum ada percakapan. Connect dengan player di Discover
              untuk mulai mengobrol.
            </p>
          )}
        </div>
      </aside>

      {/* Message Area */}
      <div className="message-panel">
        {activeChat ? (
          <>
            <div className="message-header">
              <button
                className="mobile-back"
                onClick={() => setMobileChatOpen(false)}
                aria-label="Kembali ke daftar percakapan"
              >
                ←
              </button>

              <div className={`avatar avatar-sm avatar-${activeChat.color}`}>
                {activeChat.photo ? (
                  <img src={activeChat.photo} alt={activeChat.name} />
                ) : (
                  activeChat.avatar || "👤"
                )}
              </div>

              <span>
                <strong>{activeChat.name}</strong>
                <small>{activeChat.location}</small>
              </span>

              <button className="profile-chat-button">
                Profile
              </button>
            </div>

            <div className="message-list">
              {currentMessages.length > 0 ? (
                currentMessages.map((message, index) => (
                  <div
                    key={message.id ?? index}
                    className={`message-line ${
                      message.sender === "me" ? "mine" : ""
                    }`}
                  >
                    <div className="message-bubble">
                      {message.text}
                      <small>{message.time}</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="chat-welcome">
                  <span>👋</span>
                  <h3>Mulai percakapan!</h3>
                  <p>
                    Sapa {activeChat.name} dan ajak olahraga bareng.
                  </p>
                </div>
              )}
            </div>

            <form
              className="message-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                value={draftMessage}
                onChange={(e) => setDraftMessage(e.target.value)}
                placeholder="Tulis pesan..."
                aria-label="Tulis pesan"
              />

              <button
                type="submit"
                disabled={!draftMessage.trim()}
              >
                Kirim
              </button>
            </form>
          </>
        ) : (
          <div className="chat-placeholder">
            <span>💬</span>
            <h3>Pilih percakapan</h3>
            <p>
              Pilih salah satu Player untuk mulai mengobrol.
            </p>
          </div>
        )}
      </div>

      {/* Player Profile */}
      <aside className="chat-profile-panel">
        {activeChat ? (
          <>
            <div className="chat-profile-art">
              {activeChat.photo ? (
                <img
                  src={activeChat.photo}
                  alt={activeChat.name}
                />
              ) : (
                <span>{activeChat.avatar || "👤"}</span>
              )}

              <strong>{activeChat.name}</strong>
              <small>{activeChat.location}</small>
            </div>

            <small className="field-label">
              OLAHRAGA FAVORIT
            </small>

            <div className="tag-row">
              {activeChat.sports?.map((sport) => (
                <span key={sport}>{sport}</span>
              ))}
            </div>

            <small className="field-label">
              LEVEL KEMAMPUAN
            </small>

            <span className="skill-badge">
              {activeChat.level || "Belum ditentukan"}
            </span>

            <div className="safe-note">
              🤝 Tetap jaga komunikasi yang baik dan nikmati olahraga
              bersama!
            </div>
          </>
        ) : (
          <div className="chat-placeholder small">
            <span>👤</span>
            <p>Informasi Player akan muncul di sini.</p>
          </div>
        )}
      </aside>
    </section>
  );
}

export default Chat;
