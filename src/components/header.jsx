import { useState, useEffect } from "react";

export default function Header({
  viewButton,
  popupImage,
  popupList,
  username,
  uploadMessage,
  changeStatusMessage,
  setPlaylistData,
  toggleView,
  togglePopupMenu,
}) {
  const [playlistOptions, setPlaylistOptions] = useState(
    <option>Default</option>
  );
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  async function getPlaylistNames() {
    const url = `${serverRoot}/playlists/get-playlists`;
    try {
      const response = await fetch(url, { credentials: "include" });
      const result = await response.json();
      if (result.error) {
        setPlaylistOptions(<option>Default</option>);
        changeStatusMessage(result.error);
      } else {
        setPlaylistOptions(
          result.playlistNames.map((v, i) => {
            return <option key={i}>{v.playlist}</option>;
          })
        );
        changeStatusMessage(result.success);
      }
    } catch (err) {
      changeStatusMessage(err.message);
    }
  }

  useEffect(() => {
    getPlaylistNames();
  }, [username, uploadMessage]);

  return (
    <header>
      <div>
        <img onClick={toggleView} src={viewButton} alt="chevron" />
      </div>
      <div>
        <div>Welcome, {username}</div>
        <select
          onChange={(e) => {
            setPlaylistData(e.target.value);
          }}
        >
          {playlistOptions}
        </select>
      </div>
      <div>
        <img onClick={togglePopupMenu} src={popupImage} alt="menu" />
        {popupList}
      </div>
    </header>
  );
}
