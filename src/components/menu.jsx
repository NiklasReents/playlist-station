import { useState, useRef, useEffect } from "react";

export default function Menu({
  menuContent,
  registerData,
  loginData,
  settingsData,
  setRegisterData,
  setLoginData,
  setSettingsData,
}) {
  const [fetchResult, setFetchResult] = useState("");
  const formRef = useRef();
  const url =
    "http://localhost:3000/users/" + menuContent.toLowerCase() + "-user";
  let formData = new FormData(formRef.current);

  function updateFormData(setData, data, name, value) {
    setData({ ...data, [name]: value });
    formData.append(name, value);
  }
  // initialize "formData" with the updated form output of each respective "MENU" component after the first render; may be subject to change
  useEffect(() => {
    if (menuContent !== "Settings") {
      formData = new FormData(formRef.current);
    }
  }, []);

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
            if (!response.ok) {
              setFetchResult(response.statusText);
            }
            setFetchResult(await response.text());
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
        for testing purposes only
      */}
      {fetchResult}
    </>
  );
}
