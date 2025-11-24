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
        method: "DELETE",
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
    <footer>
      <div>
        {cookies.userToken && localStorage.getItem("currentUser") ? (
          <button onClick={deleteUser}>Delete User</button>
        ) : null}
      </div>
      <div>
        <div>Create A Playlist!</div>
        <div>{props.statusMessage}</div>
      </div>
      <div>
        <img
          onClick={props.togglePlaylistMode}
          src={props.playlistMode}
          alt="list"
        />
      </div>
    </footer>
  );
}
