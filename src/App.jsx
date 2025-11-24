import { useCookies } from "react-cookie";
import { useState } from "react";
import Header from "./components/header.jsx";
import Body from "./components/body.jsx";
import Form from "./components/form.jsx";
import Menu from "./components/menu.jsx";
import Playlist from "./components/playlist.jsx";
import Footer from "./components/footer.jsx";
import chevronLeft from "./assets/chevron-left.svg";
import chevronRight from "./assets/chevron-right.svg";
import close from "./assets/close.svg";
import list from "./assets/list.svg";
import menu from "./assets/menu.svg";
import shuffle from "./assets/shuffle.svg";
import "./App.css";

export default function App() {
  // variable groups (grouped according to where variables are (mainly) used)
  // APP
  const [cookies, setCookie, removeCookie] = useCookies(["userToken"]); // -> create a cookie in order to store a web token that will be sent with various requests to protected routes (e.g. granting access to the user's playlists etc.)
  const [screenSize, getScreenSize] = useState(window.innerWidth); // -> pass variable to "setBody" function (information) and setter to "window.onresize" function
  // HEADER
  const [viewButton, setViewButton] = useState(chevronRight); // -> pass variable to HEADER (display) and "toggleView"/"setBody" functions (information) and setter to "toggleView", "changeMenuContent", "loginUser" and "logoutUser" functions
  const [popupImage, setPopupImage] = useState(menu); // -> pass variable to HEADER (display) and "togglePopupMenu" function (information) and setter to "togglePopupMenu", "loginUser" and "logoutUser" functions
  const [popupList, setPopupList] = useState(<></>); // -> pass variable to HEADER (display) and setter to "togglePopupMenu", "loginUser" and "logoutUser" functions
  const [username, setUsername] = useState(
    cookies.userToken && localStorage.getItem("currentUser")
      ? localStorage.getItem("currentUser")
      : "User"
  ); // -> pass variable to HEADER (display) and "changeMenuContent" function (information) and setter to "loginUser" and "logoutUser" functions
  const [loginButton, setLoginButton] = useState(
    cookies.userToken && localStorage.getItem("currentUser")
      ? "Logout"
      : "Login"
  ); // -> pass variable to "popupJSX" (HEADER) component (display) and setter to "loginUser" and "logoutUser" functions
  const [uploadId, setUploadId] = useState(0); // -> pass variable to HEADER (information) and setter function to FORM
  // BODY (-> FORM, MENU, PLAYLIST)
  const [formDisabled, setFormDisabled] = useState(
    cookies.userToken && localStorage.getItem("currentUser") ? false : true
  ); // -> pass variable to FORM (information) and setter to "loginUser" and "logoutUser" functions
  // set form data for playlist creation
  const [playlistFormData, setPlaylistFormData] = useState({
    playlist: "",
    image: "",
    audio: "",
    song: "",
    artist: "",
    genre: "",
  }); // -> pass variable to FORM (information/display) and "logoutUser" function (information/display cleanup) and setter to the same component and function, respectively
  const [menuContent, setMenuContent] = useState(""); // -> pass variable to MENU (information) and setter to "changeMenuContent" function
  // set user registration data (may be refactored later)
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  }); // -> pass variable to MENU (information/display) and setter to the same component
  // set user login data (may be refactored later)
  const [loginData, setLoginData] = useState({ username: "", password: "" }); // -> pass variable to MENU (information/display) and setter to the same component
  // change global app settings (may be refactored later)
  const [settingsData, setSettingsData] = useState({
    colorPrimary: "",
    colorSecondary: "",
    appLanguage: "",
  }); // -> pass variable to MENU (information/display) and setter to the same component
  const [displayPWButton, setDisplayPWButton] = useState(false); // -> pass variable to MENU (information) and setter to the same component
  const [playlistData, setPlaylistData] = useState([]); // -> pass variable to PLAYLIST (information) and setter to HEADER
  const [playlistMode, setPlaylistMode] = useState(list); // -> pass variable to PLAYLIST (information), FOOTER (display) and "togglePlaylistMode" function (information) and setter to the same function
  // FOOTER
  const [statusMessage, setStatusMessage] = useState([]); // -> pass variable to FOOTER (display) and to "changeStatusMessage" function (information) and setter to the same function

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
  // NOTE: try to reduce/condense number of props passed to MENU (and some other components)
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
  const playlistJSX = (
    <Playlist playlistData={playlistData} playlistMode={playlistMode} />
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
  call "changeStatusMessage" according to toggled playlist mode
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
  display status messages in the FOOTER that get triggered by certain user actions (pressing the "Send Data" button of the song FORM, changing the playlist mode, deleting songs etc.)
  */
  function changeStatusMessage(messageText) {
    const messageKey = crypto.randomUUID();
    const message = <p key={messageKey}>{messageText}</p>;
    setStatusMessage([message, ...statusMessage]);
    setTimeout(() => {
      setStatusMessage((prevMessages) =>
        prevMessages.filter((msg) => msg.key !== messageKey)
      );
      // TODO: fix bug where in some cases some messages stay in the UI
    }, 3000);
  }

  // set the content of the BODY component depending on viewport width and certain user interactions
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
