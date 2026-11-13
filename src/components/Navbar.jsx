function Navbar({
  mobile = false,
  activePage,
  changePage,
  playerNotification,
  chatNotification,
}) {
  const navItems = [
    { name: "Discover", icon: "◉" },
    { name: "Player", icon: "♟" },
    { name: "Chat", icon: "☏" },
    { name: "Profile", icon: "♙" },
  ];

  return (
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
}

export default Navbar;
