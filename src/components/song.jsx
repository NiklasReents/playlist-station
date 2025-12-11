import { useRef, useEffect } from "react";

export default function Song(props) {
  const songRef = useRef(null);
  const songAudioRef = useRef(null);
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  useEffect(handleVolumeChange, [props.isActive, props.songVolume]);

  // keep the same song volume level across song and playlist changes
  function handleVolumeChange() {
    if (songAudioRef.current) {
      if (typeof props.songVolume === "number") {
        songAudioRef.current.volume = props.songVolume;
      } else {
        songAudioRef.current.muted = true;
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
        props.setUploadId(crypto.randomUUID());
        props.changeStatusMessage(result.success);
      } else {
        props.changeStatusMessage(result.error);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  return (
    <li ref={songRef} className="song">
      {props.isActive && (
        <div className="song-data-container">
          <div className="song-image">
            <img src={serverRoot + props.image} alt="Image" />
          </div>
          <div className="song-audio">
            <audio
              onLoadedData={(e) => e.currentTarget.play()}
              onEnded={() => props.handleSongChange(songRef.current)}
              onVolumeChange={(e) =>
                props.setSongVolume(
                  !e.target.muted ? e.target.volume : e.target.muted
                )
              }
              ref={songAudioRef}
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
      {!props.playlistProgress && (
        <button onClick={deleteSong}>Delete Song</button>
      )}
    </li>
  );
}
