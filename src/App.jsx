import { useState } from "react";
import Header from "./components/header.jsx";
import Body from "./components/body.jsx";
import Footer from "./components/footer.jsx";
import chevronLeft from "./assets/chevron-left.svg";
import chevronRight from "./assets/chevron-right.svg";
import close from "./assets/close.svg";
import list from "./assets/list.svg";
import menu from "./assets/menu.svg";
import shuffle from "./assets/shuffle.svg";
import "./App.css";

export default function App() {
  // GLOBAL VARIABLES (DRAFT: may be subject to change!)
  // toggle image: flip chevron image from right to left or the other way round with each click, which changes the content of the App BODY (mobile: FORM -> PLAYLIST, PLAYLIST -> FORM; desktop: switch out FORM from left to right, PLAYLIST from right to left and inversely)
  const [swapView, setSwapView] = useState(chevronRight); // -> pass variable and toggle function to HEADER (for display and setting purposes) and variable to BODY (for information purpose) via props
  // toggle image: toggle between menu button and close button with each click, which opens or closes a small popup menu with three options: register, login, settings; pressing any of those buttons renders the MENU component into the BODY (in place of the FORM)
  const [expandMenu, setExpandMenu] = useState(menu); // -> pass variable and toggle function to HEADER (for display and setting purposes) via props
  // set menu form content: render the MENU form within the BODY and set its content depending on which button of the HEADER's popup menu (register, login, settings) was clicked; change the chevron image to an "X" (close) with which the MENU can be closed
  const [menuContent, setMenuContent] = useState(""); // -> pass this setter function and "setSwapView" to HEADER (for data retrieval/setting purposes) and this variable to BODY -> MENU (for information purpose) via props
  // toggle image: toggle between list and shuffle playlist modes with each click
  const [playlistMode, setPlaylistMode] = useState(list); // -> pass variable and toggle function to FOOTER (for display and setting purposes) and variable to BODY -> PLAYLIST (for information purpose) via props
  // set user status: determine whether a user is currently not connected to the server, connected but not logged in, connected and logged in (some actions and status messages depend on the connection and login status)
  const [userStatus, setUserStatus] = useState(""); // -> call "useEffect" in the App function with a request to the server in order to determine whether both are connected to each other and save the result in the variable (via setter function); pass setter to MENU as well (to determine login status) via props
  // set status message: display message in the FOOTER that gets triggered by certain user actions (pressing the send data button of the song FORM, deleting songs etc.); connection-related messages depend on "userStatus" variable (disconnected, not logged in, logged in)
  const [statusMessage, setStatusMessage] = useState(""); // -> pass setter function to various components where certain events happen (e.g. FORM, PLAYLIST) and variable to FOOTER (for information/display purpose) via props ("useReducer" hook as alternative?)
  // set username: get username from server token after logging in (through the MENU login component), display current username in the top section of the HEADER
  const [username, setUsername] = useState(""); // -> pass setter function to MENU (for data retrieval purpose (from login)) and variable to HEADER (for display purpose) via props; save username in localstorage
  // set playlist data: get playlist data from dropdown menu in the HEADER by selecting one of the playlist names, which renders the respective playlist data into SONG components within the PLAYLIST container
  const [playlistData, setPlaylistData] = useState([]); // -> pass setter function to HEADER (for data retrieval purpose (from dropdown menu)) and variable to BODY -> PLAYLIST via props

  return <></>;
}
