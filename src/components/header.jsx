import { useState, useRef, useEffect } from "react";

export default function Header(props) {
  const [playlistOptions, setPlaylistOptions] = useState(
    <option>Default</option>
  );
  const selectionVal = useRef("Default");
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  // fetch latest playlist data after first render (if the user is already logged in) and everytime a user logs in or a playlist/song gets uploaded
  useEffect(() => {
    getPlaylistNames();
  }, [props.username, props.uploadId]);

  // fetch playlist names to be displayed as options in the playlist dropdown menu
  async function getPlaylistNames() {
    try {
      const namesUrl = `${serverRoot}/playlists/get-playlistnames`;
      const response = await fetch(namesUrl, { credentials: "include" });
      const result = await response.json();
      if (result.success) {
        setPlaylistOptions(
          result.playlistNames.map((v) => {
            return <option key={v.playlist}>{v.playlist}</option>;
          })
        );
        selectPlaylist(
          result.playlistNames.every(
            (v) => v.playlist.indexOf(selectionVal.current) === -1
          )
            ? result.playlistNames[0].playlist
            : selectionVal.current
        );
      } else {
        selectionVal.current = "Default";
        setPlaylistOptions(<option>Default</option>);
        props.setPlaylistData("");
        props.changeStatusMessage(result.error);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  // change selected playlist
  function selectPlaylist(playlistName) {
    selectionVal.current = playlistName;
    fetchPlaylist(selectionVal.current);
  }

  // fetch playlist songs from the playlist dropdown menu
  async function fetchPlaylist(playlistData) {
    try {
      const formData = new FormData();
      formData.set("playlist", playlistData);
      const playlistUrl = `${serverRoot}/playlists/get-playlist`;
      const response = await fetch(playlistUrl, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const result = await response.json();
      if (result.playlist) {
        props.setPlaylistData(result.playlist);
        props.changeStatusMessage(`Playlist '${playlistData}' selected!`);
      } else {
        props.changeStatusMessage(result.error);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  return (
    <header>
      <div>
        <img onClick={props.toggleView} src={props.viewButton} alt="chevron" />
      </div>
      <div>
        <div>Welcome, {props.username}</div>
        <select onChange={(e) => selectPlaylist(e.target.value)}>
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
