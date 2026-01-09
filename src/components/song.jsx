import DeletionPopup from "./deletionPopup.jsx";
import { useState, useRef, useEffect } from "react";

export default function Song(props) {
  const [displayDeletionPopup, setDisplayDeletionPopup] = useState(false);
  const songRef = useRef(null);
  const songImgRef = useRef(null);
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  useEffect(handleVolumeChange, [props.isActive, props.songVolume]);

  // keep the same song volume level across song and playlist changes
  function handleVolumeChange() {
    if (props.songAudioRef.current) {
      if (typeof props.songVolume === "number") {
        props.songAudioRef.current.volume = props.songVolume;
      } else {
        props.songAudioRef.current.muted = true;
      }
    }
  }

  // delete a single song from the currently selected playlist
  async function deleteSong() {
    try {
      const formData = new FormData();
      formData.set("id", props.id);
      const deletionUrl = `${serverRoot}/playlists/delete-song`;
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

  return (
    <>
      <li
        onDragStart={
          !props.isActive ? () => props.handleDragStart(props.id) : null
        }
        onDragOver={!props.isActive ? (e) => e.preventDefault() : null}
        onDrop={!props.isActive ? (e) => props.handleDrop(e, props.id) : null}
        ref={songRef}
        draggable={!props.isActive ? true : false}
        className="song"
      >
        <div
          className="song-delete"
          style={{ visibility: !props.isActive ? "visible" : "hidden" }}
        >
          <button onClick={() => setDisplayDeletionPopup(true)}>
            Delete Song
          </button>
        </div>
        <div className="song-data-container">
          {props.isActive && (
            <div className="song-controls">
              <div className="song-image">
                <img
                  ref={songImgRef}
                  inert
                  src={serverRoot + props.image}
                  alt="Image"
                />
              </div>
              <div className="song-audio">
                <audio
                  onLoadedData={(e) => {
                    e.currentTarget.play();
                    songImgRef.current.style.animation =
                      "imageRotation 30s linear 0s infinite alternate";
                  }}
                  onPlay={() => {
                    props.setPlayButton(<>&#9208;</>);
                    songImgRef.current.style.animation =
                      "imageRotation 30s linear 0s infinite alternate";
                  }}
                  onPause={() => {
                    props.setPlayButton(<>&#9658;</>);
                    songImgRef.current.style.animation = "";
                  }}
                  onVolumeChange={(e) =>
                    props.setSongVolume(
                      !e.target.muted ? e.target.volume : e.target.muted
                    )
                  }
                  onEnded={() => props.handleSongChange(songRef.current)}
                  ref={props.songAudioRef}
                  controls
                >
                  <source src={serverRoot + props.audio} />
                </audio>
              </div>
            </div>
          )}
          <div className="song-info">
            {props.song} {props.artist} {props.genre}
          </div>
        </div>
        <div
          className="song-dnd"
          style={{ visibility: !props.isActive ? "visible" : "hidden" }}
        >
          <img inert src="../src/assets/drag-and-drop.svg" />
        </div>
      </li>
      {displayDeletionPopup && (
        <DeletionPopup
          confirmationMessage={"song"}
          deleteObject={deleteSong}
          setDisplayDeletionPopup={setDisplayDeletionPopup}
        />
      )}
    </>
  );
}
