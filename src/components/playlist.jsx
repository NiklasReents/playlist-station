import DeletionPopup from "./deletionPopup.jsx";
import { useState, useRef, useEffect } from "react";

import Song from "./song.jsx";

export default function Playlist(props) {
  const [activeSongIndex, setActiveSongIndex] = useState(null);
  const [playlistProgress, setPlaylistProgress] = useState(null);
  const [songVolume, setSongVolume] = useState(1);
  const [playButton, setPlayButton] = useState(<>&#9658;</>);
  const [currentFilter, setCurrentFilter] = useState({
    filter: "all",
    input: "",
  });
  const [displayDeletionPopup, setDisplayDeletionPopup] = useState(false);
  const playlistSongs = useRef(null);
  const remainingSongs = useRef([]);
  const lastSelectedSong = useRef(null);
  const dragIndex = useRef(null);
  const filteredList = useRef([]);
  const songAudioRef = useRef(null);
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  useEffect(resetIndexes, [props.playlistData._id]);

  // reset indexes (after changing playlists or closing a song)
  function resetIndexes() {
    lastSelectedSong.current = null;
    setActiveSongIndex(null);
    setPlaylistProgress(null);
    setPlayButton(<>&#9658;</>);
  }

  // delete an index from the array referencing indexes from a given playlist (enables unique shuffle mode)
  function deleteCurrentIndex(index) {
    remainingSongs.current.splice(remainingSongs.current.indexOf(index), 1);
  }

  // manage the transition between songs in a playlist
  function handleSongChange(currentSong) {
    if (
      props.playlistMode === "list" &&
      activeSongIndex < playlistSongs.current.children.length - 1
    ) {
      lastSelectedSong.current =
        currentSong.nextElementSibling.children[1].lastElementChild;
      setActiveSongIndex((prevIndex) => prevIndex + 1);
      setPlaylistProgress((prevIndex) => prevIndex + 1);
    } else if (
      props.playlistMode === "shuffle" &&
      remainingSongs.current.length
    ) {
      const randomIndex = Math.floor(
        Math.random() * remainingSongs.current.length
      );
      lastSelectedSong.current =
        currentSong.parentElement.children[
          remainingSongs.current[randomIndex]
        ].children[1].lastElementChild;
      setActiveSongIndex(remainingSongs.current[randomIndex]);
      setPlaylistProgress(remainingSongs.current[randomIndex] + 1);
      deleteCurrentIndex(remainingSongs.current[randomIndex]);
    }
  }

  // handle playing a playlist from the play/pause button in the playlist info bar
  function handleListPlay() {
    if (playButton.props.children === "►") {
      if (!lastSelectedSong.current) {
        const list = playlistSongs.current.children;
        remainingSongs.current = Array.from(list).map((v, i) => i);
        const randomIndex = Math.floor(
          Math.random() * remainingSongs.current.length
        );
        if (props.playlistMode === "list") {
          lastSelectedSong.current = list[0].children[1].lastElementChild;
          setActiveSongIndex(0);
          setPlaylistProgress(1);
        } else {
          lastSelectedSong.current =
            list[
              remainingSongs.current[randomIndex]
            ].children[1].lastElementChild;
          setActiveSongIndex(remainingSongs.current[randomIndex]);
          setPlaylistProgress(remainingSongs.current[randomIndex] + 1);
          deleteCurrentIndex(remainingSongs.current[randomIndex]);
        }
      } else {
        songAudioRef.current.play();
      }
      setPlayButton(<>&#9208;</>);
    } else if (playButton.props.children === "⏸") {
      songAudioRef.current.pause();
      setPlayButton(<>&#9658;</>);
    }
  }

  // select and play the active song in a given playlist or close/deselect and stop it
  function handleSongSelection(e) {
    const list = playlistSongs.current.children;
    remainingSongs.current = Array.from(list).map((v, i) => i);
    const selectedSong = e.target;
    for (let i = 0; i < list.length; i++) {
      if (
        selectedSong === list[i].children[1].lastElementChild &&
        selectedSong !== lastSelectedSong.current
      ) {
        lastSelectedSong.current = selectedSong;
        if (props.playlistMode === "list") {
          setActiveSongIndex(i);
          setPlaylistProgress(i + 1);
        } else {
          setActiveSongIndex(remainingSongs.current[i]);
          setPlaylistProgress(remainingSongs.current[i] + 1);
          deleteCurrentIndex(remainingSongs.current[i]);
        }
      } else if (
        selectedSong === list[i].children[1].lastElementChild &&
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

  // start dragging a song element to another one in the list
  function handleDragStart(index) {
    dragIndex.current = index;
  }

  // drop the dragged song element on another one for a swap
  async function handleDrop(e, dropIndex) {
    e.preventDefault();
    if (dragIndex.current !== dropIndex) {
      try {
        const formData = new FormData();
        formData.set("id", props.playlistData._id);
        formData.set("dragIndex", dragIndex.current);
        formData.set("dropIndex", dropIndex);
        const updateUrl = `${serverRoot}/playlists/update-playlist`;
        const response = await fetch(updateUrl, {
          method: "put",
          body: formData,
        });
        const result = await response.json();
        if (result.success) {
          props.setActionId(crypto.randomUUID());
          props.changeStatusMessage(result.success);
        } else if (result.error) {
          props.changeStatusMessage(result.error);
        }
      } catch (err) {
        props.changeStatusMessage(err.message);
      }
    }
  }

  // inject the fetched (and filtered) data into song components
  function renderSongList() {
    const playlist = props.playlistData.songs;
    filteredList.current = playlist?.filter((v) => {
      if (currentFilter.filter !== "all") {
        return v[currentFilter.filter]
          .toLowerCase()
          .includes(currentFilter.input.toLowerCase());
      } else {
        return (
          v["song"].toLowerCase().includes(currentFilter.input.toLowerCase()) ||
          v["artist"]
            .toLowerCase()
            .includes(currentFilter.input.toLowerCase()) ||
          v["genre"].toLowerCase().includes(currentFilter.input.toLowerCase())
        );
      }
    });
    if (filteredList.current?.length) {
      return filteredList.current.map((v, i) => {
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
            handleDragStart={handleDragStart}
            handleDrop={handleDrop}
            setPlayButton={setPlayButton}
            setSongVolume={setSongVolume}
            handleSongChange={handleSongChange}
          />
        );
      });
    } else {
      return (
        <li className="no-songs">
          No {!playlist ? "songs" : "matches"} found.
        </li>
      );
    }
  }

  return (
    <>
      <section className="playlist">
        {props.playlistData && (
          <div className="playlist-info">
            <div className="playlist-delete">
              <button onClick={() => setDisplayDeletionPopup(true)}>
                Delete Playlist
              </button>
            </div>
            <div className="playlist-progress">
              {playlistProgress &&
                `${playlistProgress}/${playlistSongs.current.children.length}`}
            </div>
            {filteredList.current?.length ? (
              <div onClick={handleListPlay} className="playlist-start">
                {playButton}
              </div>
            ) : null}
            <div
              className="playlist-filter"
              style={{ visibility: !playlistProgress ? "visible" : "hidden" }}
            >
              <label htmlFor="filter">Filter by...</label>
              <select
                onChange={(e) =>
                  setCurrentFilter({
                    ...currentFilter,
                    filter: e.target.value,
                  })
                }
                id="filter"
                value={currentFilter.filter}
              >
                <option value="all">All</option>
                <option value="song">Songs</option>
                <option value="artist">Artists</option>
                <option value="genre">Genres</option>
              </select>
              <input
                onChange={(e) =>
                  setCurrentFilter({
                    ...currentFilter,
                    input: e.target.value,
                  })
                }
                type="text"
                value={currentFilter.input}
              />
            </div>
          </div>
        )}
        <ul
          onClick={(e) => handleSongSelection(e)}
          ref={playlistSongs}
          className="playlist-songs"
        >
          {renderSongList()}
        </ul>
      </section>
      {displayDeletionPopup && (
        <DeletionPopup
          confirmationMessage={"playlist"}
          deleteObject={deletePlaylist}
          setDisplayDeletionPopup={setDisplayDeletionPopup}
        />
      )}
    </>
  );
}
