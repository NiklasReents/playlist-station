export default function Song(props) {
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  return (
    <li>
      <div className="song-image">
        <img src={serverRoot + props.image} alt="Image" />
      </div>
      <div className="song-audio">
        <audio controls>
          <source src={serverRoot + props.audio} />
        </audio>
      </div>
      <div className="song-info">
        <span>{props.song}</span> <span>{props.artist}</span>{" "}
        <span>{props.genre}</span> <button>Delete Song</button>
      </div>
    </li>
  );
}
