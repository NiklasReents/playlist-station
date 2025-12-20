import { useState, useRef, useEffect } from "react";

import Song from "./song.jsx";

export default function Playlist(props) {
  const [activeSongIndex, setActiveSongIndex] = useState(null);
  const [playlistProgress, setPlaylistProgress] = useState(null);
  const [songVolume, setSongVolume] = useState(1);
  const [playButton, setPlayButton] = useState(<>&#9658;</>);
  const playlistSongs = useRef(null);
  const songAudioRef = useRef(null);
  const lastSelectedSong = useRef(null);
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  useEffect(resetIndexes, [props.playlistData._id]);

  // reset indexes (after changing playlists or closing a song)
  function resetIndexes() {
    lastSelectedSong.current = null;
    setActiveSongIndex(null);
    setPlaylistProgress(null);
    setPlayButton(<>&#9658;</>);
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

  // handle playing a playlist from the play/pause button in the playlist info bar
  function handleListPlay() {
    if (playButton.props.children === "►") {
      if (lastSelectedSong.current === null) {
        lastSelectedSong.current =
          playlistSongs.current.children[0].firstElementChild;
        setActiveSongIndex(0);
        setPlaylistProgress(1);
      } else {
        songAudioRef.current.play();
      }
      setPlayButton(<>&#9208;</>);
    } else if (playButton.props.children === "⏸") {
      songAudioRef.current.pause();
      setPlayButton(<>&#9658;</>);
    }
  }

  // select or deselect the active song in a given playlist
  function handleSongSelection(e) {
    const list = playlistSongs.current.children;
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
        props.setActionId(crypto.randomUUID());
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
            setActionId={props.setActionId}
            songAudioRef={songAudioRef}
            changeStatusMessage={props.changeStatusMessage}
            setPlayButton={setPlayButton}
            setSongVolume={setSongVolume}
            handleSongChange={handleSongChange}
          />
        );
      })
    ) : (
      <li className="song">No songs found.</li>
    );
  }

  return (
    <section className="playlist">
      {props.playlistData && (
        <div className="playlist-info">
          <button onClick={deletePlaylist} className="playlist-delete">
            Delete Playlist
          </button>
          <div onClick={handleListPlay} className="playlist-start">
            {playButton}
          </div>
          <div className="playlist-progress">
            {playlistProgress &&
              `${playlistProgress}/${props.playlistData.songs.length}`}
          </div>
        </div>
      )}
      <ul
        onClick={(e) => handleSongSelection(e)}
        ref={playlistSongs}
        className="playlist-songs"
      >
        {renderSongList(props.playlistData.songs)}
      </ul>
    </section>
  );
}
