import { useState, useRef } from "react";
import { useCookies } from "react-cookie";
import Header from "./components/header.jsx";
import Body from "./components/body.jsx";
import Footer from "./components/footer.jsx";
import Form from "./components/form.jsx";
import Playlist from "./components/playlist.jsx";
import Menu from "./components/menu.jsx";
import chevronLeft from "./assets/chevron-left.svg";
import chevronRight from "./assets/chevron-right.svg";
import close from "./assets/close.svg";
import list from "./assets/list.svg";
import menu from "./assets/menu.svg";
import shuffle from "./assets/shuffle.svg";
import "./App.css";

export default function App() {
  // GLOBAL VARIABLES (DRAFT: may be subject to change!)
  const [cookies, setCookie, removeCookie] = useCookies(["userToken"]); // -> create a cookie in order to store a web token that will be sent with a request to a protected route granting access to the user's playlists
  const [screenSize, getScreenSize] = useState(window.innerWidth); // -> track browser window width in order to responsively adjust the BODY layout
  const [viewButton, setViewButton] = useState(chevronRight); // -> pass variable and "toggleView" function to HEADER (for image display and setting purposes) and variable to BODY as well (for information purpose) via props
  const [popupImage, setPopupImage] = useState(menu); // -> pass variable and "togglePopupMenu" function to HEADER (for image display and setting purposes) via props
  const [popupList, setPopupList] = useState(<></>); // -> pass variable to HEADER and setter function to "togglePopupMenu" (in order to show or hide the popup menu list) via props
  const [menuContent, setMenuContent] = useState(""); // -> pass this setter function and "setViewButton" to "changeMenuContent" function (used by "togglePopupMenu" for data retrieval/setting purposes) and this variable to BODY -> MENU (for information purpose) via props
  const [playlistMode, setPlaylistMode] = useState(list); // -> pass variable and toggle function to FOOTER (for display and setting purposes) and variable to BODY -> PLAYLIST (for information purpose) via props
  // set user status: determine whether a user is currently not connected to the server, connected but not logged in, connected and logged in (some actions and status messages depend on the connection and login status)
  const [userStatus, setUserStatus] = useState(""); // -> call "useEffect" in the App function with a request to the server in order to determine whether both are connected to each other and save the result in the variable (via setter function); pass setter to MENU as well (to determine login status) via props
  const [statusMessage, setStatusMessage] = useState(""); // -> pass setter function to various components where certain events happen (e.g. FORM, PLAYLIST) and variable to FOOTER (for information/display purpose) via props ("useReducer" hook as alternative?)
  // set username: get username from server token after logging in (through the MENU login component), display current username in the top section of the HEADER
  const [username, setUsername] = useState(
    localStorage.getItem("currentUser") && cookies.userToken
      ? localStorage.getItem("currentUser")
      : "User"
  ); // -> pass setter function to MENU (for data retrieval purpose (from login)) and variable to HEADER (for display purpose) via props; save username in localstorage
  const [loginButton, setLoginButton] = useState(
    localStorage.getItem("currentUser") && cookies.userToken
      ? "Logout"
      : "Login"
  ); // pass setter function to MENU and the "changeMenuContent" function for login and logout purposes
  // set playlist data: get playlist data from dropdown menu in the HEADER by selecting one of the playlist names, which renders the respective playlist data into SONG components within the PLAYLIST container
  const [playlistData, setPlaylistData] = useState([]); // -> pass setter function to HEADER (for data retrieval purpose (from dropdown menu)) and variable to BODY -> PLAYLIST via props
  // register user (may be refactored later)
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  // login user (may be refactored later)
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  // change global app settings
  const [settingsData, setSettingsData] = useState({
    colorPrimary: "",
    colorSecondary: "",
    appLanguage: "",
  });
  const statusMessageIdRef = useRef();
  // create JSX containers for use in the "setBody" function
  const formJSX = <Form setStatusMessage={setStatusMessage} />;
  const playlistJSX = (
    <Playlist
      playlistMode={playlistMode}
      playlistData={playlistData}
      setStatusMessage={setStatusMessage}
    />
  );
  // try to reduce/condense number of props passed to MENU
  const menuJSX = (
    <Menu
      key={menuContent}
      menuContent={menuContent}
      registerData={registerData}
      loginData={loginData}
      settingsData={settingsData}
      setRegisterData={setRegisterData}
      setLoginData={setLoginData}
      setSettingsData={setSettingsData}
      setUsername={setUsername}
      setLoginButton={setLoginButton}
    />
  );

  // get viewport width for responsive adjustment of BODY components
  window.onresize = function () {
    getScreenSize(this.innerWidth);
  };

  /* 
  flip chevron image from right to left or the other way round with each click, which changes the content of the App BODY (via "viewButton" variable passed to it as props)
  (mobile: FORM -> PLAYLIST, PLAYLIST -> FORM; desktop: switch out FORM from left to right, PLAYLIST from right to left and inversely) 
  */
  function toggleView() {
    if (viewButton === chevronLeft || viewButton === close) {
      setViewButton(chevronRight);
    } else {
      setViewButton(chevronLeft);
    }
  }

  /* 
  toggle between a hidden and visible popup menu with a handler function that changes the content of the MENU component (via "menuContent" variable passed to MENU as props) depending on which button was clicked
  */
  function togglePopupMenu() {
    // NOTE: potentially merge image and list variables into one variable
    if (popupImage === menu) {
      setPopupImage(close);
      setPopupList(
        <div onClick={(e) => changeMenuContent(e)}>
          <button>Register</button>
          <button>{loginButton}</button>
          <button>Settings</button>
        </div>
      );
    } else {
      // NOTE: close popup menu as well by clicking outside of it
      setPopupImage(menu);
      setPopupList(<></>);
    }
  }

  /* 
  set the MENU form content rendered within the BODY depending on which button of the HEADER's popup menu (register, login, settings) was clicked
  change the chevron image to an "X" (close) with which the MENU can be closed
  */
  function changeMenuContent(e) {
    if (
      localStorage.getItem("currentUser") &&
      cookies.userToken &&
      e.target.textContent === "Logout"
    ) {
      // user logout
      setLoginButton("Login");
      localStorage.removeItem("currentUser");
      removeCookie("userToken");
      location.href = "/";
    } else {
      setMenuContent(e.target.textContent);
      setViewButton(close);
    }
  }

  /* 
  toggle between list and shuffle modes with each click which affects the way playlist songs are played (via "playlistMode" variable passed to PLAYLIST as props)
  set "statusMessage" according to toggled playlist mode
  */
  function togglePlaylistMode() {
    if (playlistMode === list) {
      setPlaylistMode(shuffle);
      changeStatusMessage("Playlist mode set to shuffle.");
    } else {
      setPlaylistMode(list);
      changeStatusMessage("Playlist mode set to list.");
    }
  }

  /*
  display status message in the FOOTER that gets triggered by certain user actions (pressing the "Send Data" button of the song FORM, changing the playlist mode, deleting songs etc.); 
  connection-related messages depend on "userStatus" variable (disconnected, not logged in, logged in) (NOTE: may be subject to change)
  */
  function changeStatusMessage(status) {
    clearTimeout(statusMessageIdRef.current);
    setStatusMessage(status);
    statusMessageIdRef.current = setTimeout(() => {
      setStatusMessage("");
    }, 3000);
  }

  // set the content of the body component depending on viewport width and user interactions (DRAFT)
  function setBody() {
    if (viewButton === chevronRight) {
      return screenSize <= 1000 ? (
        formJSX
      ) : (
        <>
          {formJSX}
          {playlistJSX}
        </>
      );
    } else if (viewButton === chevronLeft) {
      return screenSize <= 1000 ? (
        playlistJSX
      ) : (
        <>
          {playlistJSX}
          {formJSX}
        </>
      );
    } else {
      return menuJSX;
    }
  }

  return (
    <>
      <Header
        viewButton={viewButton}
        popupImage={popupImage}
        popupList={popupList}
        username={username}
        toggleView={toggleView}
        togglePopupMenu={togglePopupMenu}
      />
      <Body>{setBody()}</Body>
      <Footer
        playlistMode={playlistMode}
        statusMessage={statusMessage}
        togglePlaylistMode={togglePlaylistMode}
      />
    </>
  );
}
