import { useState } from "react";
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
  const [cookies, setCookie, removeCookie] = useCookies(["userToken"]); // -> create a cookie in order to store a web token that will be sent with a request to a protected route granting access to the user's playlists
  const [screenSize, getScreenSize] = useState(window.innerWidth); // -> track browser window width in order to responsively adjust the BODY layout
  const [viewButton, setViewButton] = useState(chevronRight); // -> pass variable and "toggleView" function to HEADER (for image display and setting purposes) and variable to BODY as well (for information purpose) via props
  const [popupImage, setPopupImage] = useState(menu); // -> pass variable and "togglePopupMenu" function to HEADER (for image display and setting purposes) via props
  const [popupList, setPopupList] = useState(<></>); // -> pass variable to HEADER and setter function to "togglePopupMenu" (in order to show or hide the popup menu list) via props
  const [menuContent, setMenuContent] = useState(""); // -> pass this setter function and "setViewButton" to "changeMenuContent" function (used by "togglePopupMenu" for data retrieval/setting purposes) and this variable to BODY -> MENU (for information purpose) via props
  const [formDisabled, setFormDisabled] = useState(
    cookies.userToken && localStorage.getItem("currentUser") ? false : true
  ); // -> pass variable to FORM and setter to "loginUser" and "logoutUser" functions
  const [playlistMode, setPlaylistMode] = useState(list); // -> pass variable and toggle function to FOOTER (for display and setting purposes) and variable to BODY -> PLAYLIST (for information purpose) via props
  const [statusMessage, setStatusMessage] = useState([]); // -> pass setter function to "changeStatusMessage" which is passed to components where certain events happen (e.g. FORM, PLAYLIST) and variable to FOOTER (for information/display purpose) via props
  // set username: get username from server token after logging in (through the "loginUser" function), display current username in the top section of the HEADER
  const [username, setUsername] = useState(
    cookies.userToken && localStorage.getItem("currentUser")
      ? localStorage.getItem("currentUser")
      : "User"
  ); // -> pass setter function to "loginUser" and "logoutUser" functions (for data retrieval and setting purposes) and variable to HEADER (for display purpose) via props; save username in localstorage
  const [loginButton, setLoginButton] = useState(
    cookies.userToken && localStorage.getItem("currentUser")
      ? "Logout"
      : "Login"
  ); // -> pass setter function to to "loginUser" and "logoutUser" functions and the variable to the "popupJSX" component (to be rendered in HEADER)
  const [displayPWButton, setDisplayPWButton] = useState(false); // -> pass variable and setter to MENU in order to display or hide a "Forgot Password" button in the login form
  // set playlist data: get playlist data from dropdown menu in the HEADER by selecting one of the playlist names, which renders the respective playlist data into SONG components within the PLAYLIST container
  const [playlistData, setPlaylistData] = useState([]); // -> pass setter function to HEADER (for data retrieval purpose (from dropdown menu)) and variable to BODY -> PLAYLIST via props
  const [uploadId, setUploadId] = useState(0); // -> pass setter function to FORM and variable to HEADER via props
  // set form data for playlist creation
  const [playlistFormData, setPlaylistFormData] = useState({
    playlist: "",
    image: "",
    audio: "",
    song: "",
    artist: "",
    genre: "",
  }); // pass variable and setter to FORM component via props
  // set user registration data (may be refactored later)
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  }); // -> pass variable and setter to MENU component via props
  // set user login data (may be refactored later)
  const [loginData, setLoginData] = useState({ username: "", password: "" }); // -> pass variable and setter to MENU component via props
  // change global app settings (may be refactored later)
  const [settingsData, setSettingsData] = useState({
    colorPrimary: "",
    colorSecondary: "",
    appLanguage: "",
  }); // -> pass variable and setter to MENU component via props

  // create JSX container for use in the "togglePopupMenu" function
  const popupJSX = (
    <div onClick={(e) => changeMenuContent(e)}>
      <button>Register</button>
      <button>{loginButton}</button>
      <button>Settings</button>
    </div>
  );
  // create JSX containers for use in the "setBody" function
  const formJSX = (
    <Form
      formDisabled={formDisabled}
      playlistFormData={playlistFormData}
      setPlaylistFormData={setPlaylistFormData}
      setUploadId={setUploadId}
      changeStatusMessage={changeStatusMessage}
    />
  );
  const playlistJSX = (
    <Playlist
      playlistMode={playlistMode}
      playlistData={playlistData}
      changeStatusMessage={changeStatusMessage}
    />
  );
  // NOTE: try to reduce/condense number of props passed to MENU
  const menuJSX = (
    <Menu
      key={menuContent}
      menuContent={menuContent}
      registerData={registerData}
      loginData={loginData}
      settingsData={settingsData}
      displayPWButton={displayPWButton}
      changeStatusMessage={changeStatusMessage}
      loginUser={loginUser}
      setRegisterData={setRegisterData}
      setLoginData={setLoginData}
      setSettingsData={setSettingsData}
      setDisplayPWButton={setDisplayPWButton}
    />
  );

  // get viewport width for responsive adjustment of BODY components
  window.onresize = function () {
    getScreenSize(this.innerWidth);
  };

  /* 
  flip chevron image from right to left or the other way round with each click, which changes the content of the App BODY (via "viewButton" variable passed to HEADER as props)
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
  toggle between a hidden and visible popup menu with a handler function that changes the content of the MENU component 
  (via "menuContent" variable passed to MENU as props) depending on which button was clicked
  */
  function togglePopupMenu() {
    // NOTE: potentially merge image and list variables into one variable
    if (popupImage === menu) {
      setPopupImage(close);
      setPopupList(popupJSX);
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
    if (e.target.textContent === "Logout") {
      logoutUser(`${username} successfully logged out!`);
    } else {
      setMenuContent(e.target.textContent);
      setViewButton(close);
    }
  }

  // log a user in (including token and user data storage in a cookie and the local storage)
  function loginUser(result) {
    const currentUser = result.loginData[1].split(" ")[0];
    setViewButton(chevronRight);
    setPopupImage(menu);
    setPopupList(<></>);
    setUsername(currentUser);
    setLoginButton("Logout");
    setFormDisabled(false);
    setCookie("userToken", result.loginData[0], {
      expires: new Date(new Date().setDate(new Date().getDate() + 1)),
    });
    localStorage.setItem("currentUser", currentUser);
    changeStatusMessage(result.loginData[1]);
  }

  // log the current user out
  function logoutUser(message) {
    setViewButton(chevronRight);
    setPopupImage(menu);
    setPopupList(<></>);
    setUsername("User");
    setLoginButton("Login");
    setFormDisabled(true);
    setPlaylistFormData(() => {
      for (const key in playlistFormData) {
        playlistFormData[key] = "";
      }
      return playlistFormData;
    });
    removeCookie("userToken");
    localStorage.removeItem("currentUser");
    changeStatusMessage(message);
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
  display status messages in the FOOTER that get triggered by certain user actions (pressing the "Send Data" button of the song FORM, changing the playlist mode, deleting songs etc.); 
  */
  function changeStatusMessage(messageText) {
    const messageKey = crypto.randomUUID();
    const message = <p key={messageKey}>{messageText}</p>;
    setStatusMessage([message, ...statusMessage]);
    setTimeout(() => {
      setStatusMessage((prevMessages) =>
        prevMessages.filter((msg) => msg.key !== messageKey)
      );
    }, 3000);
  }

  // set the content of the body component depending on viewport width and user interactions
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
        uploadId={uploadId}
        changeStatusMessage={changeStatusMessage}
        setPlaylistData={setPlaylistData}
        toggleView={toggleView}
        togglePopupMenu={togglePopupMenu}
      />
      <Body>{setBody()}</Body>
      <Footer
        playlistMode={playlistMode}
        statusMessage={statusMessage}
        logoutUser={logoutUser}
        changeStatusMessage={changeStatusMessage}
        togglePlaylistMode={togglePlaylistMode}
      />
    </>
  );
}
