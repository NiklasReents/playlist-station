import { useState, useRef } from "react";

import Song from "./song.jsx";

export default function Playlist(props) {
  const [activeSongIndex, setActiveSongIndex] = useState(null);
  const lastSelectedSong = useRef("");
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  function handleSongChange() {
    if (activeSongIndex < props.playlistData.songs.length) {
      setActiveSongIndex((prevIndex) => prevIndex + 1);
    }
  }

  function handleSongSelection(e) {
    const list = e.currentTarget.children;
    const selectedSong = e.target.parentElement.parentElement;
    for (let i = 0; i < list.length; i++) {
      if (
        selectedSong === list[i] &&
        selectedSong !== lastSelectedSong.current
      ) {
        lastSelectedSong.current = selectedSong;
        setActiveSongIndex(i);
      } else if (
        selectedSong === list[i] &&
        selectedSong === lastSelectedSong.current
      ) {
        lastSelectedSong.current = "";
        setActiveSongIndex(null);
      }
    }
  }

  // delete the currently selected playlist
  async function deletePlaylist() {
    try {
      const formData = new FormData();
      formData.set("id", props.playlistData._id);
      const deletionUrl = `${serverRoot}/playlists/delete-playlist`;
      const response = await fetch(deletionUrl, {
        method: "delete",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        props.setUploadId(crypto.randomUUID());
        props.changeStatusMessage(result.success);
      } else {
        props.changeStatusMessage(result.error);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }
  // inject the fetched data into song components
  function renderSongList(playlist) {
    return playlist ? (
      playlist.map((v, i) => {
        return (
          <Song
            key={v._id}
            id={v._id}
            image={v.image.replace("public", "")}
            audio={v.audio.replace("public", "")}
            song={v.song}
            artist={v.artist}
            genre={v.genre}
            isActive={activeSongIndex === i}
            setUploadId={props.setUploadId}
            changeStatusMessage={props.changeStatusMessage}
            handleSongChange={handleSongChange}
          />
        );
      })
    ) : (
      <li>No songs found.</li>
    );
  }

  return (
    <>
      {props.playlistData && (
        <button onClick={deletePlaylist}>Delete Playlist</button>
      )}
      <ul
        onClick={(e) => handleSongSelection(e)}
        style={{ listStyleType: "none" }}
      >
        {renderSongList(props.playlistData.songs)}
      </ul>
    </>
  );
}
