
import Avatar from "../components/Avatar";

function Profile({
  profilePhoto,
  handlePhotoChange,
  connected,
  chatMessages,
  setProfilePhoto,
  photoError,
  setNotice,
  notice,
}) {
  return (
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
                  "Tampilan profil berhasil diperbarui di prototype."
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
  );
}

export default Profile;
