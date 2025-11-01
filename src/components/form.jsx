import { useRef, useState, useEffect } from "react";

export default function Form({
  formDisabled,
  playlistFormData,
  setPlaylistFormData,
  setUploadMessage,
  changeStatusMessage,
}) {
  const [fetchResult, setFetchResult] = useState("");
  const formRef = useRef();
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;
  let formData = new FormData(formRef.current);

  useEffect(() => {
    formData = new FormData(formRef.current);
  }, []);

  async function sendUserData(e) {
    // NOTE: create formData here?
    // NOTE: "playlistFormData" -> two-way data binding (apparently) does not work with files! Alternative?
    e.preventDefault();
    const url = `${serverRoot}/playlists/create-playlist`;
    try {
      const response = await fetch(url, {
        method: "post",
        credentials: "include",
        body: formData,
      });
      const result = await response.json();
      if (result.valErrors) {
        setFetchResult(() => {
          return result.valErrors.map((v, i) => {
            return <div key={i}>{v.msg}</div>;
          });
        });
      } else {
        setUploadMessage(result.message);
        changeStatusMessage(result.message);
      }
    } catch (err) {
      changeStatusMessage(err.message);
    }
  }

  function updateFormData(name, value) {
    setPlaylistFormData({ ...playlistFormData, [name]: value });
    formData.append(name, value);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          sendUserData(e);
        }}
        ref={formRef}
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="playlist">Type in a playlist name: </label>
          <input
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
            type="text"
            id="playlist"
            name="playlist"
            placeholder="Playlist"
            value={playlistFormData.playlist}
            required
            disabled={formDisabled}
          />
        </div>
        <br />
        <div>
          <label htmlFor="image">Add an image file: </label>
          <input
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
            type="file"
            id="image"
            name="image"
            value={playlistFormData.image}
            accept="image/*"
            required
            disabled={formDisabled}
          />
          <input type="button" value="&#x21c4;" disabled={formDisabled} />
          <input
            onClick={() => {
              updateFormData("image", "");
            }}
            type="button"
            value="X"
            disabled={formDisabled}
          />
        </div>
        <br />
        <div>
          <label htmlFor="audio">Add an audio file: </label>
          <input
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
            type="file"
            id="audio"
            name="audio"
            value={playlistFormData.audio}
            accept="audio/*"
            required
            disabled={formDisabled}
          />
          <input
            onClick={() => {
              updateFormData("audio", "");
            }}
            type="button"
            value="X"
            disabled={formDisabled}
          />
        </div>
        <br />
        <div>
          <label htmlFor="song">Type in a song name: </label>
          <input
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
            type="text"
            id="song"
            name="song"
            placeholder="Song"
            value={playlistFormData.song}
            required
            disabled={formDisabled}
          />
        </div>
        <br />
        <div>
          <label htmlFor="artist">Type in an artist name: </label>
          <input
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
            type="text"
            id="artist"
            name="artist"
            placeholder="Artist"
            value={playlistFormData.artist}
            required
            disabled={formDisabled}
          />
        </div>
        <br />
        <div>
          <label htmlFor="genre">Type in a genre name: </label>
          <input
            onChange={(e) => updateFormData(e.target.name, e.target.value)}
            type="text"
            id="genre"
            name="genre"
            placeholder="Genre"
            value={playlistFormData.genre}
            required
            disabled={formDisabled}
          />
        </div>
        <br />
        <input type="submit" value="Send Data" disabled={formDisabled} />
        <br />
      </form>
      {fetchResult}
    </>
  );
}
