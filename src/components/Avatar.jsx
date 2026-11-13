function Avatar({ player, photo, size = "md" }) {
  return (
    <div className={`avatar avatar-${size} avatar-${player?.color || "lime"}`}>
      {photo || player?.photo ? (
        <img
          src={photo || player?.photo}
          alt={`Foto ${player?.name || "profil"}`}
        />
      ) : (
        player?.avatar || "👤"
      )}
    </div>
  );
}

export default Avatar;
