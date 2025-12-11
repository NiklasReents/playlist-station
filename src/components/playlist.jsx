import { useState, useRef, useEffect } from "react";

import Song from "./song.jsx";

export default function Playlist(props) {
  const [activeSongIndex, setActiveSongIndex] = useState(null);
  const [playlistProgress, setPlaylistProgress] = useState(null);
  const [songVolume, setSongVolume] = useState(1);
  const lastSelectedSong = useRef("");
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  useEffect(resetIndexes, [props.playlistData._id]);

  // reset indexes (after changing playlists or closing a song)
  function resetIndexes() {
    lastSelectedSong.current = "";
    setActiveSongIndex(null);
    setPlaylistProgress(null);
  }

  // manage the transition between songs in a playlist
  function handleSongChange(currentSong) {
    const nextSong = currentSong.nextElementSibling?.firstElementChild;
    if (activeSongIndex < props.playlistData.songs.length - 1) {
      lastSelectedSong.current = nextSong;
      setActiveSongIndex((prevIndex) => prevIndex + 1);
      setPlaylistProgress((prevIndex) => prevIndex + 1);
    }
  }

  // select or deselect the active song in a given playlist
  function handleSongSelection(e) {
    const list = e.currentTarget.children;
    const selectedSong = e.target;
    for (let i = 0; i < list.length; i++) {
      if (
        selectedSong === list[i].firstElementChild &&
        selectedSong !== lastSelectedSong.current
      ) {
        lastSelectedSong.current = selectedSong;
        setActiveSongIndex(i);
        setPlaylistProgress(i + 1);
      } else if (
        selectedSong === list[i].children[1] &&
        selectedSong === lastSelectedSong.current
      ) {
        resetIndexes();
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
            playlistProgress={playlistProgress}
            songVolume={songVolume}
            setUploadId={props.setUploadId}
            changeStatusMessage={props.changeStatusMessage}
            handleSongChange={handleSongChange}
            setSongVolume={setSongVolume}
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
        <>
          <button onClick={deletePlaylist}>Delete Playlist</button>
          <div>
            {playlistProgress &&
              `${playlistProgress}/${props.playlistData.songs.length}`}
          </div>
        </>
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
