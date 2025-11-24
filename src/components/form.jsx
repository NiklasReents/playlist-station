import { useState } from "react";

export default function Form(props) {
  const [validationResult, setValidationResult] = useState("");
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  // send "formData" object to web server for playlist creation and song addition
  async function sendPlaylistData(e) {
    // NOTE: "props.playlistFormData" -> two-way data binding (apparently) does not work with files! Alternative?
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const formUrl = `${serverRoot}/playlists/create-playlist`;
      const response = await fetch(formUrl, {
        method: "post",
        credentials: "include",
        body: formData,
      });
      const result = await response.json();
      if (result.valErrors) {
        setValidationResult(() => {
          return result.valErrors.map((v) => {
            return <div key={v.msg}>{v.msg}</div>;
          });
        });
      } else {
        setValidationResult("");
        props.setUploadId(crypto.randomUUID());
        props.changeStatusMessage(result.success);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          sendPlaylistData(e);
        }}
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="playlist">Type in a playlist name: </label>
          <input
            onChange={(e) =>
              props.setPlaylistFormData({
                ...props.playlistFormData,
                [e.target.name]: e.target.value,
              })
            }
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
            onChange={(e) => {
              props.setPlaylistFormData({
                ...props.playlistFormData,
                [e.target.name]: e.target.value,
              });
            }}
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
            onClick={() =>
              props.setPlaylistFormData({
                ...props.playlistFormData,
                image: "",
              })
            }
            type="button"
            value="X"
            disabled={props.formDisabled}
          />
        </div>
        <br />
        <div>
          <label htmlFor="audio">Add an audio file: </label>
          <input
            onChange={(e) =>
              props.setPlaylistFormData({
                ...props.playlistFormData,
                [e.target.name]: e.target.value,
              })
            }
            type="file"
            id="audio"
            name="audio"
            value={props.playlistFormData.audio}
            accept="audio/*"
            required
            disabled={props.formDisabled}
          />
          <input
            onClick={() =>
              props.setPlaylistFormData({
                ...props.playlistFormData,
                audio: "",
              })
            }
            type="button"
            value="X"
            disabled={props.formDisabled}
          />
        </div>
        <br />
        <div>
          <label htmlFor="song">Type in a song name: </label>
          <input
            onChange={(e) =>
              props.setPlaylistFormData({
                ...props.playlistFormData,
                [e.target.name]: e.target.value,
              })
            }
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
            onChange={(e) =>
              props.setPlaylistFormData({
                ...props.playlistFormData,
                [e.target.name]: e.target.value,
              })
            }
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
            onChange={(e) =>
              props.setPlaylistFormData({
                ...props.playlistFormData,
                [e.target.name]: e.target.value,
              })
            }
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
