import Menu from "./menu.jsx";
import Form from "./form.jsx";
import Playlist from "./playlist.jsx";
import chevronLeft from "../assets/chevron-left.svg";
import chevronRight from "../assets/chevron-right.svg";

export default function Body({
  viewButton,
  menuContent,
  playlistMode,
  playlistData,
  setStatusMessage,
  setUsername,
}) {
  // set the content of the APP body depending on user interactions (DRAFT for mobile version)
  function setBody() {
    if (viewButton === chevronRight) {
      return <Form setStatusMessage={setStatusMessage} />;
    } else if (viewButton === chevronLeft) {
      return (
        <Playlist
          playlistMode={playlistMode}
          playlistData={playlistData}
          setStatusMessage={setStatusMessage}
        />
      );
    } else {
      return (
        <Menu
          menuContent={menuContent}
          setStatusMessage={setStatusMessage}
          setUsername={setUsername}
        />
      );
    }
  }

  return <main>{setBody()}</main>;
}
