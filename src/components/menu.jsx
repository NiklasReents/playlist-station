import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";

export default function Menu({
  menuContent,
  registerData,
  loginData,
  settingsData,
  setRegisterData,
  setLoginData,
  setSettingsData,
  setUsername,
  setLoginButton,
}) {
  const [fetchResult, setFetchResult] = useState("");
  const [cookies, setCookie] = useCookies(["userToken"]);
  const formRef = useRef();
  const url =
    menuContent !== "Settings"
      ? "http://localhost:3000/users/" + menuContent.toLowerCase() + "-user"
      : "";
  let formData = new FormData(formRef.current);
  // initialize "formData" with the updated form output of each respective "MENU" component after the first render; may be subject to change
  useEffect(() => {
    if (menuContent !== "Settings") {
      formData = new FormData(formRef.current);
    }
  }, []);
  // determine user registration and login UI output and data processing
  function processResult(result) {
    let currentUser;
    switch (Object.keys(result)[0]) {
      case "valErrors":
        // display registration validation errors
        setFetchResult(() => {
          return result.valErrors.map((v, i) => {
            return <div key={i}>{v.msg}</div>;
          });
        });
        break;
      case "loginData":
        // user login (including token and user data storage in a cookie and the local storage)
        currentUser = result.loginData[1].split(" ")[0];
        setFetchResult(result.loginData[1]);
        setUsername(currentUser);
        setLoginButton("Logout");
        setCookie("userToken", result.loginData[0], {
          expires: new Date(new Date().setDate(new Date().getDate() + 1)),
        });
        localStorage.setItem("currentUser", currentUser);
        location.href = "/";
        break;
      default:
        // display simple registration and login (validation error) messages
        setFetchResult(result.message);
        if (result.message.includes("registration")) {
          location.href = "/";
        }
    }
  }
  // update global user registration and login data and "formData" content
  function updateFormData(setData, data, name, value) {
    setData({ ...data, [name]: value });
    formData.append(name, value);
  }

  return (
    <>
      <h1>{menuContent}</h1>
      <form
        onSubmit={async (e) => {
          // send "formData" object to web server for user registration and login
          e.preventDefault();
          try {
            const response = await fetch(url, {
              method: "POST",
              body: formData,
            });
            const result = await response.json();
            processResult(result);
          } catch (err) {
            setFetchResult(err.message);
          }
        }}
        ref={formRef}
      >
        {menuContent === "Register" ? (
          <>
            <label htmlFor="username">Username: </label>
            <input
              onChange={(e) => {
                updateFormData(
                  setRegisterData,
                  registerData,
                  e.target.name,
                  e.target.value
                );
              }}
              type="text"
              id="username"
              name="username"
              placeholder="type in a username..."
              value={registerData.username}
              required
            />
            <br />
            <label htmlFor="email">Email: </label>
            <input
              onChange={(e) => {
                updateFormData(
                  setRegisterData,
                  registerData,
                  e.target.name,
                  e.target.value
                );
              }}
              type="email"
              id="email"
              name="email"
              placeholder="type in an email..."
              value={registerData.email}
              required
            />
            <br />
            <label htmlFor="password">Password: </label>
            <input
              onChange={(e) => {
                updateFormData(
                  setRegisterData,
                  registerData,
                  e.target.name,
                  e.target.value
                );
              }}
              type="password"
              id="password"
              name="password"
              placeholder="type in a password..."
              value={registerData.password}
              required
            />
            <br />
          </>
        ) : menuContent === "Login" ? (
          <>
            <label htmlFor="username">Username: </label>
            <input
              onChange={(e) => {
                updateFormData(
                  setLoginData,
                  loginData,
                  e.target.name,
                  e.target.value
                );
              }}
              type="text"
              id="username"
              name="username"
              placeholder="type in a username..."
              value={loginData.username}
              required
            />
            <br />
            <label htmlFor="password">Password: </label>
            <input
              onChange={(e) => {
                updateFormData(
                  setLoginData,
                  loginData,
                  e.target.name,
                  e.target.value
                );
              }}
              type="password"
              id="password"
              name="password"
              placeholder="type in a password..."
              value={loginData.password}
              required
            />
            <br />
            <input type="button" value="Forgot Password" />
            <br />
          </>
        ) : (
          <>
            <label htmlFor="color-primary">Change main color: </label>
            <input
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  colorPrimary: e.target.value,
                })
              }
              type="color"
              id="color-primary"
              name="color-primary"
              value={settingsData.colorPrimary}
            />
            <br />
            <label htmlFor="color-secondary">Change secondary color: </label>
            <input
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  colorSecondary: e.target.value,
                })
              }
              type="color"
              id="color-secondary"
              name="color-secondary"
              value={settingsData.colorSecondary}
            />
            <br />
            {/*
              experimental language setting option that may be dropped from the final version of the app 
            */}
            <label htmlFor="language">Change user language: </label>
            <select
              onChange={(e) =>
                setSettingsData({
                  ...settingsData,
                  appLanguage: e.target.value,
                })
              }
              id="language"
              value={settingsData.appLanguage}
            >
              <option value="english">English</option>
              <option value="german">German</option>
            </select>
            <br />
          </>
        )}
        {menuContent !== "Settings" ? (
          <input type="submit" value="Send Data" />
        ) : (
          <></>
        )}
      </form>
      {/*
        display result of registration- and login-related actions
      */}
      {fetchResult}
    </>
  );
}
