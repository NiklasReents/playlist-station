import { useCookies } from "react-cookie";

export default function Footer({
  playlistMode,
  statusMessage,
  logoutUser,
  changeStatusMessage,
  togglePlaylistMode,
}) {
  const [cookies] = useCookies(["userToken"]);
  const formData = new FormData();

  async function deleteUser() {
    try {
      formData.set("username", localStorage.getItem("currentUser"));
      const url = "http://localhost:3000/users/delete-user";
      const response = await fetch(url, {
        method: "DELETE",
        body: formData,
      });
      const result = await response.json();
      if (result.message.includes("deleted")) {
        logoutUser();
      }
      changeStatusMessage(result.message);
    } catch (err) {
      changeStatusMessage(err.message);
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
        <div>{statusMessage}</div>
      </div>
      <div>
        <img onClick={togglePlaylistMode} src={playlistMode} alt="list" />
      </div>
    </footer>
  );
}
