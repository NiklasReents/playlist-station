import Menu from "./menu.jsx";
import Form from "./form.jsx";
import Playlist from "./playlist.jsx";
import chevronLeft from "../assets/chevron-left.svg";
import chevronRight from "../assets/chevron-right.svg";

export default function Body({
  screenSize,
  viewButton,
  menuContent,
  playlistMode,
  playlistData,
  setStatusMessage,
  setUsername,
}) {
  const form = <Form setStatusMessage={setStatusMessage} />;
  const playlist = (
    <Playlist
      playlistMode={playlistMode}
      playlistData={playlistData}
      setStatusMessage={setStatusMessage}
    />
  );
  const menu = (
    <Menu
      key={menuContent}
      menuContent={menuContent}
      setStatusMessage={setStatusMessage}
      setUsername={setUsername}
    />
  );

  // set the content of the body component depending on viewport width and user interactions (DRAFT)
  function setBody() {
    // mobile version
    if (screenSize <= 1000) {
      if (viewButton === chevronRight) {
        return form;
      } else if (viewButton === chevronLeft) {
        return playlist;
      } else {
        return menu;
      }
    }
    // desktop version
    else {
      if (viewButton === chevronRight) {
        return (
          <>
            {form}
            {playlist}
          </>
        );
      } else if (viewButton === chevronLeft) {
        return (
          <>
            {playlist}
            {form}
          </>
        );
      } else {
        return menu;
      }
    }
  }

  return <main>{setBody()}</main>;
}
