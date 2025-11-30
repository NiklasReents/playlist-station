import Song from "./song.jsx";

export default function Playlist(props) {
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

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
      playlist.map((v) => {
        return (
          <Song
            key={v._id}
            id={v._id}
            image={v.image.replace("public", "")}
            audio={v.audio.replace("public", "")}
            song={v.song}
            artist={v.artist}
            genre={v.genre}
            setUploadId={props.setUploadId}
            changeStatusMessage={props.changeStatusMessage}
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
      <ul style={{ listStyleType: "none" }}>
        {renderSongList(props.playlistData.songs)}
      </ul>
    </>
  );
}
