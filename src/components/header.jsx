import { useState, useEffect } from "react";

export default function Header(props) {
  const [playlistOptions, setPlaylistOptions] = useState(
    <option>Default</option>
  );
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;
  const url = `${serverRoot}/playlists/get-playlistnames`;

  async function getPlaylistNames() {
    try {
      const response = await fetch(url, { credentials: "include" });
      const result = await response.json();
      if (result.error) {
        setPlaylistOptions(<option>Default</option>);
        props.changeStatusMessage(result.error);
      } else {
        setPlaylistOptions(
          result.playlistNames.map((v, i) => {
            return <option key={i}>{v.playlist}</option>;
          })
        );
        props.changeStatusMessage(result.success);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  useEffect(() => {
    getPlaylistNames();
  }, [props.username, props.uploadId]);

  return (
    <header>
      <div>
        <img onClick={props.toggleView} src={props.viewButton} alt="chevron" />
      </div>
      <div>
        <div>Welcome, {props.username}</div>
        <select
          onChange={(e) => {
            props.setPlaylistData(e.target.value);
            props.changeStatusMessage(`Playlist ${e.target.value} selected!`);
          }}
        >
          {playlistOptions}
        </select>
      </div>
      <div>
        <img
          onClick={props.togglePopupMenu}
          src={props.popupImage}
          alt="menu"
        />
        {props.popupList}
      </div>
    </header>
  );
}
