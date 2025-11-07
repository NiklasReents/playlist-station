import { useRef, useState, useEffect } from "react";

export default function Form(props) {
  const [validationResult, setValidationResult] = useState("");
  const formRef = useRef();
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;
  const url = `${serverRoot}/playlists/create-playlist`;
  let formData = new FormData(formRef.current);

  useEffect(() => {
    formData = new FormData(formRef.current);
  }, []);

  // send "formData" object to web server for playlist creation and song addition
  async function sendPlaylistData(e) {
    // NOTE: create formData here?
    // NOTE: "props.playlistFormData" -> two-way data binding (apparently) does not work with files! Alternative?
    try {
      e.preventDefault();
      const response = await fetch(url, {
        method: "post",
        credentials: "include",
        body: formData,
      });
      const result = await response.json();
      if (result.valErrors) {
        setValidationResult(() => {
          return result.valErrors.map((v, i) => {
            return <div key={i}>{v.msg}</div>;
          });
        });
      } else {
        props.setUploadId(crypto.randomUUID());
        props.changeStatusMessage(result.success);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  // update global playlist data and "formData" content
  function updateFormData(name, value) {
    props.setPlaylistFormData({ ...props.playlistFormData, [name]: value });
    formData.append(name, value);
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          sendPlaylistData(e);
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
            value={props.playlistFormData.playlist}
            required
            disabled={props.formDisabled}
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
            value={props.playlistFormData.image}
            accept="image/*"
            required
            disabled={props.formDisabled}
          />
          <input type="button" value="&#x21c4;" disabled={props.formDisabled} />
          <input
            onClick={() => {
              updateFormData("image", "");
            }}
            type="button"
            value="X"
            disabled={props.formDisabled}
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
            value={props.playlistFormData.audio}
            accept="audio/*"
            required
            disabled={props.formDisabled}
          />
          <input
            onClick={() => {
              updateFormData("audio", "");
            }}
            type="button"
            value="X"
            disabled={props.formDisabled}
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
            value={props.playlistFormData.song}
            required
            disabled={props.formDisabled}
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
            value={props.playlistFormData.artist}
            required
            disabled={props.formDisabled}
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
            value={props.playlistFormData.genre}
            required
            disabled={props.formDisabled}
          />
        </div>
        <br />
        <input type="submit" value="Send Data" disabled={props.formDisabled} />
        <br />
      </form>
      {/*
        display validation error messages
      */}
      {validationResult}
    </>
  );
}
