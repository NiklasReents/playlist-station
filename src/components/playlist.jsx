import Song from "./song.jsx";

export default function Playlist(props) {
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
    <ul style={{ listStyleType: "none" }}>
      {renderSongList(props.playlistData)}
    </ul>
  );
}
