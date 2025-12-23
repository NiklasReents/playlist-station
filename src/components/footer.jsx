import { useCookies } from "react-cookie";

export default function Footer(props) {
  const [cookies] = useCookies(["userToken"]);
  const serverRoot = import.meta.env.VITE_SERVER_ROOT;

  // delete the logged in user and their playlist data
  async function deleteUser() {
    try {
      const formData = new FormData();
      formData.set("username", localStorage.getItem("currentUser"));
      const deletionUrl = `${serverRoot}/users/delete-user`;
      const response = await fetch(deletionUrl, {
        method: "delete",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        props.logoutUser(result.success);
      } else {
        props.changeStatusMessage(result.error);
      }
    } catch (err) {
      props.changeStatusMessage(err.message);
    }
  }

  return (
    <footer
      className="footer"
      style={{
        background: `radial-gradient(circle, ${props.settingsData.colorPrimary}, ${props.settingsData.colorSecondary})`,
      }}
    >
      <div className="footer-delete-user">
        {cookies.userToken && localStorage.getItem("currentUser") && (
          <button onClick={deleteUser}>Delete User</button>
        )}
      </div>
      <div className="footer-statusbar">
        <div>Create A Playlist!</div>
        <div>{props.statusMessage}</div>
      </div>
      <div className="footer-playlistmode">
        <img
          onClick={props.togglePlaylistMode}
          src={props.playlistMode}
          alt="list"
        />
      </div>
    </footer>
  );
}
