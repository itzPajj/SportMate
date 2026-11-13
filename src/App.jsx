import { useEffect, useMemo, useRef, useState } from "react";
import PhotoCropModal from "./PhotoCropModal";

import { demoPlayers, indonesiaLocations } from "./data/player";
import { sports } from "./data/sport";

import Avatar from "./components/Avatar";
import SportMateLogo from "./components/SportMateLogo";
import Navbar from "./components/Navbar";

import Player from "./pages/Player";
import Chat from "./pages/Chat";

import Discover from "./pages/Discover";
import Profile from "./pages/Profile";

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

  function openChat(playerId) {
    setSelectedChat(playerId);
    setMobileChatOpen(true);
    changePage("Chat");
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

  function handleSendMessage() {
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

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="logo-button" onClick={() => changePage("Discover")}>
          <SportMateLogo />
        </button>
        <Navbar
          activePage={activePage}
          changePage={changePage}
          playerNotification={playerNotification}
          chatNotification={chatNotification}
        />
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
            <Discover
              currentPlayer={currentPlayer}
              visiblePlayers={visiblePlayers}
              connected={connected}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locationOpen={locationOpen}
              setLocationOpen={setLocationOpen}
              locationSearch={locationSearch}
              setLocationSearch={setLocationSearch}
              filteredLocations={filteredLocations}
              selectedSports={selectedSports}
              setSelectedSports={setSelectedSports}
              sports={sports}
              toggleSport={toggleSport}
              handleSwipeStart={handleSwipeStart}
              handleSwipeMove={handleSwipeMove}
              handleSwipeEnd={handleSwipeEnd}
              swipeOffset={swipeOffset}
              isSwiping={isSwiping}
              handleSkip={handleSkip}
              handleConnect={handleConnect}
              notice={notice}
              setPlayers={setPlayers}
              demoPlayers={demoPlayers}
              setSelectedChat={setSelectedChat}
              changePage={changePage}
            />
          )}

          {activePage === "Player" && (
            <Player
              connected={connected}
              filteredConnected={filteredConnected}
              searchPlayer={searchPlayer}
              setSearchPlayer={setSearchPlayer}
              sports={sports}
              onOpenChat={openChat}
              changePage={changePage}
            />
          )}

          {activePage === "Chat" && (
            <Chat
              connected={connected}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              activeChat={activeChat}
              currentMessages={currentMessages}
              draftMessage={draftMessage}
              setDraftMessage={setDraftMessage}
              handleSendMessage={handleSendMessage}
              mobileChatOpen={mobileChatOpen}
              setMobileChatOpen={setMobileChatOpen}
            />
          )}

          {activePage === "Profile" && (
            <Profile
              profilePhoto={profilePhoto}
              handlePhotoChange={handlePhotoChange}
              connected={connected}
              chatMessages={chatMessages}
              setProfilePhoto={setProfilePhoto}
              photoError={photoError}
              setNotice={setNotice}
              notice={notice}
            />
          )}
        </main>
      </div>

      <Navbar
        mobile
        activePage={activePage}
        changePage={changePage}
        playerNotification={playerNotification}
        chatNotification={chatNotification}
      />
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
