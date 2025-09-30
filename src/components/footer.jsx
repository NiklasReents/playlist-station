export default function Footer({
  playlistMode,
  statusMessage,
  togglePlaylistMode,
}) {
  return (
    <footer>
      <div></div>
      <div>
        <div>Create A Playlist!</div>
        <div>{statusMessage}</div>
      </div>
      <div>
        <img onClick={togglePlaylistMode} src={playlistMode} alt="list" />
      </div>
    </footer>
  );
}
