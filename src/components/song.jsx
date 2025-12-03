export default function Song(props) {
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

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
    <li>
      {props.isActive ? (
        <div className="song-data-container">
          <div className="song-image">
            <img src={serverRoot + props.image} alt="Image" />
          </div>
          <div className="song-audio">
            <audio
              onLoadedData={(e) => e.currentTarget.play()}
              onEnded={props.handleSongChange}
              controls
            >
              <source src={serverRoot + props.audio} />
            </audio>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="song-info">
        <span>{props.song}</span> <span>{props.artist}</span>{" "}
        <span>{props.genre}</span>{" "}
      </div>
      <button onClick={deleteSong}>Delete Song</button>
    </li>
  );
}
